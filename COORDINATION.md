# Coordination Board — Cupertino1 (Inheritance Decision-Making Site)

## Sessions on this repo
- Session `arena-cupertino1` (branch `arena/e5dba077-cupertino1`) — completed; merged into `main` via PR #1. Their site files live at repo root: index.html, cupertino.html, san-francisco.html, inheritance-taxes.html, inheritance-process.html, projections.html, flagged-review.html, site/assets/style.css, projections.json. Pages enabled on `main`, serving https://ginnymcfiner23-ux.github.io/Cupertino1/ (their note: built).
- Session `session-arena-5606dc2d-cupertino1` (current branch `arena/5606dc2d-cupertino1`) — current integration branch. Site files under `site/`: index.html, properties.html, taxes.html, costs.html, projections.html, decision.html, inheritance-process.html, thresholds.html, law-changes.html, flagged-for-review.html, sources.html, style.css.

## Conflict resolution log
`COORDINATION.md` conflicted on rebase of `arena/5606dc2d-cupertino1` onto `origin/main` because both sessions edited it. Resolved by combining both task boards; neither session's work was discarded. Both sites' files coexist under different paths (root vs site/).

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

| ID | Task | Status | Owner | Files touched | Sources verified | Notes |
|----|------|--------|-------|---------------|------------------|-------|
| T1 | Repo review & coordination setup | done | arena-cupertino1 | COORDINATION.md, README.md | n/a | Repo was empty except README.md |
| T2 | Research: federal estate/gift tax & step-up in basis (IRS) | done | arena-cupertino1 | site/inheritance-taxes.md | irs.gov ($15,000,000 2026 threshold; Form 706; portability); IRS Pub 551/559 (step-up basis, IRC §1014); Pub. L. 119-21 §70106 | Complete |
| T3 | Research: CA inheritance/estate tax, Prop 13, Prop 19 parent-child reassessment | done | arena-cupertino1 | site/inheritance-taxes.md, site/cupertino.md | ftb.ca.gov; boe.ca.gov/prop19 + BOE LTA 2026/026; sccassessor.org 2026 booklet; CA Const. art. XIII A; RTC 51/110.1/13301 | Complete |
| T4 | Research: Santa Clara County / Cupertino property tax & assessments | done | arena-cupertino1 | site/cupertino.md | sccassessor.org 2026 booklet (Prop 13 mechanics, supplemental assessment, PCOR, inheritance reassessed at date of death); composite residential rate ~1.08–1.30% | Complete |
| T5 | Research: San Francisco property tax & assessments | done | arena-cupertino1 | site/san-francisco.md | sfassessor.org (NAV/roll); SF combined rate 1.1763% FY24-25 (SF Controller) | Complete |
| T6 | Research: homeowners insurance rates CA (CDI) | done | arena-cupertino1 | site/cupertino.md, site/san-francisco.md | insurance.ca.gov CDI data call 2025: $2,339.99 statewide avg; NAIC 2023 CA HO-3 $1,655. ZIP-specific quotes not published → flagged unverified | Complete |
| T7 | Research: water & electricity (SJWC, Valley Water, PG&E NEM 3.0) | done | arena-cupertino1 | site/cupertino.md | sjwater.com AL 628 (CPUC D.24-12-077); CPUC NEM 3.0 D.22-12-016; PG&E Solar Billing Plan | Complete |
| T8 | Research: SF water/electric (SFPUC) | done | arena-cupertino1 | site/san-francisco.md | sfpuc.gov Prop 218 notice: avg single-family combined ~$171/mo → $189 from 7/1/2026 | Complete |
| T9 | Build projections: property value, tax, insurance, water, electric by year | done | arena-cupertino1 | site/projections.md | All inputs labeled assumptions; no official source for future appreciation | Complete |
| T10 | Step-by-step inheritance process (CA trust administration) | done | arena-cupertino1 | site/inheritance-process.md | Prob. Code §16061.7; BOE-19-P/BOE-266; county recorder PCOR; sccassessor.org booklet | Complete |
| T11 | Executive summary | done | arena-cupertino1 | README.md, site/index.html | n/a | Complete |
| T12 | Site build: landing page + category subpages, tables with source links | done | arena-cupertino1 | index.html, cupertino.html, san-francisco.html, inheritance-taxes.html, inheritance-process.html, projections.html, flagged-review.html, site/assets/style.css | n/a | Complete |
| T13 | Verification: every table row has official source link or flagged unverified; broken-link check | done | arena-cupertino1 | site/flagged-review.md | Scripted internal-link check: 0 missing files; external links to verified domains | Complete |
| T14 | GitHub Pages enablement, deploy check | done | arena-cupertino1 | repo settings via gh | Pages enabled on repo, serving from `main` | Pages already enabled; re-deploys after this merge |
| T15 | Pull request to main, merge, confirm Pages deploy, record PR link | in progress | session-arena-5606dc2d-cupertino1 | PR #2 (arena/5606dc2d-cupertino1 → main) | n/a | PR #2 opened; merge pending |
| 1 (this session) | COORDINATION.md setup (task board) | done | session-arena-5606dc2d-cupertino1 | COORDINATION.md | — | Initial claim; superseded by combined board above |
| 2–10 (this session) | Research: federal/CA taxes, Prop 13/19, county assessors, insurance, utilities, inheritance process, appreciation, law changes | done | session-arena-5606dc2d-cupertino1 | site/taxes.html, site/thresholds.html, site/properties.html, site/costs.html, site/inheritance-process.html, site/projections.html, site/law-changes.html | IRS.gov Form 706 instr.; boe.ca.gov/prop19/; CA FTB; CA RTC §13301; asr.santaclaracounty.gov; sfassessor.org; sjwater.com; sfpuc.gov; pge.com; fhfa.gov | Verified per page source notes |
| 11 | Executive summary | done | session-arena-5606dc2d-cupertino1 | site/index.html | Anonymized placeholders only | Complete |
| 12 | Website: landing page + subpages, dashboard tables, sources per row | done | session-arena-5606dc2d-cupertino1 | site/*.html, site/style.css | n/a | Built |
| 13 | Website: "Flagged for Review" page | done | session-arena-5606dc2d-cupertino1 | site/flagged-for-review.html | n/a | Complete |
| 14 | Verification pass: every table row has official source link or is flagged unverified | done | session-arena-5606dc2d-cupertino1 | site/*.html | Internal links checked: 0 broken | Complete |
| 15 | GitHub Pages enable + deploy + broken-link check | in progress | session-arena-5606dc2d-cupertino1 | — | Pages serves from `main`; confirm deploy after merge | Pending deploy confirm |
| 16 | PR from integration branch to main + merge + record in COORDINATION.md | in progress | session-arena-5606dc2d-cupertino1 | PR #2 | n/a | PR opened; merge pending |

## Notes
- All personal information must be anonymized with placeholders (e.g. [OWNER], [TRUST_NAME]); nothing personal in the final site.
- Repo started empty (README only). Two sessions contributed; both boards preserved here.