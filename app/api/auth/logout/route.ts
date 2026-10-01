import { sessionCookie } from "@/lib/admin-auth";
import { sameOrigin } from "@/lib/admin-api";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error:"Invalid request" }, { status:403 });
  return Response.json({ ok:true }, { headers:{"Set-Cookie":sessionCookie("", request, 0),"Cache-Control":"no-store"} });
}
