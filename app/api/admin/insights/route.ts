import { requireAdmin } from "@/lib/admin-api";
export async function GET(request: Request) {
  const auth=await requireAdmin(request); if(auth.response)return auth.response;
  type ListStatement={all<T=Record<string,unknown>>():Promise<{results:T[]}>};
  const messages=await (auth.db.prepare("SELECT id,name,email,message,locale,created_at AS createdAt FROM contact_messages ORDER BY created_at DESC LIMIT 50") as unknown as ListStatement).all();
  const analytics=await (auth.db.prepare("SELECT day,path,locale,views FROM analytics_daily ORDER BY day DESC,views DESC LIMIT 100") as unknown as ListStatement).all();
  return Response.json({messages:messages.results,analytics:analytics.results},{headers:{"Cache-Control":"no-store"}});
}
