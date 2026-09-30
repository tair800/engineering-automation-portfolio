# Project status — portfolio site

**Milestone:** v1 built, verified locally, ready to publish.

## Contents

- Home: hero with project index, three featured systems with their evidence visuals, the
  measured-results ledger (including negative results), capabilities mapped to evidence, all seven
  projects in problem / built / hard part / evidence / proof form, current role, engineering
  principles, contact.
- One case study per project: overview, evidence, architecture diagram, engineering notes,
  screenshots with provenance, limitations as the project states them, facts and stack.

## Verified

- Every project record was fact-checked claim by claim against its repository's README, decision
  log, artifacts and screenshots, and corrected where the wording went beyond the source.
- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass; all 22 routes are
  static.
- No horizontal overflow at 360, 375, 390, 768, 1280 and 1440 px, in light and dark themes.
- Mobile menu opens, closes on Escape and on navigation; theme toggle persists; skip link is the
  first focusable element.

## Known limitations

- Bordereaux Reconciler's free demo database expires on 24 October 2026 (stated on its case
  study); its live screens will empty after that unless the project re-provisions it.
- Free-tier project backends sleep; a first request can take about a minute.
- Agent Authorization Broker's repository does not record which host its screenshots were taken
  from, so the site labels them as screenshots from the repository rather than the live
  deployment.

## Next

- Publish the repository, deploy to Vercel, verify the live site and its links.
