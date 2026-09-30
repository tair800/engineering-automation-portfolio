@AGENTS.md

# CLAUDE.md — portfolio site

Operating contract for this repository: the public site that presents the portfolio's finished
projects. It measures nothing itself; every claim it makes belongs to a project repository.

## Architecture

- Next.js 16 App Router. Every route is prerendered at build time (`generateStaticParams`,
  `dynamicParams = false`); there is no server-side data, database or API.
- Content lives only in `src/data/*.ts` (typed by `src/data/types.ts`). Components render it and
  hold no project copy of their own.
- Evidence visuals (`src/components/visuals/*`) and architecture diagrams
  (`src/components/flow-diagram.tsx`) are drawn from those records, on the case-study pages.
- Theme: an inline script sets `data-theme` on `<html>` before first paint; without script the
  `prefers-color-scheme` block in `globals.css` applies. Colours are tokens in `globals.css`.
- Open Graph images are generated at build time with `next/og` from the same data.

## The home page is for a reader with a minute

It holds six things and nothing else: the hero (name, title, current role, one positioning line,
the line that separates the role from the public projects, three short principles); the three
flagships (problem and build in a line each, the one `lead` figure, at most five skills, Case
study / Live demo / GitHub); the other projects in one row each (tagline, `lead` figure, links —
a negative result keeps its status badge); four capability groups; the current role (a summary
and at most three areas); contact. Architecture, the full evidence, evidence visuals and
limitations belong on the case studies. Each figure appears once on the home page.

"Production" describes only the professional role, never the public projects; no "agentic" claim.

## Commands

```bash
npm run dev | build | start
npm run lint
npm run typecheck      # next typegen, then tsc
npm test               # tests/data.test.ts
npm run check:links -- http://localhost:3000   # against a running build
node scripts/prepare-shots.mjs ../projects     # re-derive public/shots from the project repos
```

Before every commit: lint, typecheck, test and build must pass.

## Non-negotiable content rules

1. **Every figure comes from the project's own committed evidence** — its README, decision log
   or artifacts — and keeps the qualification the project attaches to it. Never round up, never
   re-label, never measure anything here.
2. **Negative results stay visible.** Parts Answer Gate's status is exactly "Closed —
   pre-registered negative result" with "Deployed / live"; its failed kill conditions stay on
   the page.
3. **Only finished projects appear.** A project is added when its own repository records it as
   complete.
4. **No exactly-once claim** anywhere; at-most-once effects are stated with their conditions.
5. **Terraform that was validated but never applied is described exactly so.** No page may imply
   a cloud deployment that did not happen.
6. **Screenshots are the projects' own captures**, cropped and re-encoded only. No mock-ups.
7. **The current role is described only in its public terms.** No internal system, data,
   architecture, URL or colleague is named, and no email address is published.
8. **No secrets.** The site needs none; `.env.example` documents the one optional variable.
9. **No tooling attribution** in commits, pull requests or content.

## Deployment

Vercel Hobby, production branch `main`. Static output only; no paid features.
