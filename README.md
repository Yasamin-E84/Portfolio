# Yasamin Soraghi — Portfolio & Technology Field Notes

A bilingual developer portfolio, independent technology publication and client inquiry platform. Yasamin's interactive solar system and hand-drawn notebook now lead into frontend case studies, practical guides, carefully sourced technology notes and personal Signature Updates.

![Yasamin Soraghi portfolio preview](public/og.png)

**Live:** [Cloudflare site](https://yasamin-soraghi.pages.dev/) · [GitHub Pages mirror](https://yasamin-e84.github.io/Portfolio/) · [More work on GitHub](https://github.com/Yasamin-E84)

## Product features

- English and Persian routes with first-class RTL layouts
- Interactive Three.js portfolio, filtered work archive and responsive project mockups
- Technology journal with answer-first articles, sources and FAQs
- Signature Updates for launches, milestones and open-source releases
- Private dark-mode CMS with drafts, publishing, scheduling, featured content and uploads
- SEO metadata, canonical URLs, language alternates, RSS, sitemap and robots policies
- Website, Person, Organization, Article, Breadcrumb and FAQ JSON-LD
- Draft-only Activepieces webhook with a human editorial approval gate
- Privacy-aware visitor and project interaction insights
- Accessible navigation, reduced-motion support, optimized local fonts and lazy media

## Architecture

| Layer | Responsibility |
| --- | --- |
| `content-engine/` | Publication model, validation, fallback content and D1 reads |
| `seo-engine/` | Entity consistency and JSON-LD graphs |
| `admin-components/` | Editorial management and operational dashboard |
| `automation/` | Source registry and Activepieces workflow recipe |
| `ai-prompts/` | Versioned quality and generation rules |
| `app/` | Next.js pages, metadata routes and protected APIs |
| `drizzle/` | Cloudflare D1 migrations |

The Cloudflare Worker hosts the complete dynamic application and CMS. Cloudflare Pages and GitHub Pages receive static exports with curated public content. See [architecture](docs/ARCHITECTURE.md).

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Three.js, Zod, Cloudflare Workers, D1 and R2 through OpenNext.

## Local development

Use Node.js 22 or newer.

```sh
npm ci
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000/en` or `/fa`. The app falls back to checked-in publication content when no Worker binding is present.

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Cloudflare Worker

Create an ignored `.dev.vars` with the required secrets, then:

```sh
npm run build:worker
npx wrangler d1 migrations apply DB --local
npx wrangler dev --port 8787
```

Production requires `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `CONTACT_RATE_SALT` and `AUTOMATION_WEBHOOK_SECRET` as Worker secrets. Apply migrations before deploying. Never commit these values.

## Content operations

- [Editorial guide: articles and Signature Updates](docs/EDITORIAL_GUIDE.md)
- [Activepieces automation setup and client reuse](docs/CONTENT_AUTOMATION.md)
- [System architecture](docs/ARCHITECTURE.md)
- [Contribution rules](CONTRIBUTING.md)
- [Release history](CHANGELOG.md)

The automation system cannot publish. It accepts validated drafts, forces draft status, and leaves review, scheduling and publication to Yasamin in the admin.

## Creative work and licenses

The visual work is Yasamin's selected educational and personal portfolio material. Brand names and trademarks belong to their owners. Inclusion in this repository does not grant redistribution rights. Self-hosted fonts retain their license notices under `public/fonts/`.
