import { handleAnalytics } from "@/lib/contact";
import { getDatabaseServices, getTrustedOrigin } from "@/lib/db";

export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleAnalytics(
    request,
    async () => (await getDatabaseServices())?.store ?? null,
    await getTrustedOrigin(),
  );
}
