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

## The home page is for a recruiter with half a minute

Plain English first, technical detail second. The home page holds five things: the hero (name,
title, one sentence on what Tahir builds, the current employer, what he works with, three links);
Selected work (the three flagships — what it does, what was built, one figure with a plain label,
at most four technologies, Case study / Live demo / GitHub); More projects (a line each, with a
plain caveat where a result is negative); Experience (the current role in a sentence and the core
technologies as plain names); Contact. No eyebrow labels, badges, chips, tinted panels or metric
grids: one figure per flagship and none on the other projects.

All of it comes from each project's `plain` record in `projects.ts`, which also opens the case
study ("In short"); the technical account follows it unchanged. A fact appears once: the
independence of the projects is stated only above Selected work, and a free-tier note only beside
the Live demo link it concerns. Simplifying keeps the meaning — no guarantee stated more strongly,
no negative result softened. "Production" describes only the professional role, never the public
projects; no "agentic" claim.

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
   pre-registered negative result" with "Deployed / live" on its case study, which keeps its
   failed kill conditions; the home page states the closure in plain English beside the project.
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
