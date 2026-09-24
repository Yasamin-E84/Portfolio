import { handleContact } from "@/lib/contact";
import { getDatabaseServices, getTrustedOrigin } from "@/lib/db";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleContact(request, getDatabaseServices, await getTrustedOrigin());
}
