import { getBoundDatabase } from "@/lib/db";
import { defaultPortfolioConfig, isPortfolioConfig } from "@/lib/portfolio-config";

function cors(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  const allowed = origin === "https://yasamin-e84.github.io" || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return allowed ? {"Access-Control-Allow-Origin":origin,"Vary":"Origin"} : {};
}
export async function OPTIONS(request: Request) { return new Response(null,{status:204,headers:{...cors(request),"Access-Control-Allow-Methods":"GET","Access-Control-Allow-Headers":"Content-Type"}}); }
export async function GET(request: Request) {
  const db = await getBoundDatabase();
  let value = defaultPortfolioConfig;
  if (db) {
    type Row={id:string;data:string}; type ListStatement={all<T=Row>():Promise<{results:T[]}>};
    const rows=await (db.prepare("SELECT id,data FROM portfolio_content WHERE id='main' OR id LIKE 'main:%' OR id LIKE 'field:%' ORDER BY id") as unknown as ListStatement).all<Row>();
    const combined=rows.results.find(row=>row.id==="main");
    if(combined){try{const parsed:unknown=JSON.parse(combined.data);if(isPortfolioConfig(parsed))value=parsed;}catch{}}
    const sections=rows.results.filter(row=>row.id.startsWith("main:"));
    if(sections.length){value=structuredClone(defaultPortfolioConfig);for(const row of sections){const key=row.id.slice(5) as keyof typeof value;if(key in value){try{(value as unknown as Record<string,unknown>)[key]=JSON.parse(row.data);}catch{}}}}
    const fields=rows.results.filter(row=>row.id.startsWith("field:"));
    for(const section of ["projects","artworks","motion"] as const)if(fields.some(row=>row.id===`field:${section}:_managed`))value[section]=[];
    const projectParts=new Map<string,Record<string,unknown>>();
    for(const row of fields){const [,section,key]=row.id.split(":");if(key==="_managed")continue;try{const parsed=JSON.parse(row.data);if(section==="profile"||section==="about"||section==="settings")(value[section] as unknown as Record<string,unknown>)[key]=parsed;else if(section==="projects"&&key.includes("__")){const group=key.split("__")[0];projectParts.set(group,{...(projectParts.get(group)||{}),...parsed});}else if(section==="projects"||section==="artworks"||section==="motion")value[section].push(parsed);}catch{}}
    value.projects.push(...Array.from(projectParts.entries()).sort(([a],[b])=>a.localeCompare(b)).map(([,item])=>item as (typeof value.projects)[number]));
  }
  return Response.json(value,{headers:{...cors(request),"Cache-Control":"public, max-age=30, stale-while-revalidate=120","X-Content-Type-Options":"nosniff"}});
}
