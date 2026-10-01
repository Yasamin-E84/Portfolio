import { handleAnalytics } from "@/lib/contact";
import { getDatabaseServices, getTrustedOrigin } from "@/lib/db";

export const runtime = "nodejs";
const publicOrigin = "https://yasamin-e84.github.io";
export async function OPTIONS(request: Request) {
  const origin=request.headers.get("origin");
  return new Response(null,{status:204,headers:origin===publicOrigin?{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"POST","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"}:{}});
}
export async function POST(request: Request) {
  const response=await handleAnalytics(
    request,
    async () => (await getDatabaseServices())?.store ?? null,
    await getTrustedOrigin(),
  );
  if(request.headers.get("origin")===publicOrigin){response.headers.set("Access-Control-Allow-Origin",publicOrigin);response.headers.set("Vary","Origin");}
  return response;
}
