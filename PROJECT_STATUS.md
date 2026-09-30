# Project status — portfolio site

**Milestone:** v1 live at https://tahir-aslanli.vercel.app (Vercel Hobby, deployed from `main`).

## Contents

- Home: hero with project index, three featured systems with their evidence visuals, the
  measured-results ledger (including negative results), capabilities mapped to evidence, all seven
  projects, current role, engineering principles, contact.
- One case study per project: overview, evidence, architecture diagram, engineering notes,
  screenshots with provenance, limitations as the project states them, facts and stack.

## Verified

- Every project record was fact-checked claim by claim against its repository's README, decision
  log, artifacts and screenshots, and corrected where the wording went beyond the source.
- Three independent reviews — design, recruiter, engineering claims — and their well-supported
  findings applied.
- `npm run lint`, `npm run typecheck`, `npm test` (38 content-integrity tests) and `npm run build`
  pass locally and in GitHub Actions; all 22 routes are static.
- `npm run check:links` against production: 49 internal links and assets and 19 external links
  return 200. LinkedIn refuses automated requests (999); its URL matches the GitHub profile.
- No horizontal overflow at 360, 375, 390, 768, 1280 and 1440 px, in light and dark themes.
- Mobile menu opens, closes on Escape and on navigation; theme toggle persists; skip link is the
  first focusable element.
- Lighthouse, run from the development machine against production: accessibility, best practices
  and SEO 100; performance 97–99 on the desktop profile. On the mobile profile the case studies
  score 79–91 and the home page about 60. The development machine's Chrome receives the HTML
  uncompressed (about 415 KB), while other clients receive about 34 KB with Brotli, so the
  simulated mobile load times are pessimistic; the page's main-thread work at 4× CPU slowdown is
  about 2 seconds.

## Known limitations

- Bordereaux Reconciler's free demo database expires on 24 October 2026 (stated on its case
  study); its live screens will empty after that unless that project re-provisions it.
- Free-tier project backends sleep; a first request can take about a minute (stated in the hero).
- Agent Authorization Broker's repository does not record which host its screenshots were taken
  from, so the site labels them as screenshots from the repository rather than the live
  deployment.
- The home page is long by design — seven projects with their evidence — and its mobile
  performance score reflects that.

## Next

- Revisit when a project changes status; add a project only when its own repository records it as
  complete.
