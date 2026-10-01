# Project status — portfolio site

**Milestone:** v1.2 live at https://tahir-aslanli.vercel.app (Vercel Hobby, deployed from `main`).
The home page is written in plain English for a non-technical recruiter; every case study opens
with the same plain summary and keeps its full technical account below it.

## Contents

- Home: hero (name, title, one sentence, the employer, what he works with, three links); Selected
  work — the three flagships, each with what it does, what was built, one result, four
  technologies and its links; More projects, a line each; Experience with the core technologies;
  Contact.
- One case study per project: "In short" (what it does, why it matters, what was built, the key
  result), then overview, evidence, architecture diagram, engineering notes, screenshots with
  provenance, limitations as the project states them, facts and stack.

## Verified

- Every project record was fact-checked claim by claim against its repository's README, decision
  log, artifacts and screenshots, and corrected where the wording went beyond the source.
- Plain-English rewrite (2026-10-01): a non-technical recruiter review and a technical hiring
  manager review, and their well-supported findings applied; every simplified claim was checked
  again against the repositories (the Ledger guarantee as designed and conditional, the broker's
  twelve as planted breaches, Parts Answer Gate's 600 as queries, Bordereaux's 715 rows all given
  the right status).
- `npm run lint`, `npm run typecheck`, `npm test` (45 content-integrity checks, including a jargon
  guard on the plain sentences) and `npm run build` pass locally and in GitHub Actions; all 22
  routes are static.
- `npm run check:links` against production: 48 internal links and assets and 20 external links
  return 200. LinkedIn refuses automated requests (999); its URL matches the GitHub profile.
- Home page on production, fresh browser, every section rendered: 2,625 px at 1440 and 1280 (3,952
  before this rewrite, 11,605 before the first), 2,721 at 1024, 3,687 at 768, 4,144 at 390 (7,264
  and 21,815) and 4,292 at 360; 325 DOM nodes; no image loaded. No horizontal overflow at 360,
  390, 768, 1024, 1280 and 1440 px, in light and dark themes.
- Visual noise on the home page, counted by computed style: 649 words (1,176 before), 0 eyebrow
  labels (39), 0 badges or pills (2), 0 bordered boxes (5), 0 tinted panels (12), and one figure
  per flagship (7 headline figures before).
- Lighthouse, run from the development machine against production, home page: accessibility,
  best practices and SEO 100; performance 99 on the desktop profile and 83–89 over three mobile
  runs (first contentful paint 1.6 s, largest contentful paint 3.2–3.5 s). This machine's Chrome
  receives the HTML uncompressed, so mobile timings are pessimistic.
- Recruiter check, fresh browser at 1440×900: what he does, where he works, what he works with and
  the three selected projects are on the first screen; the first result at 1.15 screens. At
  390×844: the same answers on the first screen, the first result at 1.21 screens.

## Known limitations

- Bordereaux Reconciler's free demo database expires on 24 October 2026, as its repository
  states; its case study says so, and after that only its evidence page keeps working unless that
  project re-provisions the database.
- Free-tier backends sleep: the three demos served from Render carry a one-line note beside their
  Live demo link; Ledger Exception Control Plane and Market Approach Desk wait out a cold start in
  their own consoles.
- No public demo calls a live model: each uses a declared stand-in or has no model. Ledger
  Exception Control Plane's one bounded live-model evaluation is reported on its case study.
- Market Approach Desk's own live comparison screen and README still list a "held by another
  broker" conflict rule that its code does not implement; the site does not repeat it.
- Agent Authorization Broker's repository does not record which host its screenshots were taken
  from, so the site labels them as screenshots from the repository.

## Next

- For the owner: whether to show earlier roles beside the current one (it needs real titles,
  employers and dates), and how to describe the working method behind the projects' fast,
  same-day build histories — both raised by the technical review and not decided here.
- Revisit when a project changes status; add a project only when its own repository records it as
  complete.
