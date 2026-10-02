import { analyticsSchema, handleAnalytics, hashRateKey } from "@/lib/contact";
import { getBoundDatabase, getDatabaseServices, getTrustedOrigin } from "@/lib/db";

export const runtime = "nodejs";
const publicOrigin = "https://yasamin-e84.github.io";
export async function OPTIONS(request: Request) {
  const origin=request.headers.get("origin");
  return new Response(null,{status:204,headers:origin===publicOrigin?{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"}:{}});
}
export async function POST(request: Request) {
  const detailRequest=request.clone();
  const origin=request.headers.get("origin");const ownOrigin=new URL(request.url).origin;
  const trusted=origin===publicOrigin||origin===ownOrigin?origin:await getTrustedOrigin();
  const response=await handleAnalytics(
    request,
    async () => (await getDatabaseServices())?.store ?? null,
    trusted||undefined,
  );
  if(response.status===204){
    try{
      const event=analyticsSchema.parse(await detailRequest.json());
      if(event.sessionId){
        const services=await getDatabaseServices();const db=await getBoundDatabase();
        if(services&&db){
          const now=Math.floor(Date.now()/1000);const cf=(request as Request&{cf?:Record<string,unknown>}).cf||{};
          const clean=(value:unknown,max:number)=>typeof value==="string"?value.slice(0,max):"";
          const visitorHash=await hashRateKey(request.headers.get("cf-connecting-ip")||"unidentified-client",services.salt);
          await db.prepare("DELETE FROM analytics_events WHERE created_at < ?").bind(now-90*86400).run();
          await db.prepare("DELETE FROM analytics_sessions WHERE last_seen < ?").bind(now-90*86400).run();
          await db.prepare("INSERT INTO analytics_sessions (session_id,visitor_hash,country,region,city,first_seen,last_seen,page_views,event_count) VALUES (?,?,?,?,?,?,?,0,0) ON CONFLICT(session_id) DO UPDATE SET last_seen=excluded.last_seen,country=excluded.country,region=excluded.region,city=excluded.city").bind(event.sessionId,visitorHash,clean(cf.country,2),clean(cf.region,80),clean(cf.city,80),now,now).run();
          await db.prepare("UPDATE analytics_sessions SET page_views=page_views+?,event_count=event_count+1 WHERE session_id=?").bind(event.event==="page_view"?1:0,event.sessionId).run();
          await db.prepare("INSERT INTO analytics_events (id,session_id,event_type,path,target,locale,created_at) VALUES (?,?,?,?,?,?,?)").bind(crypto.randomUUID(),event.sessionId,event.event,event.path,event.target,event.locale,now).run();
        }
      }
    }catch(error){console.error(JSON.stringify({event:"analytics_detail_failed",message:error instanceof Error?error.message:"unknown"}));}
  }
  if(request.headers.get("origin")===publicOrigin){response.headers.set("Access-Control-Allow-Origin",publicOrigin);response.headers.set("Vary","Origin");}
  return response;
}
