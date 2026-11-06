# Cupertino1 — Inheritance Decision Site (Cupertino house vs SF 3-unit)

Static GitHub Pages site analyzing whether to **live in / rent / sell** a trust-inherited
Cupertino house (zip 95014) versus keeping the SF Outer Sunset 3-unit property (94122),
including property-tax, insurance, utility, maintenance projections, the inheritance process,
estate-tax thresholds, and pending law changes — every table row sourced to an official
government page, with unverifiable values **flagged, never inferred**.

## Privacy

- **No personal information is published**: no names, street addresses, phone numbers, or
  account details. Properties are identified by city/zip only.
- User-provided figures (assessed values, tax bills, rents) are marked `User-provided ·
  unverified` and are used for modeling only.
- The site sets `noindex, nofollow`.

## Site map

| Page | Contents |
|---|---|
| `index.html` | Dashboard: key facts, decision snapshot, legend |
| `pages/executive-summary.html` | Recommendation + line-by-line findings |
| `pages/properties.html` | AV/tax history (user), value/AV/tax projections 2026–2050 |
| `pages/property-tax.html` | Prop 13/19 rules, official rates, reassessment fork |
| `pages/operating-costs.html` | Tax, insurance, water, electric, maintenance, rent benchmarks |
| `pages/scenarios.html` | Live / rent / sell 10-year model + sensitivity grid |
| `pages/inheritance-tax.html` | Federal $15M threshold, CA = $0, projections, mechanics |
| `pages/inheritance-process.html` | Step-by-step trust inheritance + statutory deadlines/fees |
| `pages/law-watch.html` | 2026 election results (official) + statutes in motion |
| `pages/flagged-review.html` | All unverified/flagged items (F-01…F-14) |
| `pages/sources.html` | Full official-source index |

Status badges on every row: **Verified** (official source) · **User-provided** ·
**Assumption** · **Flagged** · **Model output**.

## Rebuild (deterministic)

```bash
python3 scripts/model.py        # → build/model.json (projections & scenarios)
python3 scripts/build_site.py   # → index.html + pages/*.html
python3 scripts/check_links.py  # internal link/anchor verification
```

Key model inputs live at the top of `scripts/model.py` (`A = {...}`) with status tags.
Base case: inherit **2045** (midpoint of 2040–2050), home appreciation 3%/yr,
portfolio 6% nominal (5.5% after-tax), Prop 13 AV cap 2%/yr, Cupertino TRA rate 1.20%
(within the official county range 1.14200%–1.24090%).

## Coordination

Shared task board, source/verification logs, cross-session notes, and the PR & deploy
record live in [`COORDINATION.md`](COORDINATION.md).

## License / disclaimer

Educational analysis from public official sources as verified on 2026-11-06; not legal,
tax, or investment advice. Flagged items require manual verification against your tax bills
and professionals.
