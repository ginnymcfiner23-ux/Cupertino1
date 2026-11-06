# Cupertino1 — inheritance decision study

Static study comparing live-in / rent / sell-and-reinvest for two inherited properties (Cupertino, CA and San Francisco, CA), with official-source citations and a Flagged for Review page.

- Live site: https://ginnymcfiner23-ux.github.io/Cupertino1/
- `data/` — sources register, verified facts (blank + flagged when unverified), user inputs (unverified), flags, projection outputs
- `model/projections.py` — projection and decision model (standard library)
- `scripts/verify_history.py` — line-by-line check of user-supplied tax/assessment history
- `scripts/build_site.py` — builds `site/` from `data/`
- `scripts/check_site.py` — link/anchor/source/privacy checks (must pass before deploy)
- `.github/workflows/pages.yml` — rebuilds and checks the site on every push and PR (blocks a broken site)
- `index.html` (repo root) — redirects to `site/index.html`; GitHub Pages serves the branch root, so a push to `main` publishes the site

Rebuild locally:
```
python3 model/projections.py && python3 scripts/verify_history.py && python3 scripts/build_site.py && python3 scripts/check_site.py
```

Not tax, legal, or investment advice. Personal information is withheld.
