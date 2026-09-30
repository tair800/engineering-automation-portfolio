# Project status — portfolio site

**Milestone:** v1.1 live at https://tahir-aslanli.vercel.app (Vercel Hobby, deployed from `main`).
The home page was rebuilt for a reader with a minute; the case studies keep every figure, visual
and limitation.

## Contents

- Home: hero (name, title, current role, one positioning line, the line that separates the role
  from the independent projects, three principles); the three flagships, each with a one-line
  problem and build, one lead figure, its skills and links; the other four projects in a row each;
  four capability groups; the current role; contact.
- One case study per project: overview, evidence, architecture diagram, engineering notes,
  screenshots with provenance, limitations as the project states them, facts and stack.

## Verified

- Every project record was fact-checked claim by claim against its repository's README, decision
  log, artifacts and screenshots, and corrected where the wording went beyond the source.
- Home-page rebuild (2026-09-30): an engineering claim review against the seven project
  repositories and a design review, and their well-supported findings applied — among them the
  qualifications that now travel with the Ledger, Counterparty Resolver and Parts Answer Gate
  figures, and Market Approach Desk's conflict rules described as its code implements them.
- `npm run lint`, `npm run typecheck`, `npm test` (48 content-integrity tests) and `npm run build`
  pass locally and in GitHub Actions; all 22 routes are static.
- `npm run check:links` against production: 48 internal links and assets and 20 external links
  return 200. LinkedIn refuses automated requests (999); its URL matches the GitHub profile.
- Home page on production, every section rendered, fresh browser: 3,952 px at 1440 and 1280 (was
  11,605), 4,127 px at 1024, 6,070 px at 768, 7,264 px at 390 (was 21,815) and 7,677 px at 360 (was
  23,046); 558 DOM nodes (was 1,742); HTML 127 KB uncompressed and 16 KB with Brotli (was 417 KB
  and 34 KB); no image is loaded.
- No horizontal overflow at 360, 390, 768, 1024, 1280 and 1440 px, in light and dark themes.
- Mobile menu opens, closes on Escape and on navigation; its entrance is CSS, and the `motion`
  dependency is gone (about 37 KB less gzipped JavaScript on every page).
- Lighthouse, run from the development machine against production, home page: accessibility,
  best practices and SEO 100; performance 99 on the desktop profile. On the mobile profile, over
  four runs, performance 81–90 (about 73 before), first contentful paint 1.7–1.9 s (3.2 s),
  largest contentful paint 3.3–3.5 s (5.0 s) and total blocking time 150–360 ms (one run before:
  140 ms). This machine's Chrome still receives the HTML uncompressed, so mobile timings are
  pessimistic.
- Recruiter check, fresh browser at 1440×900: name, title, employer, positioning, the three
  principles, GitHub and LinkedIn are on the first screen, the three flagship names at 0.95
  screens, the first result at 1.33 and the first Live demo link at 1.69. At 390×844: identity and
  employer on the first screen, the principles at about one screen, the flagships from 1.65.

## Known limitations

- Bordereaux Reconciler's free demo database expires on 24 October 2026, as its repository
  states; its case study says so, and after that only its evidence page keeps working unless that
  project re-provisions the database.
- Free-tier project backends sleep. Ledger Exception Control Plane and Market Approach Desk
  explain and wait out a cold start in their own consoles, and Ledger Exception Control Plane
  offers one-click public demo roles. The three demos served directly from Render show Render's
  own wake-up screen for up to about a minute, so only those three carry a note beside their Live
  demo link.
- Market Approach Desk's own live comparison screen and README still list a "held by another
  broker" conflict rule that its code does not implement. The site no longer repeats it; correcting
  the project's copy is a change to that repository.
- Agent Authorization Broker's repository does not record which host its screenshots were taken
  from, so the site labels them as screenshots from the repository rather than the live
  deployment.

## Next

- Revisit when a project changes status; add a project only when its own repository records it as
  complete.
