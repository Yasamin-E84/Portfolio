import { requireAdmin } from "@/lib/admin-api";
export async function GET(request: Request) {
  const auth=await requireAdmin(request); if(auth.response)return auth.response;
  type ListStatement={all<T=Record<string,unknown>>():Promise<{results:T[]}>};
  const messages=await (auth.db.prepare("SELECT id,name,email,message,locale,created_at AS createdAt FROM contact_messages ORDER BY created_at DESC LIMIT 50") as unknown as ListStatement).all();
  const analytics=await (auth.db.prepare("SELECT day,path,locale,views FROM analytics_daily ORDER BY day DESC,views DESC LIMIT 100") as unknown as ListStatement).all();
  const sessions=await (auth.db.prepare("SELECT session_id AS sessionId,country,region,city,first_seen AS firstSeen,last_seen AS lastSeen,page_views AS pageViews,event_count AS eventCount FROM analytics_sessions ORDER BY last_seen DESC LIMIT 100") as unknown as ListStatement).all();
  const events=await (auth.db.prepare("SELECT session_id AS sessionId,event_type AS eventType,path,target,locale,created_at AS createdAt FROM analytics_events ORDER BY created_at DESC LIMIT 300") as unknown as ListStatement).all();
  const unique=await auth.db.prepare("SELECT COUNT(DISTINCT visitor_hash) AS count FROM analytics_sessions").first<{count:number}>();
  return Response.json({messages:messages.results,analytics:analytics.results,sessions:sessions.results,events:events.results,uniqueVisitors:unique?.count||0},{headers:{"Cache-Control":"no-store"}});
}
