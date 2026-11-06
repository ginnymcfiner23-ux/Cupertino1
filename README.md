# California Property Inheritance Decision Dashboard

This repository contains **two related publications**, kept deliberately separate because they
serve different audiences and apply different privacy rules.

| Publication | Where it lives | What it is |
|---|---|---|
| **1. The personalised two-property decision dashboard** | [`docs/`](docs/) | The dashboard the owner asked for: two specific properties, the owner-supplied tax and assessment history, 2026&ndash;2050 projections, a live scenario model and the inheritance process. Every value carries a basis tag and an official source link. |
| **2. The anonymised law-reference site** | repository root (`index.html`, `properties.html`, `tax-law.html`, `inheritance.html`, `flagged-review.html`) | The earlier privacy-first publication produced by the parallel research sessions: current federal and California transfer-tax rules, the inheritance workflow and cost-model inputs, with every property-specific figure masked. Built by sessions `e5dba077`, `92c8488c` and `5d8bdba4` and left exactly as they left it. |

**The published GitHub Pages site is publication 1** (`docs/`), at
<https://ginnymcfiner23-ux.github.io/Cupertino1/>.

---

## 1. The personalised dashboard (`docs/`)

Two properties that are expected to pass to the owner through a trust around 2040&ndash;2050:

| | PROPERTY_CUPERTINO | PROPERTY_SF |
|---|---|---|
| Location | Cupertino, ZIP 95014 | San Francisco Outer Sunset, ZIP 94122 |
| Type | Single-family house, owner-occupied | Three-unit residential building (owner occupies one unit) |
| Market value (owner estimate, Nov 2026) | $3,100,000 | $1,800,000 |
| Rental income | none today | $85,800 / year from two rented units |

### The headline

There is **no estate or inheritance tax** on this inheritance &mdash; California prohibits gift,
inheritance and estate taxes by statute (R&amp;T &sect;13301), and the federal estate tax only
applies above $15,000,000 per person in 2026 (IRS Rev. Proc. 2025-32 &sect;4.14).

What the inheritance *does* cost is **property tax reassessment**, and that turns almost
entirely on how the revocable trust is drafted:

* Funding a revocable trust during life is **not** a change of ownership (R&amp;T &sect;62(d)),
  so the low Prop&nbsp;13 base survives the funding.
* At the owner&rsquo;s death the trust becomes irrevocable. If an interest vests in a
  beneficiary other than the trustor or the trustor&rsquo;s spouse, that **is** a change of
  ownership (BOE LTA 80/25), and a later distribution to a child is a parent-to-child transfer
  subject to Prop&nbsp;19 (BOE Legal Opinion 220.0791).
* The difference is roughly **$44,000&ndash;$59,000 a year** on PROPERTY_CUPERTINO and roughly
  **$39,000 a year** on PROPERTY_SF.

**Recommendation:** keep PROPERTY_CUPERTINO (live in it), and sell PROPERTY_SF after the
inheritance unless counsel confirms in writing that the assessed value survives. The full
reasoning, with the numbers and every open question, is on the site.

### Site map

| Page | Contents |
|---|---|
| `docs/index.html` | Executive summary and the recommendation |
| `docs/properties.html` | Core facts, owner-supplied tax and assessment history, official facts |
| `docs/property-tax.html` | Rates, Prop&nbsp;13 mechanics, year-by-year projections |
| `docs/operating-costs.html` | Water, sewer, stormwater, electricity, insurance, maintenance |
| `docs/inheritance-process.html` | Step-by-step process, annual calendar, deadlines |
| `docs/inheritance-taxes.html` | Federal/state/local thresholds, Prop&nbsp;19, pending law |
| `docs/scenarios.html` | Interactive model: inheritance year, appreciation, NPVs |
| `docs/flagged.html` | Eighteen open items with the action needed for each |
| `docs/sources.html` | Every official source, with publisher and access date |

### Running it locally

```bash
cd docs && python3 -m http.server 8000
# then open http://localhost:8000/
```

No build step, no dependency, no framework &mdash; plain HTML, CSS and vanilla JavaScript.
Every page also works by opening the file directly.

