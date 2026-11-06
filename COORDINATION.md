# Coordination — Cupertino1 Inheritance Decision Project

## Session
- Session ID: `arena-cupertino1` (single session; this session owns all tasks below)
- Branch: `arena/e5dba077-cupertino1` (fixed session branch; commit and push only to this branch)

## Task board

| ID | Task | Status | Owner | Files touched | Sources verified | Notes |
|----|------|--------|-------|---------------|------------------|-------|
| T1 | Repo review & coordination setup | done | arena-cupertino1 | COORDINATION.md, README.md | n/a | Repo was empty except README.md |
| T2 | Research: federal estate/gift tax & step-up in basis (IRS) | done | arena-cupertino1 | site/inheritance-taxes.md | irs.gov estate-tax page (2026 threshold $15,000,000; Form 706; portability); IRS Pub 551/559 (step-up basis, IRC §1014); Pub. L. 119-21 §70106 | Complete |
| T3 | Research: CA inheritance/estate tax, Prop 13, Prop 19 parent-child reassessment | done | arena-cupertino1 | site/inheritance-taxes.md, site/cupertino.md | ftb.ca.gov (gifts/inheritance not income); boe.ca.gov/prop19 + BOE LTA 2026/026; sccassessor.org 2026 booklet; CA Constitution art. XIII A; RTC 51/110.1/13301 | Complete |
| T4 | Research: Santa Clara County / Cupertino property tax & assessments | done | arena-cupertino1 | site/cupertino.md | sccassessor.org 2026 booklet (Prop 13 mechanics, supplemental assessment, PCOR, inheritance reassessed at date of death); composite residential rate ~1.08–1.30% | Complete |
| T5 | Research: San Francisco property tax & assessments | done | arena-cupertino1 | site/san-francisco.md | sfassessor.org (NAV/roll); SF combined rate 1.1763% FY24-25 (SF Controller) | Complete |
| T6 | Research: homeowners insurance rates CA (CDI) | done | arena-cupertino1 | site/cupertino.md, site/san-francisco.md | insurance.ca.gov CDI data call 2025: $2,339.99 statewide avg (6,052,334 policies); NAIC 2023 CA HO-3 $1,655. ZIP-specific quotes not published by CDI → flagged unverified | Complete |
| T7 | Research: water & electricity (SJWC, Valley Water, PG&E NEM 3.0) | done | arena-cupertino1 | site/cupertino.md | sjwater.com AL 628 (CPUC D.24-12-077): 2026 rates, avg residential bill ~$137–145/mo; CPUC NEM 3.0 D.22-12-016 (eff. 4/15/2023); PG&E Solar Billing Plan, Base Services Charge ~$24/mo | Complete |
| T8 | Research: SF water/electric (SFPUC) | done | arena-cupertino1 | site/san-francisco.md | sfpuc.gov Prop 218 notice: avg single-family combined bill ~$171/mo → $189 from 7/1/2026 (+10.5%), ~$212 by July 2027 | Complete |
| T9 | Build projections: property value, tax, insurance, water, electric by year | done | arena-cupertino1 | site/projections.md | n/a — all projection inputs labeled assumptions; no official source for future appreciation | Complete |
| T10 | Step-by-step inheritance process (CA trust administration) | done | arena-cupertino1 | site/inheritance-process.md | Cal. Prob. Code §16061.7 (60-day notice, 120-day contest), BOE forms BOE-19-P/BOE-266, county recorder PCOR, sccassessor.org booklet | Complete |
| T11 | Executive summary | done | arena-cupertino1 | README.md, site/index.html | n/a | Complete |
| T12 | Site build: landing page + category subpages, tables with source links | done | arena-cupertino1 | index.html, cupertino.html, san-francisco.html, inheritance-taxes.html, inheritance-process.html, projections.html, flagged-review.html, site/assets/style.css | n/a | Complete |
| T13 | Verification: every table row has official source link or is flagged unverified; broken-link check | done | arena-cupertino1 | site/flagged-review.md | All internal links verified (scripted check: 0 missing files). External links are well-formed HTTPS to verified domains (irs.gov, ftb.ca.gov, boe.ca.gov, sccassessor.org, sfassessor.org, sfpuc.gov, sjwater.com, pge.com, insurance.ca.gov, congress.gov, courts.ca.gov, leginfo.legislature.ca.gov) | Complete |
| T14 | GitHub Pages enablement, deploy check | in progress | arena-cupertino1 | repo settings via gh | Pages already enabled on repo, serving from branch `main` at https://ginnymcfiner23-ux.github.io/Cupertino1/ (status: built). Cannot repoint source branch via API (token lacks Pages write: 403). Will deploy after merging integration branch into main. | In progress |
| T15 | Pull request to main, merge, confirm Pages deploy, record PR link | unclaimed | arena-cupertino1 | n/a | Pending | Final integration |

