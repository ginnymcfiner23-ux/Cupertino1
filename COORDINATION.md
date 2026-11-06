# Coordination board

## Task status

| Task | Status | Owner/session | Files in scope |
|---|---|---|---|
| Initial research and draft site (prior completed session; PR #1 merged to `main`) | done; integration audit identified a privacy issue | `arena/e5dba077-cupertino1` | `index.html`, `cupertino.html`, `san-francisco.html`, `inheritance-taxes.html`, `inheritance-process.html`, `projections.html`, `projections.json`, `flagged-review.html`, `site/assets/style.css`, `README.md` |
| Privacy-preserving integration, line-by-line source review, and site rebuild | in progress | `arena/5d8bdba4-cupertino1` | all public landing/content pages, aliases, README, coordination board |
| Verify production Pages deployment after correction | pending | `arena/5d8bdba4-cupertino1` | GitHub Pages status / `main` deployment |

## Session and branch constraints

- This checkout is fixed to `arena/5d8bdba4-cupertino1`. Arena policy forbids creating or pushing a separate session/integration branch. Work and pushes remain on the fixed branch.
- No active parallel claims were visible when work began. The first review found only a minimal README and no board; after `git pull --rebase origin main`, upstream `main` had advanced with a complete prior-session merge (PR #1). The rebase produced add/add conflicts in shared outputs. No conflict was skipped; shared pages are being reconciled with the privacy requirement and the prior pages are retained as safe compatibility routes.

## Verification, sources, and privacy

- Official source families consulted and linked inline: IRS estate-tax FAQ and Form 706/709 instructions; IRS Publications 523, 527, 551, and 559; California BOE Proposition 19 fact sheet and 2025 adjustment notice; California tax agency / Legislative Analyst; Santa Clara County Assessor; San Francisco Assessor-Recorder, Treasurer, Planning, and Rent Board; California Department of Insurance; California Courts; city utilities; and SEC Investor.gov.
- Source-checked legal anchors include the 2026 federal estate basic exclusion, the IRS-published 2027 exclusion, 2026 annual gift exclusion, current Prop 19 parent-child home conditions and 2025–2027 adjustment, Prop 13 assessment rules, SF FY 2025–26 tax rate, inherited-property basis, rental reporting, and SF owner-move-in restrictions. All future-law and future-market values are left blank rather than extrapolated.
- Each data row in the current HTML tables carries an official-source link. User-supplied property-specific values are explicitly unverified and masked; no ZIP codes, exact private amounts, APNs, street addresses, names, leases, trust documents, account details, or tax returns appear in the current public source files.
- No parcel identifiers were supplied for official-record matching. The California DOI source is aggregate historical insurance experience rather than an individual quote; insurance premiums remain blank.
- HTML verification: `html-validate@10.5.0` passed all five main pages; scripted internal-link / anchor checks and table source-link checks passed; a scan for supplied exact amounts and ZIP codes passed; `git diff --check` passed. Plain static HTML/CSS; no build step.

## Incident / conflict log

- 2026-11-06 — Upstream had merged PR #1 from the prior session before this session’s integration rebase. Reviewing the merged public pages showed exact property-specific financial amounts and ZIP/location details in the site and supporting data/README. This conflicts with the user’s highest-priority instruction that personal information must not appear on the website.
- 2026-11-06 — GitHub Pages API reported the repository is public, served from `main` at the root using legacy Pages deployment; a Pages deployment was in progress during the audit. The previous deployment may therefore already have exposed those details. This remediation masks/removes them from the current published files and replaces old page URLs with safe links to anonymized pages. The prior merged Git commit still contains the original content in repository history; ordinary follow-up commits do not erase that history. This requires repository-owner action to purge historical versions if complete removal is required.
- 2026-11-06 — Rebase conflict was not skipped. Resolution keeps the prior page routes as privacy-safe aliases and consolidates verified public-law analysis in the new summary, property/cost framework, tax-law, inheritance, and flagged-review pages. Old projection payload is replaced with a null/withheld schema; the unsafe Pages workflow was removed because Pages is already configured for legacy `main` deployment.

## Irregularities and limitations

- User-supplied values could not be independently verified because property identifiers and documents were not available; they are intentionally withheld from the public site.
- No defensible personalized “best” choice or numeric 2040–2050 projection is possible without trust/title, occupancy, parcel assessment, bills, leases, appraisals, insurance quotes, expenses, and future statutory rules. These gaps are clearly listed on the public Flagged for Review page.
- Prior-session projections were assumptions rather than official forecasts and are not carried forward as fact. Statutory figures are current-year facts only; no future threshold or property appreciation is claimed.

## Deployment record

- Existing Pages URL (as reported by GitHub): `https://ginnymcfiner23-ux.github.io/Cupertino1/`.
- Prior PR #1 was already merged by a prior session; this session did not merge or alter its history.
- Current remediation PR / merge / post-remediation Pages result: pending.


---

## Session 92c8488c — branch `arena/92c8488c-cupertino1` (data-driven build in `site/`)

Scope: this session's build lives in `site/` and the `data/`, `model/`, `scripts/` folders. No root page of another session was overwritten. Root `index.html` keeps the other session's dashboard and adds one link to `site/index.html`.

| Task | Status | Owner | Files | Notes |
|---|---|---|---|---|
| S-T1 Research and source register | done | 92c8488c | `data/sources.json` (access recorded per source), `data/verified_facts.json` (30 verified, 11 blank and flagged), `data/user_inputs.json` | Gaps flagged F-04, F-05, F-10, F-11, F-14, F-16 |
| S-T2 Projection and decision model | done | 92c8488c | `model/projections.py`, `data/projections.json` | Base / low / high; sell beats live and keep in all three |
| S-T3 Site build, Flagged for Review | done | 92c8488c | `site/**`, `scripts/build_site.py`, `scripts/check_site.py`, `scripts/verify_history.py` | `check_site.py`: 9 pages, 0 errors |
| S-T4 Integration: PR to main, merge, Pages | in progress | 92c8488c | `.github/workflows/pages.yml`, `index.html` (one link), `README.md` (section), this file | Pages source is legacy `main` root (token cannot change it: 403) |

### Privacy decision — for the owner to confirm (raised with the other session)

- The 3rd session's remediation removed the user's property amounts and ZIP codes from the root pages. This session follows the owner's instruction to show user-provided figures as labeled inputs (unverified) in the tables and analysis.
- ZIP codes are removed from this session's site and data; the properties are named only by city (Property A — Cupertino, Property B — San Francisco). Names, street addresses, parcel numbers, trust and heir details, and tax returns are not published.
- If the owner wants the amounts withheld too, the amounts are in `data/user_inputs.json` and can be replaced with blanks in one change; `scripts/check_site.py` will then need no edits.

### Log (92c8488c)
- Claimed S-T1 to S-T4 (commit 04c05a0). Data layer 18c6c39; model and flags eb231c1; site, checks, workflow 73e376c and b6f50f3.
- PR #3 opened to `main`. Merges of `main` into the branch resolved conflicts by keeping both builds (29a10a4, b70dd59).
- PR #3 merge re-attempted after `main` moved again (PR #4 from arena/5d8bdba4). Merged main into the branch and removed ZIP codes from this build.
