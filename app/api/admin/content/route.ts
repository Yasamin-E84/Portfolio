import { requireAdmin, readJson, recordAudit, sameOrigin } from "@/lib/admin-api";
import { defaultPortfolioConfig, isPortfolioConfig } from "@/lib/portfolio-config";
export async function GET(request: Request) {
  const auth=await requireAdmin(request); if(auth.response)return auth.response;
  type Row={id:string;data:string;updated_at:number;version:number};type ListStatement={all<T=Row>():Promise<{results:T[]}>};
  const rows=await (auth.db.prepare("SELECT id,data,updated_at,version FROM portfolio_content WHERE id='main' OR id LIKE 'main:%' OR id LIKE 'field:%' ORDER BY id") as unknown as ListStatement).all<Row>();
  let content=structuredClone(defaultPortfolioConfig);const combined=rows.results.find(row=>row.id==="main");
  if(combined){try{const parsed:unknown=JSON.parse(combined.data);if(isPortfolioConfig(parsed))content=parsed;}catch{}}
  for(const row of rows.results.filter(row=>row.id.startsWith("main:"))){const key=row.id.slice(5) as keyof typeof content;if(key in content){try{(content as unknown as Record<string,unknown>)[key]=JSON.parse(row.data);}catch{}}}
  const fields=rows.results.filter(row=>row.id.startsWith("field:"));for(const section of ["projects","artworks","motion"] as const)if(fields.some(row=>row.id===`field:${section}:_managed`))content[section]=[];
  const projectParts=new Map<string,Record<string,unknown>>();for(const row of fields){const [,section,key]=row.id.split(":");if(key==="_managed")continue;try{const parsed=JSON.parse(row.data);if(section==="profile"||section==="about"||section==="settings")(content[section] as unknown as Record<string,unknown>)[key]=parsed;else if(section==="projects"&&key.includes("__")){const group=key.split("__")[0];projectParts.set(group,{...(projectParts.get(group)||{}),...parsed});}else if(section==="projects"||section==="artworks"||section==="motion")content[section].push(parsed);}catch{}}
  content.projects.push(...Array.from(projectParts.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([,item])=>item as (typeof content.projects)[number]));
  return Response.json({content,updatedAt:Math.max(0,...rows.results.map(row=>row.updated_at)),version:Math.max(0,...rows.results.map(row=>row.version))},{headers:{"Cache-Control":"no-store"}});
}
export async function PUT(request: Request) {
  if(!sameOrigin(request))return Response.json({error:"Invalid request"},{status:403});
  const auth=await requireAdmin(request); if(auth.response)return auth.response;
  const input=await readJson<{section?:string;key?:string;value?:unknown}>(request,20_000);
  const sections=["profile","about","projects","artworks","motion","settings"] as const;
  const section=sections.find(item=>item===input?.section);
  if(!section||!input?.key||!/^[a-zA-Z0-9_-]{1,100}$/.test(input.key)||input?.value===undefined)return Response.json({error:"Some fields are invalid"},{status:400});
  const serialized=JSON.stringify(input.value);if(serialized.length>100_000)return Response.json({error:"This section is too large"},{status:413});
  const now=Math.floor(Date.now()/1000);
  try {
    const id=`field:${section}:${input.key}`;const current=await auth.db.prepare("SELECT version FROM portfolio_content WHERE id=?").bind(id).first<{version:number}>();
    await auth.db.prepare("INSERT OR REPLACE INTO portfolio_content (id,data,updated_at,version) VALUES (?,?,?,?)").bind(id,serialized,now,(current?.version||0)+1).run();
    await recordAudit(auth.db,"content.update",section);
    return Response.json({ok:true,updatedAt:now},{headers:{"Cache-Control":"no-store"}});
  } catch (error) {
    console.error(JSON.stringify({event:"admin_content_update_failed",message:error instanceof Error?error.message:"unknown"}));
    return Response.json({error:"Publishing is temporarily unavailable"},{status:503});
  }
}
export async function DELETE(request:Request){if(!sameOrigin(request))return Response.json({error:"Invalid request"},{status:403});const auth=await requireAdmin(request);if(auth.response)return auth.response;const section=new URL(request.url).searchParams.get("section");if(!["profile","about","projects","artworks","motion","settings"].includes(section||""))return Response.json({error:"Invalid section"},{status:400});await auth.db.prepare("DELETE FROM portfolio_content WHERE id LIKE ?").bind(`field:${section}:%`).run();if(["projects","artworks","motion"].includes(section||""))await auth.db.prepare("INSERT INTO portfolio_content (id,data,updated_at,version) VALUES (?,?,?,1)").bind(`field:${section}:_managed`,"true",Math.floor(Date.now()/1000)).run();return Response.json({ok:true});}
