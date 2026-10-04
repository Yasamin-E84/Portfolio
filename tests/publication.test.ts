import assert from "node:assert/strict";
import test from "node:test";
import { defaultPublications } from "../content-engine/default-content";
import { isPublicNow, publicationSchema } from "../content-engine/types";
import { articleGraph } from "../seo-engine/entity";

test("curated publications satisfy the CMS contract", () => {
  for (const item of defaultPublications) assert.equal(publicationSchema.safeParse(item).success, true, item.slug);
});

test("scheduled entries become public only after their timestamp", () => {
  const item = { ...defaultPublications[0], status: "scheduled" as const, scheduledFor: "2030-01-01T10:00:00.000Z" };
  assert.equal(isPublicNow(item, Date.parse("2029-12-31T23:59:59.000Z")), false);
  assert.equal(isPublicNow(item, Date.parse("2030-01-01T10:00:00.000Z")), true);
});

test("article graph exposes Article, Breadcrumb and FAQ entities", () => {
  const graph = articleGraph(defaultPublications[1], "en", "https://example.com") as { "@graph": { "@type": string }[] };
  assert.deepEqual(graph["@graph"].map((entry) => entry["@type"]), ["Article", "BreadcrumbList", "FAQPage"]);
});
