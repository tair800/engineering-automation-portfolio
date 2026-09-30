# Engineering portfolio — Tahir Aslanli

The source of my public engineering portfolio: seven independent projects in AI automation,
agent security, retrieval and reliable backend systems, each shown with the test that could have
proven it wrong, its measured results — including the negative ones — and its limitations.

**Live site:** https://tahir-aslanli.vercel.app

Every project on the site is its own public repository with its own tests, CI and deployment. This
repository only presents them; it adds no measurements of its own.

## Stack

- **Next.js 16** (App Router), every route prerendered as static HTML at build time
- **TypeScript**, **Tailwind CSS 4**, **Motion** (the Framer Motion library) for the mobile menu
- **Geist** and **Geist Mono**, self-hosted through the `geist` package
- **Vitest** for content-integrity tests
- Deployed on **Vercel** (Hobby). No database, no backend, no analytics, no cookies.

## Running it

Node.js 22 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run lint         # ESLint
npm run typecheck    # route types, then tsc
npm test             # content-integrity tests
npm run build        # production build; every page is static
npm run start        # serve the production build
npm run check:links  # with a build running: every internal and external link it renders
```

No environment variables are required. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` supplies the
canonical origin for metadata; locally the fallback in `src/lib/site.ts` applies.

## How the content is organised

All copy and every figure live in typed data files, and the pages are derived from them:

```
src/data/types.ts         the shape of a project record and of each evidence visual
src/data/projects.ts      the seven projects: problem, built, hard part, evidence, architecture,
                          case-study notes, limitations, stack, screenshots and links
src/data/capabilities.ts  skills, each mapped to the projects (or the role) that demonstrate it
src/data/principles.ts    the engineering principles, each mapped to where it can be checked
src/data/profile.ts       name, role, experience and contact links
```

`src/app/page.tsx` composes the home page from `src/components/home/*`, and
`src/app/projects/[slug]/page.tsx` renders one case study per record. Each flagship has a bespoke
evidence visual (`src/components/visuals/*`) drawn from the project's own committed results — the
chaos-suite grid, the attack matrix, the mapping-accuracy bars, the kill-condition grid — and each
architecture diagram (`src/components/flow-diagram.tsx`) is built from that project's actual
components.

Adding a project is one entry in `projects.ts` plus its screenshots.

### Rules the content follows

- Every number is copied from the project's own README or committed artifacts, and the source is
  named beside the visual that shows it. Nothing is re-measured, rounded up or re-labelled here.
- Negative results are shown with the same weight as the rest.
- A project that is not finished is not shown.
- The current role is described only in its public terms; no internal system, data or architecture
  is referenced.

`tests/data.test.ts` enforces what can be checked mechanically: screenshot files exist at their
declared sizes, every cross-reference resolves, exactly the seven published projects appear, and wordings the
projects themselves rule out — an exactly-once claim, an Azure deployment, a data source the
entity-resolution corpus did not use — never appear.

## Screenshots

Every screenshot was captured by the project it belongs to and committed in that repository's
`docs/screenshots`. `scripts/prepare-shots.mjs` copies them into `public/shots`, cropping from the
top and re-encoding as WebP; it edits nothing else. Each figure on the site states whether the
project records it as captured from its live deployment.

## Accessibility and SEO

Semantic landmarks and headings, a skip link, visible focus, keyboard-operable navigation, text
labels alongside every colour-coded result, and light and dark themes that follow the system
setting until changed. Pages carry per-route metadata, Open Graph and Twitter images generated at
build time, a sitemap and `robots.txt`.

## Licence

The source code is released under the MIT licence (see `LICENSE`). The written content describes
my own work; the screenshots come from the linked project repositories.
