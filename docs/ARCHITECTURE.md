# Publication architecture

`content-engine` owns content types, validation, fallback entries and D1 reads. `seo-engine` owns entity and page graphs. `admin-components` provides the editorial desk. `automation` describes collection and delivery. `ai-prompts` contains versioned editorial behavior.

The Cloudflare Worker is the full application: authenticated admin, D1 content, uploads, analytics and contact storage. Media currently uses the implemented D1 fallback because R2 has not been enabled on the account; adding a `MEDIA` R2 binding later moves new uploads to object storage without changing the CMS. GitHub Pages and the root Cloudflare Pages mirror are static exports. They include curated fallback publications, SEO routes and the same presentation, while runtime CMS entries appear immediately on the Worker deployment.

Public entries support `draft`, `scheduled` and `published`. A scheduled entry becomes readable after its time without a database rewrite. Admin APIs require the signed admin session and same-origin mutations. The automation endpoint uses a separate bearer secret and forces all incoming content to draft.
