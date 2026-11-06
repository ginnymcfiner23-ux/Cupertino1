# Coordination board — Cupertino1 (inheritance decision-making site)

## Sessions on this repo
- Session `arena-cupertino1` (branch `arena/e5dba077-cupertino1`) — completed; merged into `main` via PR #1. Their draft site files lived at repo root. **Privacy incident (session `arena/5d8bdba4-cupertino1`, PR #4):** review of the merged public pages found exact property-specific financial amounts and ZIP/location details, conflicting with the user's highest-priority instruction (no personal information on the website). PR #4 removed those public pages and rebuilt privacy-safe pages: `inheritance.html`, `properties.html`, `tax-law.html`, `styles.css` (root). No ZIP codes, exact private amounts, APNs, street addresses, names, leases, trust documents, account details, or tax returns appear in current public source files. Prior merged git commit still contains original content in history; purging history requires repository-owner action.
- Session `arena/5d8bdba4-cupertino1` — completed privacy-preserving rebuild and source review; merged via PR #4. "Verify production Pages deployment after correction" was pending at handoff (deployment record task).
- Session `session-arena-5606dc2d-cupertino1` (current branch `arena/5606dc2d-cupertino1`) — integration branch. Anonymized site files under `site/`: index.html, properties.html, taxes.html, costs.html, projections.html, decision.html, inheritance-process.html, thresholds.html, law-changes.html, flagged-for-review.html, sources.html, style.css. Uses placeholders ([OWNER], [TRUST_NAME], [BENEFICIARY], [ADDRESS], [SUCCESSOR_TRUSTEE]) for names/addresses; user-supplied zip/amount figures are flagged as user-provided and unverified on the Flagged for Review page.

## Conflict resolution log
- 2026-11-06: `COORDINATION.md` add/add conflict between session `arena-cupertino1` and session `session-arena-5606dc2d-cupertino1` — resolved by combining both boards; no work discarded.
- 2026-11-06: rebase of `arena/5606dc2d-cupertino1` onto `origin/main` (which had advanced via PR #4 from session `arena/5d8bdba4-cupertino1`). Conflict on `COORDINATION.md` (and `README.md`) — resolved by combining all three sessions' boards. Session 2's removed root pages are NOT resurrected (they were privacy-removed on `main`); session `session-arena-5606dc2d-cupertino1` files live only under `site/`.
- No conflict was skipped.

## Convention (applies to all sessions)
- Claim a task by writing your session ID + file scope, then commit + push immediately.
- Never start a task another session has claimed.
- Scopes must be non-overlapping; each session works on its own files only.
- If a task requires editing a file owned by another session, log the request here instead.
- Make small, frequent commits; run `git pull --rebase` before every push.
- On conflict: stop, resolve without discarding the other session's work, log what happened.
- When finished: record sources, verification performed, irregularities here; mark done.
- Never mark verified without checking an official source; link that source.
- Shared outputs (table data, index, navigation) are changed only by the final integration session once all other tasks are done.
- Flagged irregularities / unverified items do NOT block merge; publish them on a "Flagged for Review" page.

## Combined task board

| Task | Status | Owner/session | Files in scope | Sources verified |
|------|--------|---------------|----------------|------------------|
| Initial research and draft site (prior completed session; PR #1 merged to `main`) | done; integration audit identified a privacy issue | `arena/e5dba077-cupertino1` | `index.html`, `cupertino.html`, `san-francisco.html`, `inheritance-taxes.html`, `inheritance-process.html`, `projections.html`, `projections.json`, `flagged-review.html`, `site/assets/style.css`, `README.md` | IRS estate-tax FAQ/Form 706; IRS Pub 523/527/551/559; CA BOE Prop 19; CA tax agency/LAO; Santa Clara County Assessor; SF Assessor-Recorder/Treasurer/Planning/Rent Board; CA Dept of Insurance; California Courts; city utilities; SEC Investor.gov |
| Privacy-preserving integration, line-by-line source review, and site rebuild | done (PR #4 merged to `main`) | `arena/5d8bdba4-cupertino1` | all public landing/content pages, aliases, README, coordination board | html-validate@10.5.0 passed all five main pages; scripted internal-link/anchor and table source-link checks passed; scan for supplied exact amounts and ZIP codes passed; `git diff --check` passed |
| Verify production Pages deployment after correction | pending — handoff to integration session | `session-arena-5606dc2d-cupertino1` | GitHub Pages status / `main` deployment | — |
| Research: federal/CA taxes, Prop 13/19, county assessors, insurance, utilities, inheritance process, appreciation, law changes (integration session) | done | `session-arena-5606dc2d-cupertino1` | `site/taxes.html`, `site/thresholds.html`, `site/properties.html`, `site/costs.html`, `site/inheritance-process.html`, `site/projections.html`, `site/law-changes.html` | IRS.gov Form 706 instructions; boe.ca.gov/prop19/; CA FTB; CA RTC §13301; asr.santaclaracounty.gov; sfassessor.org; sjwater.com; sfpuc.gov; pge.com; fhfa.gov |
| Executive summary (integration session) | done | `session-arena-5606dc2d-cupertino1` | `site/index.html` | Anonymized placeholders only |
| Website: landing page + subpages, dashboard tables, sources per row (integration session) | done | `session-arena-5606dc2d-cupertino1` | `site/*.html`, `site/style.css` | — |
| Website: "Flagged for Review" page (integration session) | done | `session-arena-5606dc2d-cupertino1` | `site/flagged-for-review.html` | — |
| Verification pass: every table row has official source link or is flagged unverified | done | `session-arena-5606dc2d-cupertino1` | `site/*.html` | Internal links checked: 0 broken |
| PR from integration branch to main + merge | in progress | `session-arena-5606dc2d-cupertino1` | PR #2 (`arena/5606dc2d-cupertino1` → `main`) | — |
| Confirm GitHub Pages deploys after merge; record PR link and result here | pending | `session-arena-5606dc2d-cupertino1` | — | — |

## Notes
- All personal information must be anonymized with placeholders; nothing personal in the final site.
- User-supplied values could not be independently verified (no property identifiers/documents available); they are flagged unverified and retained only as user-provided inputs.
- No defensible personalized "best" choice or numeric 2040–2050 projection is possible without trust/title, occupancy, parcel assessment, bills, leases, appraisals, insurance quotes, expenses, and future statutory rules; projections are labeled assumptions.
- Pages URL (as reported by GitHub): `https://ginnymcfiner23-ux.github.io/Cupertino1/`, served from `main`.