### Verifying it

```bash
python3 tools/verify.py     # structure, links, data integrity, privacy, model cross-check
node tools/smoke.js         # renders every table and chart headlessly and checks the output
```

`verify.py` does five things:

1. **Structure** &mdash; every page exists, carries the full navigation and footer, and links
   both scripts and the stylesheet.
2. **Links** &mdash; every internal page link and `#anchor` resolves, and every external link
   is `https` on an allow-list of official domains.
3. **Data** &mdash; every source key used in `docs/assets/js/data.js` is defined, every cell
   that claims an official or pending basis carries a source link, no source is defined but
   never cited, and the flag count on the pages matches the dataset.
4. **Privacy** &mdash; no email address, phone number, street address, parcel number or other
   personal identifier appears anywhere in the published files.
5. **Model** &mdash; the JavaScript model that ships in the browser is re-implemented in Python
   and the two are compared numerically, so a formula error in either is caught.

### Source policy

Every published figure is one of:

| Tag | Meaning |
|---|---|
| `official` | confirmed against a government publication or a filed utility rate schedule |
| `owner` | supplied by the owner &mdash; **not** verified |
| `derived` | computed arithmetically from other stated figures |
| `assumption` | a planning assumption with no official source |
| `unverified` | could not be confirmed &mdash; **left blank** and flagged |
| `pending` | not yet published or not yet in force |

Anything that could not be confirmed from an official source is left blank and listed on the
**Flagged for review** page with the single action that would close it. Nothing is inferred to
fill a gap.

### Privacy

No name, street address, parcel number, account number or other personal identifier appears
anywhere in this repository or on the published site. The two properties are referred to only
as `PROPERTY_CUPERTINO` and `PROPERTY_SF`; the owner as `OWNER`. Owner-supplied financial
figures are published because the brief calls for them, and each one is labelled
*OWNER-PROVIDED &mdash; UNVERIFIED* and kept out of the official-source columns.

### Disclaimer

Decision-support analysis, not legal, tax or investment advice. Confirm the trust, Prop&nbsp;19
and estate-tax conclusions with a California estate-planning attorney before acting.

---

## 2. The anonymised law-reference site (repository root)

*A privacy-first, source-linked dashboard for comparing the options to occupy, rent, or sell
inherited residential property. It organizes current federal transfer-tax and California
property-tax rules, an inheritance workflow, cost-model inputs, and unresolved items. Local
source links cover the relevant California jurisdictions.*

### View locally

Open `index.html` in a browser, or serve the repository root with any static HTTP server. The
site uses plain HTML and CSS; it has no build step or third-party runtime dependencies.

### Evidence and privacy rules

* No personal names, street addresses, ZIP codes, parcel numbers, contact details, leases, or
  personal financial amounts are published.
* Property-specific values and historical amounts are masked with placeholders. No supplied
  property figure could be matched to an official parcel record without parcel identifiers; no
  identifiers were added to this public site.
* Each table row has an official source link. A cited rule/source does not verify a private
  value; this distinction is shown in the row status.
* Future home prices, assessed values, property taxes, utilities, insurance premiums, repairs,
  and tax law are not presented as facts. Forecast values remain blank where official,
  property-specific evidence is not available. Formulas and decision conditions are shown
  instead.
* This is educational planning material, not tax, legal, financial, insurance, or real-estate
  advice. Obtain professional advice at the time of transfer; rules may change before
  2040&ndash;2050.

### Site map

* `index.html` &mdash; executive summary and conditional decision guidance
* `properties.html` &mdash; anonymized property scenarios, masked history, operating-cost
  framework, forecast limits
* `tax-law.html` &mdash; federal, California, county, and city tax rules
* `inheritance.html` &mdash; transfer workflow and deadline checklist
* `flagged-review.html` &mdash; unresolved / unverified items and official verification routes

---

## Coordination

`COORDINATION.md` is the shared board: task ownership, the session log, the conflict and
privacy incident log, and the deployment record. The two publications above were produced by
different sessions under different file scopes; neither rewrites the other&rsquo;s files.
