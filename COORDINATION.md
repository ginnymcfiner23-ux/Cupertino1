# COORDINATION.md — Shared Task Board

**Project:** Cupertino / San Francisco house inheritance decision-making — research, analysis, and GitHub Pages site.
**Repo:** ginnymcfiner23-ux/Cupertino1
**Created:** 2026-11-06 (UTC)

## How to use (rules for all sessions)

- Claim a task by writing your **session ID** and **file scope** in the task row, then **commit and push immediately**.
- Never start a task another session has claimed (status `in progress` with an active owner).
- Keep scopes non-overlapping. Each session edits only files in its claimed scope.
- If a task requires changing a file owned by another session, log the request in the Change Request Log below instead of editing it.
- Small, frequent commits. Run `git pull --rebase` before every push.
- On merge conflict: stop, resolve without discarding the other session's work, and log it in the Incident Log.
- Mark a task `done` only after recording **sources**, **verification performed**, and **irregularities** in the Verification Log.
- Status `needs review` = published on the site's "Flagged for Review" page; does not block anything.
- If a claim is >60 minutes old with no commits, any other session may take over and note the handoff.
- **Privacy (highest priority):** no personal information (names, street addresses, APN/parcel numbers, account numbers) may appear in any file that ships to the site. Use placeholders. Research-only personal data stays internal and must not be published.

## Session registry

| Session ID | Branch | Status |
|---|---|---|
| arena-262f63e8 (sole session, initial) | `arena/262f63e8-cupertino1` | active |
| _(unclaimed — additional sessions: add yourself here before claiming)_ | — | — |

## Task board

| Task ID | Task | Status | Owner | File scope | Notes |
|---|---|---|---|---|---|
| T01 | Repo review + coordination setup | done | arena-262f63e8 | COORDINATION.md, README.md | Repo had only README. Board created. |
| T02 | Executive summary (site page) | in progress | arena-262f63e8 | `site/executive-summary.html`, `data/` summaries | Anonymized; placeholders only. |
| T03 | Property tax & assessment research (Prop 13/19, Santa Clara Cty, SF, change-of-ownership) | in progress | arena-262f63e8 | `data/property-tax.js`, `site/property-tax.html` | Official sources only (BOE, county assessor/tax collector). |
| T04 | Insurance cost research (Cupertino owner-occupied; SF rental DP-3) | in progress | arena-262f63e8 | `data/insurance.js`, `site/insurance.html` | CDI/official sources; unverified → blank + flagged. |
| T05 | Operating cost projections (water, electric/solar, maintenance; inflation basis) | in progress | arena-262f63e8 | `data/operating-costs.js`, `site/operating-costs.html` | User-supplied figures labeled "user-provided (unverified)". |
| T06 | Inheritance / estate tax research (federal + CA, thresholds, future changes) | in progress | arena-262f63e8 | `data/inheritance-tax.js`, `site/inheritance-tax.html` | IRS + FTB + leginfo sources. |
| T07 | Decision analysis: live vs rent vs sell + reinvestment projections | in progress | arena-262f63e8 | `data/decision-analysis.js`, `site/decision-analysis.html` | Models tied to cited inputs; assumptions explicit. |
| T08 | Inheritance process step-by-step | in progress | arena-262f63e8 | `site/inheritance-process.html` | BOE/county/IRS steps with links. |
| T09 | Law-change watch (Prop 19, AB 1482, federal estate sunset/OBBBA, CA insurance regs) | in progress | arena-262f63e8 | `data/law-changes.js`, `site/law-changes.html` | Cite official text (leginfo, IRS, Congress). |
| T10 | Site build: landing page + subpages, dashboard UI, tables with per-row source links | in progress | arena-262f63e8 | `site/**`, `index.html`, `assets/**` | Static site; no build step; GitHub Pages from `main`. |
| T11 | Line-by-line verification pass (every row sourced or flagged) | unclaimed | — | `data/**`, `site/flagged.html` | Independent pass before integration. |
| T12 | Final integration, PR → main, merge, GitHub Pages deploy | unclaimed | — | `COORDINATION.md`, PR/merge ops | Publish PR link + merge result here. |

## Change Request Log

| Date | From session | Request | Target file (owner) | Status |
|---|---|---|---|---|
| — | — | — | — | — |

## Incident Log

| Date | Session | Incident / conflict / takeover | Resolution |
|---|---|---|---|
| 2026-11-06 | arena-262f63e8 | Repo contained only `README.md`; no prior COORDINATION.md. | Created this board; claimed T01–T10. |

## Verification Log

| Date | Task | Sources checked (official links) | Verification performed | Irregularities flagged |
|---|---|---|---|---|
| _Filled in as tasks complete — never mark verified without an official source link._ | | | | |

## Ship / Publish Log

| Event | Date | Detail |
|---|---|---|
| PR created | — | — |
| PR merged | — | — |
| GitHub Pages live | — | URL will be recorded here |
