# Shared task board — Cupertino1

Session ID: `92c8488c` (branch `arena/92c8488c-cupertino1`)

Note on branching: this session is bound to branch `arena/92c8488c-cupertino1` by the Arena platform.
The session-branch naming scheme (`session-<id>/<task>`) cannot be used here, so all tasks are
tracked on this one branch and recorded below. No other sessions were observed on the repo at claim time
(only `main` and this branch existed).

Status values: unclaimed | in progress | done | needs review

| ID | Task | Status | Owner session | Files touched |
|----|------|--------|---------------|---------------|
| T1 | Research & source capture (tax law, property tax, insurance, utilities, rent rules) | done (gaps flagged F-04/F-05/F-10/F-11/F-14/F-16) | 92c8488c | `data/*.json` |
| T2 | Projections model (property value, tax, costs, scenarios, inheritance threshold) | done | 92c8488c | `model/*.py`, `data/projections.json` |
| T3 | Site build (landing + category subpages + Flagged for Review) | done (build + check pass) | 92c8488c | `site/**`, `scripts/**` |
| T4 | Integration: re-verify, build, link-check, PR, merge, Pages deploy | in progress | 92c8488c | `.github/workflows/**`, `COORDINATION.md` |

Claim time: 2026-11-06 (UTC). Claims are pushed immediately on creation.

## Log
- 2026-11-06 — 92c8488c claimed T1–T4 (single active session). Pushing claim.
- 2026-11-06 — T1 committed: data/sources.json, verified_facts.json (30 verified / 11 blank+flagged), user_inputs.json, history check.
- 2026-11-06 — T2 committed: model/projections.py → data/projections.json (base/low/high).
- 2026-11-06 — T3: scripts/build_site.py → site/ (9 pages); scripts/check_site.py passes.
- 2026-11-06 — T4: Pages switched to GitHub Actions workflow (.github/workflows/pages.yml); PR and merge next.
