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

Session `arena/5d8bdba4-cupertino1` (privacy-first rebuild, on `main`):
- `index.html` — executive summary and conditional decision guidance
- `properties.html` — anonymized property scenarios, masked history, operating-cost framework, forecast limits
- `tax-law.html` — federal, California, county, and city tax rules
- `inheritance.html` — transfer workflow and deadline checklist
- `flagged-review.html` — unresolved / unverified items and official verification routes

Session `session-arena-5606dc2d-cupertino1` (integration branch, under `site/`):
- `site/index.html` — Executive summary (dashboard)
- `site/properties.html` — Anonymized property scenarios; user-supplied figures flagged unverified
- `site/taxes.html` — Federal estate tax, California taxes, Prop 13 / Prop 19
- `site/costs.html` — Cost framework: insurance, water, electricity/solar, maintenance
- `site/projections.html` — Year-by-year projection model (assumptions labeled)
- `site/decision.html` — Occupy / Rent / Sell decision analysis and recommendation
- `site/inheritance-process.html` — California trust administration process, step by step
- `site/thresholds.html` — Inheritance/estate tax thresholds: federal, state, local
- `site/law-changes.html` — Pending and recent law changes
- `site/flagged-for-review.html` — Flagged for Review
- `site/sources.html` — Sources and verification standard

## Privacy

Personal information privacy is top priority. Names, addresses, phone numbers, account details, parcel numbers, and property-specific financial amounts are replaced with placeholders everywhere on the site. No personal information appears in tables or pages. Anything personal discovered during research is for internal use only and must not appear in the final website product.

## Key findings (statutory figures, current law)

- **California has no inheritance tax and no state estate tax; inheritance is not taxable income.** Source: CA Franchise Tax Board (ftb.ca.gov); CA Revenue & Taxation Code §13301.
- **Federal estate tax exemption: $15,000,000 per person; $30,000,000 per married couple with portability; top rate 40%.** Source: IRS.gov, Form 706 instructions. Set by Pub. L. 119-21 §70106 (One Big Beautiful Bill Act, signed July 4, 2025), amending IRC §2010(c); indexed for inflation after 2026.
- **Step-up in basis:** inherited property basis resets to fair market value at date of death → selling shortly after inheritance generally produces little or no capital gains tax. Source: IRS Publication 551 (IRC §1014).
- **Proposition 19 (effective Feb 16, 2021):** keeping an inherited California home as a rental/second home triggers full reassessment to market value; an heir who moves in as primary residence (file BOE-266 within 1 year, BOE-19-P within 3 years) keeps assessed value plus an inflation-adjusted cap. Source: CA Board of Equalization, boe.ca.gov/prop19.

## Verification standard

Every table row on the site links to an official source (irs.gov, ftb.ca.gov, boe.ca.gov, sccassessor.org, sfassessor.org, sfpuc.gov, sjwater.com/CPUC, pge.com/CPUC, insurance.ca.gov, congress.gov, courts.ca.gov, leginfo.legislature.ca.gov, fhfa.gov), or the cell is left blank and flagged as unverified on the Flagged for Review page. No values are inferred or filled in. Projections are explicitly labeled assumptions and are never presented as verified facts.

## Status

Site content complete; verified against official sources where available. Unverified items are listed on the Flagged for Review pages and do not block publication.

Task board: `COORDINATION.md`

## Sessions

- `arena-cupertino1` (branch `arena/e5dba077-cupertino1`) — completed; merged via PR #1.
- `arena/5d8bdba4-cupertino1` — completed privacy-preserving rebuild; merged via PR #4.
- `session-arena-5606dc2d-cupertino1` (branch `arena/5606dc2d-cupertino1`) — integration branch; PR #2 → main.
