# Engineering portfolio — Tahir Aslanli

The source of my public engineering portfolio: seven independent projects in AI automation,
agent security, retrieval and reliable backend systems, each shown with the test that could have
proven it wrong, its measured results — including the negative ones — and its limitations.

**Live site:** https://tahir-aslanli.vercel.app

Every project on the site is its own public repository with its own tests, CI and deployment. This
repository only presents them; it adds no measurements of its own.

## Stack

- **Next.js 16** (App Router), every route prerendered as static HTML at build time
- **TypeScript** and **Tailwind CSS 4**; the only animation is a CSS fade on the mobile menu
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
src/data/projects.ts      the seven projects: a plain-English summary (what it does, why it
                          matters, what was built, the key result, a few technologies), then the
                          technical record — problem, built, hard part, evidence, architecture,
                          case-study notes, limitations, stack, screenshots and links
src/data/skills.ts        the core technologies, each mapped to the projects (or the role) that
                          use it
src/data/profile.ts       name, role, experience and contact links
```

There are two audiences. The home page (`src/app/page.tsx`, from `src/components/home/*`) is
written for a recruiter with half a minute, in plain English: who Tahir is, three selected
projects with one result each, the other four in a line each, the current role with its core
technologies, and contact. The case-study pages (`src/app/projects/[slug]/page.tsx`) are for a
technical reader: each opens with the same plain-English summary, then the full evidence, a bespoke
evidence visual (`src/components/visuals/*`) drawn from the project's own committed results — the
chaos-suite grid, the attack matrix, the mapping-accuracy bars, the kill-condition grid — an
architecture diagram (`src/components/flow-diagram.tsx`) built from that project's actual
components, and its limitations.

Adding a project is one entry in `projects.ts` plus its screenshots.

### Rules the content follows

- Every number is copied from the project's own README or committed artifacts, and the source is
  named beside the visual that shows it. Nothing is re-measured, rounded up or re-labelled here.
- Negative results are shown with the same weight as the rest.
- A project that is not finished is not shown.
- The current role is described only in its public terms; no internal system, data or architecture
  is referenced.

`tests/data.test.ts` enforces what can be checked mechanically: screenshot files exist at their
declared sizes, every cross-reference resolves, exactly the seven published projects appear, the
plain-English sentences stay one sentence each and free of engineering jargon, each flagship's
figure is the one its evidence leads with, technologies come from the project's own stack, a
negative result carries a plain caveat to the home page, and wordings the projects themselves
rule out — an exactly-once claim, an Azure deployment, a conflict rule a project does not
implement, "production" applied to the public projects, a data source the entity-resolution
corpus did not use — never appear.

## Screenshots

Every screenshot was captured by the project it belongs to and committed in that repository's
`docs/screenshots`. `scripts/prepare-shots.mjs` copies them into `public/shots`, cropping (from the
top, or to one panel of a screen) and re-encoding as WebP; it edits nothing else. Each figure on the site states whether the
project records it as captured from its live deployment.

## Accessibility and SEO

Semantic landmarks and headings, a skip link, visible focus, keyboard-operable navigation, text
labels alongside every colour-coded result, and light and dark themes that follow the system
setting until changed. Pages carry per-route metadata, Open Graph and Twitter images generated at
build time, a sitemap and `robots.txt`.

## Licence

The source code is released under the MIT licence (see `LICENSE`). The written content describes
my own work; the screenshots come from the linked project repositories.
