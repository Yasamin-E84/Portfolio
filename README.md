# Yasamin Soraghi — Portfolio

My personal portfolio brings web development, illustration, motion graphics and video editing together in an interactive solar system and a paper notebook.

Explore seven subjects through the planets, browse the filtered Works page, or visit About Me. The interface supports English and Persian, right-to-left layouts, light and dark themes, keyboard navigation and reduced motion.

[More samples on GitHub](https://github.com/Yasamin-E84)

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS and Three.js. A small server-side contact endpoint uses Zod validation and a private SQLite database through Cloudflare D1. Optional analytics record aggregate page counts only after consent.

## Development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/en` or `/fa`. Copy `.env.example` to an ignored local environment file when configuring the site origin. Never commit secrets.

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Worker runtime

```sh
npm run build:worker
npx wrangler d1 migrations apply DB --local
npx wrangler dev --port 8787
```

For local Worker testing, create an ignored `.dev.vars` file with `NEXT_PUBLIC_SITE_URL=http://127.0.0.1:8787` and a random `CONTACT_RATE_SALT` of at least 32 characters. The database binding is named `DB`; the checked-in database identifier is for local development only.

Production needs a Cloudflare-compatible Worker host, its own D1 database, the migrations in `drizzle/`, a private rate-limit secret and the exact HTTPS origin in `NEXT_PUBLIC_SITE_URL`. Set the site origin at build time for metadata and at runtime for request validation. This application includes server routes and requires a server runtime.

The contact form reports success only after saving a message. It does not promise email delivery. The privacy page describes storage, retention and optional analytics.

## Artwork and fonts

The portfolio includes Yasamin’s selected creative studies and educational brand reconstructions. Brand names and trademarks belong to their respective owners. Creative samples are presented for viewing; inclusion in this repository does not grant redistribution rights.

Vazirmatn and Caveat are self-hosted under the SIL Open Font License. Their license notices are included in `public/fonts/`.
