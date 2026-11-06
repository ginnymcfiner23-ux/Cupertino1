# Coordination — Cupertino1 Inheritance Decision Project

## Session
- Session ID: `arena-cupertino1` (single session; this session owns all tasks below)
- Branch: `arena/e5dba077-cupertino1` (fixed session branch; commit and push only to this branch)

## Task board

| ID | Task | Status | Owner | Files touched | Sources verified | Notes |
|----|------|--------|-------|---------------|------------------|-------|
| T1 | Repo review & coordination setup | done | arena-cupertino1 | COORDINATION.md, README.md | n/a | Repo was empty except README.md |
| T2 | Research: federal estate/gift tax & step-up in basis (IRS) | in progress | arena-cupertino1 | site/inheritance-taxes.md | irs.gov | In progress |
| T3 | Research: CA inheritance/estate tax, Prop 13, Prop 19 parent-child reassessment | unclaimed | arena-cupertino1 | site/inheritance-taxes.md | boe.ca.gov, ftb.ca.gov, caassessor | |
| T4 | Research: Santa Clara County / Cupertino property tax & assessments | unclaimed | arena-cupertino1 | site/cupertino.md | sccassessor.org | |
| T5 | Research: San Francisco property tax & assessments | unclaimed | arena-cupertino1 | site/san-francisco.md | sfassessor.org | |
| T6 | Research: homeowners insurance rates CA (CDI) for 95014 & 94122 | unclaimed | arena-cupertino1 | site/cupertino.md, site/san-francisco.md | insurance.ca.gov | |
| T7 | Research: water & electricity costs (Valley Water, SJWC, PG&E NEM 3.0) | unclaimed | arena-cupertino1 | site/cupertino.md | valleywater.org, pge.com | |
| T8 | Research: SF water/electric (SFPUC) for rental property | unclaimed | arena-cupertino1 | site/san-francisco.md | sfpuc.org | |
| T9 | Build projections: property value, tax, insurance, water, electric by year | unclaimed | arena-cupertino1 | site/projections.md | n/a (assumptions labeled) | Label all projections as assumptions |
| T10 | Step-by-step inheritance process (CA probate/trust) | unclaimed | arena-cupertino1 | site/inheritance-process.md | courts.ca.gov | |
| T11 | Executive summary | unclaimed | arena-cupertino1 | README.md, site/executive-summary.md | n/a | |
| T12 | Site build: landing page + category subpages, tables with source links | unclaimed | arena-cupertino1 | site/*.html, assets/ | n/a | |
| T13 | Verification: every table row has official source link or is flagged unverified | unclaimed | arena-cupertino1 | site/flagged-review.md | n/a | Line-by-line |
| T14 | GitHub Pages enablement, build check, broken-link check | unclaimed | arena-cupertino1 | .github/workflows (optional), repo settings via gh | n/a | |
| T15 | Pull request to main, merge, confirm Pages deploy, record PR link | unclaimed | arena-cupertino1 | n/a | n/a | Final integration |

## Rules followed
- One session per task; no task is started while another session claims it (single session here).
- Small, frequent commits; `git pull --rebase` before every push.
- Every table row cites an official source link, or the cell is left blank and flagged "unverified" on the Flagged for Review page.
- No inferred or hallucinated values; projections are labeled assumptions, never presented as verified facts.
- Personal information is anonymized with placeholders; nothing personal appears on the site.
