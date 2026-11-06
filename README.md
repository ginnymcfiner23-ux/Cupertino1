# California Property Inheritance Decision Dashboard

A privacy-first, source-linked dashboard for comparing the options to occupy, rent, or sell inherited residential property. It organizes current federal transfer-tax and California property-tax rules, an inheritance workflow, cost-model inputs, and unresolved items. Local source links cover the relevant California jurisdictions.

## View locally

Open `index.html` in a browser, or serve the repository root with any static HTTP server. The site uses plain HTML and CSS; it has no build step or third-party runtime dependencies.

## Evidence and privacy rules

- No personal names, street addresses, ZIP codes, parcel numbers, contact details, leases, or personal financial amounts are published.
- Property-specific values and historical amounts are masked with placeholders. No supplied property figure could be matched to an official parcel record without parcel identifiers; no identifiers were added to this public site.
- Each table row has an official source link. A cited rule/source does not verify a private value; this distinction is shown in the row status.
- Future home prices, assessed values, property taxes, utilities, insurance premiums, repairs, and tax law are not presented as facts. Forecast values remain blank where official, property-specific evidence is not available. Formulas and decision conditions are shown instead.
- This is educational planning material, not tax, legal, financial, insurance, or real-estate advice. Obtain professional advice at the time of transfer; rules may change before 2040–2050.

## Site map

- `index.html` — executive summary and conditional decision guidance
- `properties.html` — anonymized property scenarios, masked history, operating-cost framework, forecast limits
- `tax-law.html` — federal, California, county, and city tax rules
- `inheritance.html` — transfer workflow and deadline checklist
- `flagged-review.html` — unresolved / unverified items and official verification routes


---

## Data-driven study build (session 92c8488c) — `site/`

Open `site/index.html`, or use the link on the root dashboard. This build separates verified values (official sources, row by row) from user-provided inputs (labeled unverified) and flags everything else as blank.

- `data/` — source register with access record, verified facts (blank + flagged when unverified), user inputs, flags F-01 to F-25, projection outputs
- `model/projections.py` — 2026–2065 annual projection and after-tax sell / live / rent / keep comparison (base, low, high)
- `scripts/verify_history.py` — line-by-line recheck of the user's tax and assessment history
- `scripts/build_site.py` — builds `site/` from `data/`; `scripts/check_site.py` — link, anchor, source and privacy checks
- `.github/workflows/pages.yml` — rebuilds and checks the site on every push and PR

Rebuild: `python3 model/projections.py && python3 scripts/verify_history.py && python3 scripts/build_site.py && python3 scripts/check_site.py`

Not tax, legal, or investment advice. Personal information (names, addresses, parcel numbers, ZIP codes, trust and heir details) is withheld.
