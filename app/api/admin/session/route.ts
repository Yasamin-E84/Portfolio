import { readSession } from "@/lib/admin-auth";
export async function GET(request: Request) {
  const session = await readSession(request);
  return session ? Response.json({ authenticated:true, email:session.email }, {headers:{"Cache-Control":"no-store"}}) : Response.json({authenticated:false},{status:401,headers:{"Cache-Control":"no-store"}});
}
