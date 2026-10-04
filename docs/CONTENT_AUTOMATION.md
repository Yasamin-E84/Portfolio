# Content automation

The daily pipeline is a research assistant, not an autonomous publisher. Activepieces fetches the source registry, normalizes links, removes duplicates, asks an AI step to rank relevance and create bilingual structured drafts, then posts validated JSON to `/api/automation/drafts`. The endpoint overwrites `status` to `draft` and `featured` to `false`, so a generated story cannot publish itself.

## Connect Activepieces

1. Self-host Activepieces or create a workspace at Activepieces.
2. Create a flow using [`automation/activepieces-daily-news.template.json`](../automation/activepieces-daily-news.template.json) as the step-by-step recipe. It is deliberately portable instead of depending on one exported Activepieces version.
3. Store `PORTFOLIO_ORIGIN` and a random 32+ character `AUTOMATION_WEBHOOK_SECRET` as encrypted Activepieces secrets.
4. Add the same webhook secret to the Cloudflare Worker with `npx wrangler secret put AUTOMATION_WEBHOOK_SECRET`.
5. Use the sources in [`automation/source-registry.ts`](../automation/source-registry.ts). Check page-based sources periodically because publishers can change markup.
6. Feed the ranking/writing step [`ai-prompts/editorial-agent.md`](../ai-prompts/editorial-agent.md) and validate the output against [`content-engine/publication.schema.json`](../content-engine/publication.schema.json).
7. Send the result with `Authorization: Bearer …`. Open **Admin → Articles**, review sources and both languages, then publish or schedule.

The flow should record failed validation as a failed run and send no draft. Social captions belong in a downstream step that runs only after a published item is observed; the included flow stops at human review.

## Reuse for clients

Keep collection, normalization, ranking and delivery as separate flow blocks. Swap the source registry, editorial prompt, categories and destination secret for each client. Foryxo Studio can use creative-industry sources; Foryxo Menu can use restaurant operations and product updates; a medical education site must use its own medically reviewed prompt and authoritative clinical sources. Each project needs a separate endpoint secret, database and approval queue.
