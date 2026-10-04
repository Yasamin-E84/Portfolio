import { requireAdmin } from "@/lib/admin-api";
import { listPublications } from "@/content-engine/repository";

type Counts = { total: number; drafts: number; published: number; scheduled: number; missingMetadata: number };
type Run = { id: string; workflow: string; status: string; generatedCount: number; detail: string; createdAt: number };
type ListStatement = { all<T>(): Promise<{ results: T[] }> };

export async function GET(request: Request) {
  const auth = await requireAdmin(request); if (auth.response) return auth.response;
  try {
    const items=await listPublications({includeUnpublished:true});
    const counts:Counts={total:items.length,drafts:items.filter(item=>item.status==="draft").length,published:items.filter(item=>item.status==="published").length,scheduled:items.filter(item=>item.status==="scheduled").length,missingMetadata:items.filter(item=>!item.seoTitle.en||!item.seoTitle.fa||!item.seoDescription.en||!item.seoDescription.fa).length};
    const runs = await (auth.db.prepare("SELECT id,workflow,status,generated_count AS generatedCount,detail,created_at AS createdAt FROM automation_runs ORDER BY created_at DESC LIMIT 12") as unknown as ListStatement).all<Run>();
    return Response.json({ counts, runs: runs.results });
  } catch { return Response.json({ counts: { total: 0, drafts: 0, published: 0, scheduled: 0, missingMetadata: 0 }, runs: [], migrationRequired: true }); }
}