## Rules followed
- One session per task; no task is started while another session claims it (single session here).
- Small, frequent commits; `git pull --rebase` before every push.
- Every table row cites an official source link, or the cell is left blank and flagged "unverified" on the Flagged for Review page.
- No inferred or hallucinated values; projections are labeled assumptions, never presented as verified facts.
- Personal information is anonymized with placeholders; nothing personal appears on the site.

---

## Session 92c8488c — branch `arena/92c8488c-cupertino1` (parallel build; merged alongside arena-cupertino1)

Platform note: this session is bound to `arena/92c8488c-cupertino1`; the `session-<id>/<task>` naming cannot be used. Both sessions' work is kept side by side: the root pages above (session arena-cupertino1) and this session's data-driven build in `site/` (no files of the other session were overwritten; `site/assets/style.css` is theirs, this session uses `site/assets/study.css` and `study.js`).

| ID | Task | Status | Owner | Files touched | Sources verified | Notes |
|----|------|--------|-------|---------------|------------------|-------|
| S-T1 | Research & source capture (federal, CA, local, utilities, rent) | done | 92c8488c | `data/sources.json`, `data/verified_facts.json`, `data/user_inputs.json`, `data/history_check.json` | 31 sources registered (access recorded per source); 30 verified fact rows, 11 blank + flagged | Gaps: CA estate/MHST, Cal Water Cupertino, PG&E rates, Dutch/foreign heir (kept off public site), Rev. Proc. §4.03 thresholds |
| S-T2 | Projection & decision model | done | 92c8488c | `model/projections.py`, `data/projections.json` | Base/low/high labeled; inputs from verified or user rows | Sell beats live and keep in all scenarios; break-even rents shown |
| S-T3 | Site build (dashboard, category pages, projections, decision, Flagged for Review, sources) | done | 92c8488c | `site/**`, `scripts/build_site.py`, `scripts/check_site.py`, `scripts/verify_history.py` | `check_site.py`: 9 pages, 0 errors | 25 flags F-01…F-25 |
| S-T4 | Integration: PR → main, merge, Pages | in progress | 92c8488c | `.github/workflows/pages.yml`, `index.html` (one banner link added), `README.md` (section appended), this file | — | Pages build type cannot be changed by this token (403); branch-root legacy publish is in use |

Log (92c8488c):
- Claimed S-T1–S-T4 on `arena/92c8488c-cupertino1` (commit 04c05a0).
- Committed data layer (18c6c39), model + flags (eb231c1), site + checks + workflow (73e376c, b6f50f3).
- PR #3 opened from `arena/92c8488c-cupertino1` to `main`. Merge blocked by main's new commits (PR #1 from arena-cupertino1) — resolved by merging main into the branch and keeping both sets of files (see notes above). Merged via `gh pr merge 3 --merge`.
- Pages: Pages is in legacy mode (branch `main`, root). The workflow variant with deploy-pages is not usable here (403 on settings). The root `index.html` of main is kept and now links to `site/index.html`.
