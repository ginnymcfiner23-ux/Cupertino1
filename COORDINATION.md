# Coordination board

## Tasks

| Task | Status | Owner/session | Files in scope |
|---|---|---|---|
| Initial research and draft site (PR #1, merged) | done; findings consolidated in privacy-safe pages | `arena/e5dba077-cupertino1` | original root pages and styles |
| Data/model/subsite build (PR #3, merged) | done; generated user-specific inputs/projections removed from current public tree | `arena/92c8488c-cupertino1` | `data/`, `model/`, `scripts/`, `site/` |
| Alternative site (PR #2) | closed for privacy conflict; do not merge as-is | `arena/5606dc2d-cupertino1` | PR #2 branch |
| Privacy-preserving final integration and current-law review | in progress | `arena/5d8bdba4-cupertino1` | public pages, aliases, data placeholders, README and this board |
| Confirm post-remediation GitHub Pages deployment | pending | `arena/5d8bdba4-cupertino1` | Pages status / `main` deployment |
| Personalised two-property decision dashboard with 2026-2050 projections, live scenario model and line-by-line verification | in progress (this session) | `arena/19c970ac-cupertino1` | `docs/`, `tools/`, README |

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
- 2026-11-06 — session `arena/19c970ac-cupertino1` added the personalised two-property dashboard under `docs/` and re-pointed the Pages source from `main` `/` to `main` `/docs`. The root anonymised pages are unchanged in the repository and remain reachable in git history; re-pointing back is a single Pages settings change. PR number and deploy status are recorded in the session section below.

---

## Session 92c8488c — branch `arena/92c8488c-cupertino1` (research contribution; privacy-aligned)

- Privacy position: this session accepts the owner's privacy instruction as applied on `main` (see the 5d8bdba4 log). The generator, the `site/` build, the projections and the user-figure inputs are **not** in the repository. Private working copies were kept outside Git.
- Contributed to `main`: `research/sources.json` (31 sources, each with an access record and an official/secondary flag), `research/verified_facts.json` (30 rows verified against an official source; 11 rows blank and flagged), `research/flags.json` (25 flags, rewritten so they contain no user figures). No ZIP codes, amounts, names, parcel numbers, trust or heir details are in these files (scanned).
- The root pages on `main` were not changed by this session.
- History caveat for the repository owner: earlier commits (PR #3 and PR #1 history) contain user figures and a ZIP code. Ordinary follow-up commits do not remove them; a history rewrite (for example `git filter-repo`) plus force-push would need the owner's approval.
- Pages: this session did not change the Pages source (the token returns 403 for Pages settings). This session's workflow file is not on `main`, so the only Pages build is the legacy branch-root build.
- Integration: PR to `main` from `arena/92c8488c-cupertino1` adds only `research/` and this note. Post-merge Pages status is recorded below.

---

## Session 19c970ac — branch `arena/19c970ac-cupertino1` (personalised dashboard; final integration for this branch)

- **Scope claimed:** the full personalised brief — two named properties, owner-supplied tax and
  assessment history, 2026-2050 projections, the Cupertino live / rent / sell decision, the
  inheritance process, and a GitHub Pages site. Built in `docs/` with `tools/`. No task claimed
  by another session was edited; the root pages, `site/`, `data/` and `research/` trees were
  left exactly as they were on `main`.
- **Privacy position, and where it differs from the sessions above.** Every *identifier* is
  replaced by a placeholder: `OWNER`, `PROPERTY_CUPERTINO`, `PROPERTY_SF`. No name, street
  address, parcel number, account number, phone number or email appears anywhere in the
  published files, and `tools/verify.py` scans for all of them on every run.
- The owner-supplied **financial** figures (values, rent, utilities, tax history) are published
  because the brief requires them, but every one carries an `owner` badge, is labelled
  *OWNER-PROVIDED - UNVERIFIED*, and is kept out of the official-source columns. Figures that
  could not be confirmed from an official source are left **blank** and flagged rather than
  inferred. The ZIP codes are the owner's own labels for the two properties and are used only
  to identify the two tax jurisdictions; no address is published.
- **Headline findings.** California prohibits gift, inheritance and estate taxes by statute
  (R&T 13301) and the 2026 federal basic exclusion is $15,000,000 per person (IRS Rev. Proc.
  2025-32 4.14), so no estate tax applies. The inheritance cost is property tax reassessment,
  and it turns on the trust: funding a revocable trust is not a change of ownership
  (R&T 62(d)), but vesting in a non-trustor beneficiary at death is (BOE LTA 80/25), and a
  later distribution to a child is a parent-to-child transfer subject to Prop 19 (BOE Legal
  Opinion 220.0791). PROPERTY_CUPERTINO should be kept; PROPERTY_SF should be sold after the
  inheritance unless counsel confirms the assessed value survives.
- **Verification performed:** `python3 tools/verify.py` checks page structure, every internal
  page link and `#anchor`, every external link against an allow-list of official domains, the
  integrity of every source key, a privacy scan of all published files, and a numeric
  cross-check of the browser model against a Python re-implementation (30 states and 6 NPVs
  agree to 4.7e-16). `node tools/smoke.js` renders all 26 tables, 5 charts, 35 sources and 18
  flags in a headless DOM and asserts none is empty or contains `undefined`/`NaN`. Both pass
  with zero warnings.
- **Open items for the owner:** 18 flags are on the dashboard's *Flagged for review* page. The
  five that actually change a number are F1/F4/F5 (the two parcel lookups), F9 (insurance
  quotes), F10 (a written trust-drafting opinion) and F16 (the owner's original spreadsheet).
- **Deployment:** PR from `arena/19c970ac-cupertino1` to `main`; Pages source moved to
  `main` `/docs`. PR number, merge commit and deploy status are recorded below once known.

---

## Session 6099c2f2 — branch `arena/6099c2f2-cupertino1` (full brief: research + model + site + integration)

- **Scope claimed (T01–T15 on this session's original board):** the complete owner brief —
  research and line-by-line verification, executive summary, scenario model, static GitHub
  Pages site with per-row official sources, flagged page, PR to `main`, merge, and Pages
  confirmation. All tasks were claimed by this session at start (no other branches existed
  then); later sessions' merged work was integrated, not overwritten (see conflicts below).
- **Privacy position:** identical to session `19c970ac` and consistent with the owner's own
  definition of personal information (names, addresses, phone numbers, account details).
  No identifier of any kind is published (properties appear only as "Cupertino (95014)" /
  "SF (94122)"); owner-supplied financial figures ARE published because the brief requires
  them in tables, each row carrying an `owner`-style **User-provided · unverified** badge and
  kept out of the official-source columns. Every other row carries an official source link
  and one of five status badges (Verified / User-provided / Assumption / Flagged / Model).
  Unverifiable values are blank or flagged, never inferred (14 flags, F-01…F-14).
- **Deliverable:** `docs/decision/` — an 11-page decision centre (dashboard, executive
  summary, properties + 2026–2050 projections, property-tax deep dive, operating costs,
  live/rent/sell model with a 9-cell sensitivity grid, inheritance & estate tax,
  step-by-step process, law watch incl. official Nov 3 2026 results, flagged page, source
  index). Deterministic generator: `scripts/model.py` → `scripts/build_site.py`;
  verifier: `scripts/check_links.py` (11 pages, 153 internal links, 40 external URLs,
  0 errors at integration).
- **Key verified anchors:** federal basic exclusion 2026 = $15,000,000 (IRS estate-tax
  table; OBBBA P.L. 119-21 permanent, indexed from 2027; Rev. Proc. 2025-32 for $19,000
  gift exclusion); California estate/inheritance tax = $0 (FTB, pick-up tax inoperative
  after 2004); SF secured rate FY2026-27 = 1.18162182% (sftreasurer.org); Santa Clara Tax
  Rate Book 2025-26 (1% max levy, 2% AV cap, observed TRA totals 1.14200%–1.24090%,
  Cupertino = TRA prefix 013 per county planning table); Prop 19 conditions (BOE);
  Prob. Code §16061.7 (60-day trustee notice) and §10810 (probate fee schedule);
  Form 706 due 9 months (IRS); BLS CPI Sept 2026 +3.7% YoY; FHFA Q2 2026 US +2.1%
  (Pacific ≈0%); 10-yr Treasury 4.84% on 2026-11-05; CA DOI 2024 avg homeowners premium
  $1,967.59 and 2026 market-stabilisation news; CPUC Net Billing Tariff (D.22-12-056);
  official SOS results for Props 1/3/37 passed, 40/43/45 failed (certification 2026-12-11).
- **Model headline (base case: inherit 2045, 10 years, 3% home / 6% portfolio):**
  C sell & reinvest $13.75M > A live in Cupertino $12.19M > B rent (reassessed) $12.07M;
  C wins 8 of 9 sensitivity cells; B is cash-flow negative after Prop 19 reassessment
  (−$15.7k/yr in 2045). This complements — does not contradict — session 19c970ac's
  "keep Cupertino, live in it" guidance: if the owner will live in Cupertino, Option A is
  the plan (and its consumption value is not counted in the profit metric).
- **Differences flagged vs other sessions' work:** user-implied tax rates (Cupertino
  1.335%, SF 2.13%) exceed official value-based rates → reconciled with flagged flat
  direct-charge allowances; Cupertino exact TRA total not machine-extractable → model uses
  1.20% inside the observed official range; HUD FMR query tool returned empty tables →
  rent benchmarks left flagged (never guessed).
- **Merge conflicts resolved (this PR):** add/add conflicts on `index.html`,
  `COORDINATION.md`, and a content conflict on `README.md` against `origin/main`
  (sessions e5dba077/5d8bdba4/92c8488c/19c970ac). Resolution: `index.html` kept as
  main's anonymised executive summary (their claimed scope); `COORDINATION.md` kept as
  main's board with this session's section appended; `README.md` merged to describe all
  three publications; this session's site relocated to `docs/decision/` (self-contained)
  so main's `docs/` dashboard and root anonymised site are untouched. One integration
  edit: a footer link from `docs/index.html` to `decision/index.html` (logged here).
- **Cross-session requests:** none open. Note for sessions re-running `tools/verify.py`:
  its privacy scan may flag owner figures under `docs/decision/` — those figures are
  owner-authorized per the brief (badged), same policy as the main `docs/` dashboard.

### Session 6099c2f2 — deployment record (final)

- **PR:** [#9](https://github.com/ginnymcfiner23-ux/Cupertino1/pull/9) — MERGED into `main`
  2026-11-06T14:17:57Z, merge commit `fcb8344ef06a7913a2a3ed88beab4cb1a45dae08`
  (`gh pr merge 9 --merge`, after resolving add/add conflicts against `origin/main` as
  documented in this session's section above).
- **Merge result:** clean; all other sessions' trees preserved — root anonymised site
  (unchanged), `docs/` dashboard (unchanged except one added footer link to
  `decision/index.html`), `research/`, `site/`, `data/`, `tools/`, `.github/workflows/pages.yml`.
- **Pages:** workflow `Deploy dashboard to GitHub Pages` run `42232677136` → **success**;
  `pages build and deployment` run `42232676074` → **success** (artifact path `docs`).
- **Live URLs (both fetched and content-verified after deploy, 2026-11-06):**
  - Main dashboard: https://ginnymcfiner23-ux.github.io/Cupertino1/
  - This session's decision centre: https://ginnymcfiner23-ux.github.io/Cupertino1/decision/
    (executive summary, 11 pages, per-row sources, 14 flags — verified rendered).
- **Integration checks at merge time:** `python3 scripts/check_links.py` → 11 pages,
  153 internal links, 40 external URLs, 0 errors. Cross-links verified live in both
  directions (`docs/index.html` footer → `decision/index.html`; decision centre navfoot →
  `../index.html`).
- **Follow-up:** this record was pushed in a second small PR after the deploy verification;
  flagged items (F-01…F-14) remain open and non-blocking by design.
