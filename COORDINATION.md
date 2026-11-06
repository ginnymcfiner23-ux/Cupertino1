# Coordination board

## Tasks

| Task | Status | Owner/session | Files in scope |
|---|---|---|---|
| Initial research and draft site (PR #1, merged) | done; findings consolidated in privacy-safe pages | `arena/e5dba077-cupertino1` | original root pages and styles |
| Data/model/subsite build (PR #3, merged) | done; generated user-specific inputs/projections removed from current public tree | `arena/92c8488c-cupertino1` | `data/`, `model/`, `scripts/`, `site/` |
| Alternative site (PR #2) | closed for privacy conflict; do not merge as-is | `arena/5606dc2d-cupertino1` | PR #2 branch |
| Privacy-preserving final integration and current-law review | in progress | `arena/5d8bdba4-cupertino1` | public pages, aliases, data placeholders, README and this board |
| Confirm post-remediation GitHub Pages deployment | pending | `arena/5d8bdba4-cupertino1` | Pages status / `main` deployment |

## Session/branch constraints and handoffs

- This session is fixed to `arena/5d8bdba4-cupertino1`; Arena policy does not allow creating or pushing a separate integration branch.
- The repository was initially empty except for README and had no coordination board. After the first audit, upstream `main` received PR #1, then PR #3 from a concurrent session. Rebase/fast-forward updates were pulled before pushes; all work remains on the fixed branch.
- PR #1 and PR #3 were already merged to `main` before final integration. A later audit found that the merged public root pages and alternate `site/`/`data/` build contained user-specific financial inputs and projections. The data owner's privacy instruction takes precedence over displaying those figures. Current outputs have been replaced with safe redirects/empty placeholders; the reviewed root pages are the sole content source.
- PR #2 was scanned without printing its private values; the proposed tree contained scenario-specific values and location details. A comment explaining the privacy blocker was posted and PR #2 was closed to prevent accidental publication. Its research can be reused only after anonymization.
- Older root and `site/` URLs are retained as safe compatibility links to anonymized pages. No task is currently claimed by another active session in this board.

## Sources and verification

- Official sources consulted and linked inline: IRS estate-tax FAQ and Forms 706/709 instructions; IRS Publications 523, 527, 551 and 559; California BOE Proposition 19 fact sheet and 2025 adjustment notice; California tax agency / Legislative Analyst; Santa Clara County Assessor; San Francisco Assessor-Recorder, Treasurer, Planning and Rent Board; California Department of Insurance; California Courts; official utility resources; and SEC Investor.gov.
- Current legal anchors include 2026 federal estate/gift thresholds, IRS-published 2027 estate exclusion, current Proposition 19 conditions and 2025–2027 adjustment, Proposition 13 rules, the San Francisco FY 2025–26 property-tax rate, inherited-property basis, rental reporting, and San Francisco owner-move-in restrictions. Future amounts and economic outcomes are not projected as facts.
- Property-specific estimates, historical bills, rent, utilities, insurance and unit details are not verified from official records; exact supplied figures and ZIP codes are excluded from the current public tree. Data tables use placeholders and link to official verification routes.
- No parcel identifiers were supplied. California DOI insurance reports are aggregate historical data, not an individual policy quote; premiums remain blank.
- Validation performed: `html-validate@10.5.0` on root and `site/` HTML; scripted internal-link/anchor and table-source checks; exact-value/ZIP privacy scan over all current files; `git diff --check`. A second audit covered files introduced by PR #3 and replaced the data/model/generator outputs that could reintroduce private inputs.

## Conflict / privacy incident log

- 2026-11-06 — Rebase against concurrent `main` updates produced add/add conflicts in shared root outputs. No conflict was skipped. The original draft pages are retained as safe redirects, while verified law is consolidated into the reviewed root site.
- 2026-11-06 — GitHub reported this repository is public and Pages serves `main` from the root. PR #1 and PR #3 merged before final integration; reviewing the resulting public tree found private scenario figures in historical root pages and the newer secondary `site/`/`data/` build. Current public source files have been redacted/replaced. Earlier commits remain in public Git history and ordinary follow-up commits do not erase history; repository-owner action is required to purge historical versions if full historical removal is necessary.
- 2026-11-06 — PR #3's concurrent workflow attempted to rebuild the model pages from private inputs and produced failed workflow runs. The generator and workflow have been removed from the current tree so personal inputs cannot be regenerated. Pages itself remains legacy root deployment; a fresh post-remediation Pages deployment must be checked after merging the current update.
- 2026-11-06 — PR #2 was closed with a comment identifying the privacy conflict. It was not merged.

## Irregularities / limits

- Property estimates and costs cannot be confirmed without private parcel records, statements, leases, appraisals and quotes; they are intentionally withheld.
- A defensible personalized profit-maximizing recommendation or numerical 2040–2050 projection is not possible with the missing trust, title, occupancy, property, expense, tax-basis and future-law inputs. These limitations and verification steps are on the public Flagged for Review page.
- Prior model forecasts are not carried forward as facts. No 2040–2050 property value, expense, insurance premium, tax assessment or future exemption amount is stated.

## Deployment / PR record

- Existing Pages URL: `https://ginnymcfiner23-ux.github.io/Cupertino1/` (legacy `main` root source).
- PR #1 and PR #3 were merged by prior sessions. PR #4 (root privacy remediation) merged at `c54347780b0c9a61c30450fb223c4096f0dfc479`.
- PR #2 closed to prevent publication of unredacted scenario content.
- This follow-up cleanup PR/merge and successful Pages deployment status: pending.

---

## Session 92c8488c — branch `arena/92c8488c-cupertino1` (research contribution; privacy-aligned)

- Privacy position: this session accepts the owner's privacy instruction as applied on `main` (see the 5d8bdba4 log). The generator, the `site/` build, the projections and the user-figure inputs are **not** in the repository. Private working copies were kept outside Git.
- Contributed to `main`: `research/sources.json` (31 sources, each with an access record and an official/secondary flag), `research/verified_facts.json` (30 rows verified against an official source; 11 rows blank and flagged), `research/flags.json` (25 flags, rewritten so they contain no user figures). No ZIP codes, amounts, names, parcel numbers, trust or heir details are in these files (scanned).
- The root pages on `main` were not changed by this session.
- History caveat for the repository owner: earlier commits (PR #3 and PR #1 history) contain user figures and a ZIP code. Ordinary follow-up commits do not remove them; a history rewrite (for example `git filter-repo`) plus force-push would need the owner's approval.
- Pages: this session did not change the Pages source (the token returns 403 for Pages settings). This session's workflow file is not on `main`, so the only Pages build is the legacy branch-root build.
- Integration: PR to `main` from `arena/92c8488c-cupertino1` adds only `research/` and this note. Post-merge Pages status is recorded below.
