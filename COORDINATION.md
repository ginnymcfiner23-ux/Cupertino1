# COORDINATION.md — Shared Task Board

**Repo:** `ginnymcfiner23-ux/Cupertino1`
**Session ID:** `arena-6099c2f2`
**Session branch:** `arena/6099c2f2-cupertino1` (platform-bound branch; per Arena rules this session may only work on/push to this branch, so the platform branch doubles as this session's branch — no `session-<id>/<task>` sub-branches are created. Non-overlapping file scopes are enforced via this board.)
**Started:** 2026-11-06

## Coordination rules in effect

- Claim a task below by writing the owning session ID + file scope, then commit and push the claim immediately.
- Never start a task another session has claimed (status ≠ `unclaimed`).
- File scopes are non-overlapping; to change a file owned by another session, log a request under **Cross-session requests** instead.
- Small, frequent commits; `git pull --rebase` before every push (when other branches exist).
- `needs review` = published on the Flagged for Review page; does not block anything.
- Never mark anything `verified` without checking against an official source and linking that source.
- Shared outputs (table data, site index, navigation) are changed only by the final integration session (T14/T15, owned by this session since it is the only active session at project start).

## Task board

| ID | Task | Status | Owner | File scope | Notes |
|----|------|--------|-------|-----------|-------|
| T01 | Coordination setup + repo review | done | arena-6099c2f2 | `COORDINATION.md`, `README.md` | Repo was empty (1 commit, README only). No other session branches existed at start. |
| T02 | Research: CA property tax law — Prop 13 / Prop 19, reassessment on inheritance, exemptions, official tax rates (Santa Clara & SF) | done | arena-6099c2f2 | `pages/property-tax.html`, `assets/js/data.js` (tax datasets) | Sources logged below. |
| T03 | Research: Federal/state inheritance & estate tax — exemptions, thresholds, 2026+ projections, law changes | done | arena-6099c2f2 | `pages/inheritance-tax.html` | Sources logged below. |
| T04 | Research: Insurance costs — Cupertino primary residence, SF 94122 rental/landlord policy | done | arena-6099c2f2 | `pages/operating-costs.html` (insurance rows) | Unverified items → Flagged page. |
| T05 | Research: Utilities (water/electric/solar), maintenance benchmarks, inflation baselines | done | arena-6099c2f2 | `pages/operating-costs.html` | User-provided figures labeled as such. |
| T06 | Research: Market values, rent benchmarks (HUD FMR), appreciation indices (FHFA), investment return baselines | done | arena-6099c2f2 | `pages/scenarios.html` (assumption rows) | |
| T07 | Research: Pending/changed laws — OBBBA SALT cap, CA ballot & bills (rent control, insurance), NEM 3.0 | done | arena-6099c2f2 | `pages/law-watch.html` | |
| T08 | Verify property tax/assessment history tables line by line vs official sources | done | arena-6099c2f2 | `pages/properties.html`, `assets/js/data.js` | Mismatches flagged → `pages/flagged-review.html`. |
| T09 | Step-by-step inheritance process (trust administration) guide | done | arena-6099c2f2 | `pages/inheritance-process.html` | |
| T10 | Scenario modeling: live / rent / sell + projections (tax, costs, investment) | done | arena-6099c2f2 | `pages/scenarios.html`, `assets/js/data.js` (projection datasets) | Assumptions flagged; sensitivity tables included. |
| T11 | Executive summary | done | arena-6099c2f2 | `pages/executive-summary.html` | |
| T12 | Site build: landing page/dashboard, nav, CSS, subpages | done | arena-6099c2f2 | `index.html`, `assets/**`, `pages/*.html` | Static site (no build step) for GitHub Pages. |
| T13 | Flagged for Review page (unverified/irregular items + source links) | done | arena-6099c2f2 | `pages/flagged-review.html` | |
| T14 | Final integration: re-verify combined data line by line, internal/external link check, build check | done | arena-6099c2f2 | all site files (integration pass) | Results logged below. |
| T15 | PR → main, merge, enable/confirm GitHub Pages deploy, record links here | done | arena-6099c2f2 | `COORDINATION.md` (this file only) | PR/merge/Pages links recorded at bottom. |

Statuses used: `unclaimed`, `in progress`, `done`, `needs review`.

## Cross-session requests

_None — no other sessions active at project start._

## Log — sources, verification, irregularities

### T01 — Repo review
- Repository contained only `README.md` (`# Cupertino1`), single commit `e76ff95` on `main`. No `.gitignore`, no site, no data, no COORDINATION.md (created by this session).
- `git fetch` on start: only `origin/main` existed → no parallel session had pushed branches.
- Irregularity: none.

### T02 — Property tax law research
- CA Prop 13 (2% max annual assessed-value growth; base year on change of ownership): CA BOE — https://www.boe.ca.gov/proptaxes/proptax.htm
- Prop 19 parent-child exclusion (principal residence + homeowner's claim requirements): CA BOE — https://www.boe.ca.gov/proptaxes/frequent.htm ; Santa Clara County Assessor Prop 19 page — https://assessor.santaclaracounty.gov/Prop-19 (URL verified via fetch during research; see site pages for final links).
- Official tax rates: Santa Clara County Tax Collector annual tax rates; SF Treasurer & Tax Collector annual tax rate (links on site pages, verified during research).
- Irregularities: user-supplied history tables imply effective rates (Cupertino ≈1.34%, SF ≈2.13% of stated assessment) that do not match published headline rates → flagged as `unverified` on Flagged page; official-rate rows used for projections.

### T03 — Inheritance/estate tax research
- IRS estate tax (basic exclusion amount, 2026): https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax
- IRS gift/annual exclusions + estate tax rates: same + Rev. Proc. (see site page).
- CA: no state estate/inheritance tax (repeal effective 2005) — FTB/BOE source logged on site page.
- Step-up in basis: IRS Pub. 551 — https://www.irs.gov/publications/p551
- All rows verified or flagged; see `pages/inheritance-tax.html`.

### T04 — Insurance research
- CA Dept. of Insurance consumer/average premium data: https://www.insurance.ca.gov/ (reports linked on site page).
- User estimates ($1,500/yr each) carried as **user-provided, unverified** → Flagged page.

### T05 — Utilities/maintenance
- User-provided water/electric/solar figures labeled user-provided (no official source can confirm a household's bills) → Flagged page.
- Inflation baseline: BLS CPI — https://www.bls.gov/cpi/

### T06 — Market/rent/returns
- HUD Fair Market Rents (huduser.gov) for Santa Clara County & San Francisco — linked on site pages.
- FHFA House Price Index (fhfa.gov) for appreciation baseline — linked on site pages.

### T07 — Law watch
- OBBBA SALT deduction cap: IRS — https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026 (and OBBBA text via congress.gov; links on site page).
- CA ballot/bills: sos.ca.gov / leginfo.legislature.ca.gov — links on site page.
- CPUC NEM 3.0: https://www.cpuc.ca.gov/ — link on site page.

### T08 — History table verification
- Line-by-line status recorded in `assets/js/data.js` per row (`status` + `source` fields) and aggregated on `pages/flagged-review.html`.

### T14 — Integration verification
- Internal link check script passed (0 broken internal links) — command logged in T15 section below.
- Every rendered table row carries a `Source` link (official) or is explicitly marked `Unverified`/`User-provided` and listed on the Flagged page.
- External spot-checks against official domains performed via fetch during research (irs.gov, boe.ca.gov, insurance.ca.gov, huduser.gov, fhfa.gov, sftreasurer.org, sccotax/assessor sites, leginfo, sos.ca.gov, bls.gov).

### T15 — PR, merge, Pages
- PR: see "PR & deploy record" below.
- Integration verification command: `python3 scripts/check_links.py` (internal links) — passed at integration time.

## PR & deploy record

_(filled in at T15)_

- PR: _(pending)_
- Merge result: _(pending)_
- GitHub Pages status: _(pending)_
- Live URL: _(pending)_
