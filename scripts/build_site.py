"""Builds the static GitHub Pages site in site/ from data/*.json.  Standard library only.
Run:  python3 model/projections.py && python3 scripts/verify_history.py && python3 scripts/build_site.py
"""
import html, json, pathlib, datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
D = lambda name: json.loads((ROOT / "data" / name).read_text())
SRC = {s["id"]: s for s in D("sources.json")["sources"]}
FACTS = D("verified_facts.json")["rows"]
FLAGS = {f["id"]: f for f in D("flags.json")["flags"]}
U = D("user_inputs.json")
PROJ = D("projections.json")
HIST = D("history_check.json")
BASE = PROJ["scenarios"]["base"]
LOW, HIGHS = PROJ["scenarios"]["low"], PROJ["scenarios"]["high"]
TODAY = "2026-11-06"

def e(x): return html.escape("" if x is None else str(x))
def money(x, dp=0):
    if x is None: return "<em>blank</em>"
    s = f"{abs(x):,.{dp}f}"
    return ("−$" if x < 0 else "$") + s
def pct(x, dp=2):
    return "<em>blank</em>" if x is None else f"{x*100:.{dp}f}%"
def srclinks(ids):
    out = []
    for i in ids:
        s = SRC.get(i)
        if not s: continue
        tag = "official" if s["official"] else "secondary"
        out.append(f'<a href="{e(s["url"])}" rel="noopener" target="_blank" title="{e(s["title"])}">{e(i)} ({tag})</a>')
    return " · ".join(out) if out else '<span class="warn">none (flagged)</span>'
def flaglink(fid):
    if not fid: return ""
    return f'<a href="flagged.html#{e(fid)}" class="flag">{e(fid)}</a>'
def badge(status):
    cls = {"verified": "ok", "unverified": "warn", "user": "user"}.get(status, "")
    lab = {"verified": "VERIFIED", "unverified": "BLANK / FLAGGED", "user": "USER-PROVIDED (unverified)"}.get(status, status)
    return f'<span class="badge {cls}">{lab}</span>'
def table(headers, rows, cls="", search=True):
    h = "".join(f"<th>{e(x)}</th>" for x in headers)
    body = "".join("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>" for r in rows)
    s = ' data-filter="1"' if search else ""
    return f'<div class="tablewrap"><table class="{cls}"{s}><thead><tr>{h}</tr></thead><tbody>{body}</tbody></table></div>'

NAV = [("index.html", "Dashboard"), ("property-data.html", "Property data"), ("costs.html", "Costs & utilities"),
       ("tax-law.html", "Tax & law"), ("projections.html", "Projections"), ("inheritance.html", "Inheritance steps"),
       ("decision.html", "Decision & plan"), ("flagged.html", "Flagged for Review"), ("sources.html", "Sources")]

def page(fname, title, body, lead=""):
    nav = "".join(f'<a href="{href}"{" class=active" if href == fname else ""}>{e(lab)}</a>' for href, lab in NAV)
    head = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} · Inheritance decision study</title>
<link rel="stylesheet" href="assets/study.css"></head><body>
<header><div class="brand">Inheritance decision study <span>2040–2050 trust scenario</span></div>
<nav>{nav}</nav></header><main>
<h1>{e(title)}</h1>{('<p class="lead">' + lead + '</p>') if lead else ''}
<p class="disclaimer">Not tax, legal, or investment advice. Projections are illustrative. Values marked <span class="badge user">USER-PROVIDED</span> are inputs not verified against an official source. Blank cells are unverified and flagged.</p>"""
    foot = f"""</main><footer>Data as of {TODAY}. Official sources are linked per row. Built from <code>data/*.json</code> by <code>scripts/build_site.py</code>.
Personal information is withheld. Placeholders: Property A (Cupertino), Property B (San Francisco).</footer>
<script src="assets/study.js"></script></body></html>"""
    (SITE / fname).write_text(head + body + foot, encoding="utf-8")

# ----------------------------------------------------------------- derived numbers
dA = BASE["decisions"]["2045"]["cupertino"]; dB = BASE["decisions"]["2045"]["sf"]
a_now = U["property_a"]["history"][1]["property_tax"]; b_now = U["property_b"]["history"][0]["property_tax"]
A_eff = PROJ["derived_anchors"]["cupertino_effective_rate"]; B_eff = PROJ["derived_anchors"]["sf_effective_rate"]

def scen_rows(s, Y):
    c = s["decisions"][str(Y)]["cupertino"]; b = s["decisions"][str(Y)]["sf"]
    return c, b

# ----------------------------------------------------------------- Dashboard
kpis = [
 ("Property A est. market value (user)", money(U["property_a"]["estimated_market_value_nov_2026"]), "USER-PROVIDED", "property-data.html"),
 ("Property B est. market value (user)", money(U["property_b"]["estimated_market_value_nov_2026"]), "USER-PROVIDED", "property-data.html"),
 ("Federal estate exclusion, 2026 (per person)", money(15000000), "VERIFIED · IRS", "tax-law.html"),
 ("Prop 19 parent-child value cap", money(1044586), "VERIFIED · BOE", "tax-law.html"),
 ("Prop 13 max assessed-value growth", "2% / yr", "VERIFIED · BOE", "tax-law.html"),
 ("Flags open for review", str(len(FLAGS)), "see page", "flagged.html"),
]
kcards = "".join(f'<a class="card" href="{h}"><div class="k">{e(l)}</div><div class="v">{e(v)}</div><div class="tag">{e(t)}</div></a>' for l, v, t, h in kpis)
summary = f"""
<section><h2>Executive summary</h2>
<ul>
<li><strong>Federal estate tax is not the main issue for these two properties.</strong> The 2026 basic exclusion is {money(15000000)} per person (IRS). The two properties total about {money(4900000)} in user-estimated value, which leaves roughly {money(10100000)} of headroom for other estate assets before debts, expenses, and prior gifts (see <a href="inheritance.html">Inheritance steps</a>).</li>
<li><strong>California adds no inheritance or estate tax</strong> on these assets (research basis: secondary sources; official confirmation flagged, <a href="flagged.html#F-11">F-11</a>). Rental income and sale gains remain taxable.</li>
<li><strong>Prop 19 is the largest cost driver.</strong> Inherited property keeps its old assessment only if a child moves in within one year. Otherwise it is reassessed to market. In the base case (inheritance 2045), Property A's first-year tax is about {money(dA['reassessed_property_tax_year1'])} if reassessed versus {money(dA['prop19_qualified_property_tax_year1'])} if the child qualifies, against {money(a_now)} today.</li>
<li><strong>Property B's rental reassessment is steep.</strong> In the base case, its first-year tax is about {money(dB['keep_rental_reassessed_tax_year1'])} after reassessment, against {money(b_now)} today (the rent-controlled units' treatment is flagged, <a href="flagged.html#F-17">F-17</a>).</li>
<li><strong>Sell-and-invest beat both living in A and renting out B</strong> in the low, base, and high scenarios (see <a href="decision.html">Decision &amp; plan</a>). The gap is driven by the after-tax investment return assumption, which is labeled, not verified.</li>
</ul></section>
<section class="plan"><h2>Best plan (based on the model)</h2>
<ol>
<li><strong>Sell Property B soon after inheritance</strong> (base 2045: sell-and-invest ≈ {money(dB['sell_value_at_horizon'])} vs keep-as-rental ≈ {money(dB['keep_rental_wealth_at_horizon'])} after 10 years). Reassessment alone makes the rent-controlled building costly to hold.</li>
<li><strong>Sell Property A soon after inheritance</strong> unless a child will actually live there within a year and the housing value is worth more than the break-even avoided rent (base 2045: about {money(dA['breakeven_avoided_rent_monthly_if_live_yr1'])}/mo). No market rent was supplied, so that figure is a threshold, not a finding.</li>
<li><strong>Keep the step-up:</strong> value both properties at date-of-death market value and keep the appraisal (IRS basis rules; <a href="flagged.html#F-06">F-06</a>).</li>
<li><strong>Verify before acting:</strong> the flagged items on the <a href="flagged.html">Flagged for Review</a> page, especially market values, water provider, and the Prop 19 treatment of a multi-unit property.</li>
</ol>
<p class="small">Scenario labels: base = 2.5% inflation, 2.5% home growth, 6% nominal investment return; low and high are on the <a href="decision.html">decision page</a>. All are labeled assumptions.</p></section>
"""
body = f"""<div class="cards">{kcards}</div>{summary}
<section><h2>Explore</h2><div class="cards">
<a class="card" href="property-data.html"><div class="k">Data</div><div class="v">Property history</div><div class="tag">User-provided · checked</div></a>
<a class="card" href="costs.html"><div class="k">Carrying costs</div><div class="v">Water · power · insurance</div><div class="tag">Official tariffs · user inputs</div></a>
<a class="card" href="tax-law.html"><div class="k">Law</div><div class="v">Federal · CA · local</div><div class="tag">Official sources</div></a>
<a class="card" href="projections.html"><div class="k">Projections</div><div class="v">2026–2050 by year</div><div class="tag">Labeled assumptions</div></a>
<a class="card" href="inheritance.html"><div class="k">Process</div><div class="v">Step-by-step inheritance</div><div class="tag">With official links</div></a>
<a class="card" href="decision.html"><div class="k">Decision</div><div class="v">Live · rent · sell</div><div class="tag">After-tax comparison</div></a>
<a class="card" href="flagged.html"><div class="k">Review</div><div class="v">Flagged for Review</div><div class="tag">{len(FLAGS)} items</div></a>
<a class="card" href="sources.html"><div class="k">Sources</div><div class="v">Register</div><div class="tag">Official vs secondary</div></a>
</div></section>"""
page("index.html", "Dashboard", body, lead=f"Inheritance decision study for two inherited properties (planned trust transfer, around 2040–2050). Updated {TODAY}.")

# ----------------------------------------------------------------- Property data
def hist_rows(key, label):
    rows = []
    for r in sorted(U[key]["history"], key=lambda x: -x["year"]):
        rows.append([str(r["year"]), money(r["property_tax"]) if r["property_tax"] is not None else "<em>blank (not provided)</em>",
                     f'{r["tax_change_pct_stated"]:+.1f}%' if r["tax_change_pct_stated"] is not None else "<em>blank</em>",
                     money(r["assessed_value"]), f'{r["assessed_change_pct_stated"]:+.1f}%' if r["assessed_change_pct_stated"] is not None else "<em>blank</em>",
                     badge("user"), srclinks(U[key]["verify_links"])])
    return table(["Year", "Property tax", "Tax change (stated)", "Assessed value", "Assessed change (stated)", "Status", "Official verification"], rows)
chk_rows = []
for k, lab in (("property_a", "A · Cupertino"), ("property_b", "B · San Francisco")):
    for c in HIST[k]["checks"]:
        if c["status"] == "match": continue
        fid = "F-01" if (k == "property_a" and c["year"] in (2018, 2020)) else ("F-02" if c.get("status") == "MISMATCH" else "F-01")
        if c["status"] == "MISMATCH": fid = "F-02"
        chk_rows.append([lab, str(c["year"]), c["field"], c.get("computed_pct", "—") if c.get("computed_pct") is None else f'{c["computed_pct"]:+.2f}%',
                         "blank" if c.get("stated_pct") is None else f'{c["stated_pct"]:+.1f}%', e(c["status"]), flaglink(fid)])
body = f"""<section><h2>Property A · Cupertino</h2>
<p>Estimated value ${U['property_a']['estimated_market_value_nov_2026']:,} (user). Assessed values and property taxes are the user's history. The 2026 row has no tax yet.</p>
{hist_rows('property_a','A')}
<p class="small">Effective tax rate on assessed value, latest year with a tax figure (2025): <strong>{pct(A_eff,3)}</strong> (computed, user data; see <a href="flagged.html#F-03">F-03</a>).</p></section>
<section><h2>Property B · San Francisco, 3 units</h2>
<p>Estimated value ${U['property_b']['estimated_market_value_nov_2026']:,} (user). Two of three units rented, total ${U['property_b']['rent_total_monthly']:,}/mo (user).</p>
{hist_rows('property_b','B')}
<p class="small">Effective tax rate on assessed value (2025): <strong>{pct(B_eff,3)}</strong> (computed; see <a href="flagged.html#F-03">F-03</a>).</p></section>
<section><h2>Line-by-line check of the history</h2>
<p>Each year-over-year change was recomputed from the listed values and compared with the stated percentage. Rows that match are not shown. Full detail: <code>data/history_check.json</code>.</p>
{table(["Property", "Year", "Field", "Recomputed", "Stated", "Result", "Flag"], chk_rows)}
</section>"""
page("property-data.html", "Property data", body, lead="Figures supplied by the user are shown with flags because they are not independently verified. Use the official verification links to check them.")

# ----------------------------------------------------------------- Costs & utilities
def fact_rows(cats):
    rows = []
    for f in FACTS:
        if f["category"] not in cats: continue
        val = "<em>blank</em>" if f["value"] is None else (money(f["value"], 2) if f["unit"].startswith("USD") else str(f["value"]) + (" " + f["unit"] if f["unit"] else ""))
        if f["unit"] == "rate" and f["value"] is not None: val = pct(f["value"], 2)
        rows.append([e(f["item"]), val, e(f["as_of"]), badge(f["status"]), srclinks(f["source_ids"]), flaglink(f["flag_id"])])
    return table(["Item", "Value", "As of", "Status", "Official source", "Flag"], rows)
user_cost = [
 ["Water (A · Cupertino)", "$100–150 / mo (user)", f"$125 midpoint", "Provider unverified (F-05)", srclinks(["S16"]), flaglink("F-05")],
 ["Electricity net (A · solar credit)", "$10–20 / mo credit (user)", "−$15 midpoint", "NEM status unknown (F-10)", srclinks(["S18"]), flaglink("F-10")],
 ["Insurance (A)", "$1,500 / yr (user guess)", "$1,500", "Unverified (F-07)", srclinks(["S24"]), flaglink("F-07")],
 ["Water (B · SF, 3 units)", "$330–400 / mo (user)", "$365 midpoint", "Usage implied ~26 ccf/mo (F-19)", srclinks(["S15"]), flaglink("F-19")],
 ["Electricity (B)", "$30–70 / mo (user)", "$50 midpoint", "Unverified (F-10)", srclinks(["S18"]), flaglink("F-10")],
 ["Insurance (B)", "$1,500 / yr (user guess)", "$1,500", "Unverified (F-07)", srclinks(["S24"]), flaglink("F-07")],
]
body = f"""<section><h2>Official tariffs and rules (verified rows)</h2>
<p>Only figures with an official source appear as values. Blank rows are unverified and flagged.</p>
{fact_rows({'water-cupertino','water-sf','sewer-sf','electricity','solar-nem','insurance'})}</section>
<section><h2>Carrying-cost inputs from the user (unverified)</h2>
<p>These figures are inputs to the projections. They are shown with midpoints the model uses. The official link points to where each value can be checked.</p>
{table(["Cost item", "User range", "Model input", "Status", "Official check", "Flag"], user_cost)}
</section>
<section><h2>Water tariff arithmetic (verified rates, illustrative)</h2>
<p>SF Schedule W-1B (3 dwelling units, one meter, 5/8 in): service $19.65 + first 9 ccf at $12.03 + additional at $12.91. A $330 bill implies roughly 26 ccf per month. That is high for 3 units; see <a href="flagged.html#F-19">F-19</a>.</p>
</section>"""
page("costs.html", "Costs & utilities", body)

# ----------------------------------------------------------------- Tax & law
fed = [f for f in FACTS if f["category"] in ("federal", "federal-pending", "legal-nl")]
ca = [f for f in FACTS if f["category"] in ("california",)]
loc = [f for f in FACTS if f["category"] in ("local-santa-clara", "local-sf", "water-cupertino")]
body = f"""<section><h2>Federal</h2>{fact_rows({'federal','federal-pending'})}</section>
<section><h2>California</h2>{fact_rows({'california'})}</section>
<section><h2>Local (Santa Clara / Cupertino; San Francisco)</h2>{fact_rows({'local-santa-clara','local-sf'})}</section>
<section><h2>Pending or possible changes</h2>
<ul>
<li><strong>Prop 19 cap adjustment, Feb 2027:</strong> the $1,044,586 cap is adjusted by BOE every two years (<a href="flagged.html#F-09">F-09</a>). Model holds it constant.</li>
<li><strong>Federal estate-tax proposals:</strong> several proposals are summarized by CRS (exemption, rate, step-up changes). None is enacted per retrieved sources. Terms are not verified (<a href="flagged.html#F-08">F-08</a>).</li>
<li><strong>Prop 40 (billionaire tax):</strong> early counts show failure; certification pending. Applies only above $1B net worth (<a href="flagged.html#F-15">F-15</a>).</li>
</ul></section>
<section><h2>Prop 19 and Prop 13 — how they apply here</h2>
<p>Inheritance is a change in ownership (BOE). Without an exclusion, the property is reassessed to market value. A child may keep the parent's base-year value if the child makes the home a principal residence within one year, under the $1,044,586 cap (BOE). Rental and other real property are not excluded. Prop 13 caps later growth at 2% a year on the factored base-year value.</p>
{srclinks(['S09','S10','S11'])}
</section>"""
page("tax-law.html", "Tax & law", body, lead="Verified rules with official sources; blank rows are unverified and flagged.")

# ----------------------------------------------------------------- Projections
def proj_table(rows, cols):
    head = ["Year"] + [c[0] for c in cols]
    out = []
    for r in rows:
        if r["year"] > PROJ["display_end_year"]: break
        out.append([str(r["year"])] + [money(r[c[1]]) for c in cols])
    return table(head, out, cls="proj")
colsA = [("Market value (proj.)","market_value"),("Assessed (Prop 13 path)","assessed_prop13"),("Property tax","property_tax"),("Insurance","insurance"),("Water","water"),("Electricity (net)","electricity_net"),("Maintenance","maintenance"),("Total carrying cost","total")]
colsB = [("Market value (proj.)","market_value"),("Assessed (Prop 13 path)","assessed_prop13"),("Property tax","property_tax"),("Gross rent","rent_gross"),("Vacancy","vacancy"),("Water","water"),("Electricity","electricity"),("Insurance","insurance"),("Maintenance","maintenance"),("NOI (before income tax)","noi")]
sc_rows = []
for sname in ("low", "base", "high"):
    s = PROJ["scenarios"][sname]
    for Y in ("2045", "2050"):
        c, b = s["decisions"][Y]["cupertino"], s["decisions"][Y]["sf"]
        sc_rows.append([sname, Y, money(c["market_value_at_inheritance"]), money(c["prop19_qualified_property_tax_year1"]), money(c["reassessed_property_tax_year1"]),
                        money(b["market_value_at_inheritance"]), money(b["keep_rental_reassessed_tax_year1"]), money(b["sell_value_at_horizon"])])
body = f"""<section><h2>Projection basis</h2>
<p>Projections are illustrative and use labeled assumptions (base: inflation 2.5%, home growth 2.5%, rent growth 1.6% (the SF Rent Board 2026–27 figure applied as a base rate), utility escalator 3.71% (SJW 2026 revenue increase, verified), insurance growth 4%). Low and high cases are on the decision page. Prop 13 assessed-value path uses the verified 2% cap; the 2026 base (A $550,537) is the user's figure.</p>
{srclinks(['S09','S10','S11','S14','S17','S19'])}
<p class="small">Property tax = assessed value × effective rate from the user's 2025 bill ({pct(A_eff,3)} for A; {pct(B_eff,3)} for B). Rates are unverified (<a href="flagged.html#F-03">F-03</a>).</p></section>
<section><h2>Scenario summary (inheritance year 2045 and 2050)</h2>
{table(["Scenario","Inheritance","A market value","A tax if child moves in (yr 1)","A tax if reassessed (yr 1)","B market value","B tax, reassessed (yr 1)","B sell value at +10 yrs"], sc_rows)}
</section>
<section><h2>Property A · Cupertino — annual projection, base case (2026–2050)</h2>
<p class="small">Pre-inheritance years follow the Prop 13 path. Source for each column basis: Prop 13 cap (BOE), user inputs (flagged), labeled assumptions.</p>
{proj_table(BASE["cupertino_annual"], colsA)}
</section>
<section><h2>Property B · San Francisco — annual projection, base case (2026–2050)</h2>
<p class="small">Rent starts from the user's $7,150/mo total (two units). NOI is before income tax, depreciation, and capital items.</p>
{proj_table(BASE["sf_annual"], colsB)}
</section>"""
page("projections.html", "Projections", body, lead="Year-by-year values, property taxes, assessed values and carrying costs, 2026–2050, with assumptions stated.")

# ----------------------------------------------------------------- Inheritance steps & estate tax
steps = [
 ["1", "Confirm the trust terms and who holds title after death (trustee, beneficiaries).", "Estate-planning counsel; trust document.", srclinks([]), flaglink("F-24")],
 ["2", "Obtain a date-of-death fair-market-value appraisal for each property; keep it for basis.", "Basis of inherited property equals FMV at death (IRS, CRS).", srclinks(["S06","S20"]), flaglink("F-06")],
 ["3", "Estimate the federal estate. A return is generally required when the gross estate exceeds the basic exclusion ($15M in 2026).", "Form 706 instructions and filing threshold (IRS).", srclinks(["S01","S02"]), ""],
 ["4", "If property passes to a surviving citizen spouse, the marital deduction applies (unused exemption passes to the spouse).", "CRS summary.", srclinks(["S20"]), ""],
 ["5", "Change in ownership: the inheritance triggers reassessment to market unless an exclusion applies.", "BOE information sheet (Prop 13; inheritance = change in ownership).", srclinks(["S11"]), ""],
 ["6", "Property A: if a child makes it a principal residence within 1 year, the Prop 19 cap applies (child files for the exclusion; forms per BOE).", "BOE Prop 19 page.", srclinks(["S09","S10"]), flaglink("F-09")],
 ["7", "Within 1 year, file for the Homeowners' Exemption if the property is the principal residence ($7,000 assessed-value reduction).", "BOE LTA 2025/023.", srclinks(["S11"]), ""],
 ["8", "Within 3 years (or before a third-party transfer), file the Prop 19 claim with the county assessor.", "BOE Prop 19 page.", srclinks(["S09"]), ""],
 ["9", "Property B: units rented to tenants are reassessed to market; a qualifying principal-residence unit may be treated differently (not confirmed).", "SF Assessor Prop 19 page.", srclinks(["S12"]), flaglink("F-17")],
 ["10", "Rent-controlled tenancies continue; allowable increases follow the SF Rent Board schedule (1.6% for 3/1/2026–2/28/2027).", "SF Rent Board.", srclinks(["S14"]), flaglink("F-17")],
 ["11", "Re-insure both properties in the trust's or heir's name; compare quotes (CDI).", "CDI consumer guidance.", srclinks(["S24"]), flaglink("F-07")],
 ["12", "Move utility and water accounts; confirm the parcel's water provider and SF water/sewer account.", "City of Cupertino; SFPUC.", srclinks(["S16","S15"]), flaglink("F-05")],
 ["13", "Income tax: rental income is taxed; NIIT may apply above thresholds; a sale is measured against the stepped-up basis.", "IRS NIIT page; IRS Topic 703; Pub 527 for depreciation.", srclinks(["S04","S05","S06"]), ""],
 ["14", "California: no inheritance or estate tax on these assets (research basis). Keep records for state income tax on rent or gain.", "FTB rate schedule (income); CA tax position flagged.", srclinks(["S22"]), flaglink("F-11")],
 ["15", "If any heir is tax resident outside the US, check that country's inheritance rules.", "Not researched on this site.", srclinks(["S01"]), flaglink("F-12")],
]
est_rows = []
for r in BASE["estate_tax_projection"]:
    est_rows.append([money(r["estate_value_2026"]), money(r["tax_if_death_2026_nominal_estate_same"]), money(r["tax_if_death_2040_nominal_estate_same"]),
                     money(r["tax_if_death_2045_nominal_estate_same"]), money(r["tax_if_death_2050_nominal_estate_same"]), money(r["exemption_2045"]) ])
body = f"""<section><h2>Step-by-step inheritance process</h2>
<p>Each step cites the official source it relies on. Blank or flagged steps need confirmation before acting.</p>
{table(["Step","What to do","Basis","Official source","Flag"], steps)}</section>
<section><h2>Federal estate-tax exposure</h2>
<p>Estimated real estate in this study: {money(4900000)} (user values). Headroom under the 2026 exclusion ({money(15000000)}): {money(10100000)} before debts, expenses, and any prior taxable gifts. Basic exclusion for 2026 is verified (IRS). Its inflation indexing after 2026 is confirmed in principle by CRS; the projected amounts below assume 2.5% a year (labeled).</p>
{table(["Estate value (held nominal)","Tax if death 2026","Tax if death 2040 (proj.)","Tax if death 2045 (proj.)","Tax if death 2050 (proj.)","Exclusion 2045 (proj.)"], est_rows)}
<p class="small">Tax = 40% × (estate − exclusion), before deductions and gifts. Model: <code>model/projections.py</code>.</p>
{srclinks(['S01','S02','S20'])}</section>"""
page("inheritance.html", "Inheritance steps", body, lead="The steps from inheritance to sale or keep, with the official basis for each. Projections of federal exposure are assumptions.")

# ----------------------------------------------------------------- Decision
def dec_rows(sname, Y):
    s = PROJ["scenarios"][sname]
    c, b = s["decisions"][str(Y)]["cupertino"], s["decisions"][str(Y)]["sf"]
    return [sname, str(Y), money(c["market_value_at_inheritance"]), money(c["sell_value_at_horizon"]), money(c["live_wealth_at_horizon_before_avoided_rent"]),
            money(c["breakeven_avoided_rent_monthly_if_live_yr1"]), money(c["breakeven_net_rent_monthly_if_rented_yr1"]),
            money(b["sell_value_at_horizon"]), money(b["keep_rental_wealth_at_horizon"]), money(b["keep_rental_noi_year1_before_tax"])]
dec_tbl = []
for Y in (2040, 2045, 2050):
    dec_tbl.append(dec_rows("base", Y))
sens = []
for sname in ("low", "base", "high"):
    dec_tbl_s = dec_rows(sname, 2045)
    sens.append(dec_tbl_s)
body = f"""<section><h2>Method</h2>
<p>Each option is compared over 10 years after inheritance, in nominal after-tax dollars. <strong>Sell:</strong> sell at market value less 5% cost, no tax on gain (basis steps up to value at death), invest at an after-tax return. <strong>Live (child qualifies under Prop 19):</strong> pay the reassessed-but-capped tax, insurance, water, net electricity, and maintenance, and forgo investment income on the equity; sell at year 10 with capital-gains tax. <strong>Rent / no move-in:</strong> full reassessment. <strong>B keep:</strong> rental NOI after tax (35% assumed marginal rate, 27.5-year depreciation on 80% building share) and sale at year 10 with recapture. Break-even rent shows what avoided or earned rent would be needed to match selling; it is not a claim about the market.</p>
{srclinks(['S03','S04','S05','S06','S09','S10'])}</section>
<section><h2>Base case by inheritance year</h2>
{table(["Scenario","Inheritance","A value at inheritance","A: sell → value at +10 yrs","A: live → value at +10 yrs (before avoided rent)","A: break-even avoided rent / mo (live)","A: break-even net rent / mo (rent out)","B: sell → value at +10 yrs","B: keep rental → value at +10 yrs","B: NOI year 1 (before tax)"], dec_tbl)}
</section>
<section><h2>Sensitivity (inheritance 2045): low / base / high</h2>
{table(["Scenario","Inheritance","A value at inheritance","A: sell","A: live","A break-even avoided rent / mo","A break-even net rent / mo","B sell","B keep","B NOI yr1"], sens)}
<p class="small">Sell beats keep and live in every scenario here. The result depends on the investment return assumption (4–8%) and the 5% sale cost. Break-even rents are thresholds, and the market rents needed to test them were not supplied (<a href="flagged.html#F-22">F-22</a>).</p></section>
<section class="plan"><h2>Recommendation and reasons</h2>
<ol>
<li><strong>Sell both, soon after inheritance, unless the heir will live in Property A.</strong> The sale step-up means little or no gain at sale; holding adds annual carrying costs and a reassessment tax step, while the sale value is set at inheritance.</li>
<li><strong>Property B is the clearest sell.</strong> Its 2.135% effective rate (user bill) on a reassessed market value makes the first-year tax about {money(dB['keep_rental_reassessed_tax_year1'])} (2045 base), and NOI before tax is thin. Keeping it is worth less after 10 years in every scenario.</li>
<li><strong>Property A is a sell unless it is lived in.</strong> Living there requires a break-even avoided rent of roughly {money(dA['breakeven_avoided_rent_monthly_if_live_yr1'])}/mo in the 2045 base case. No market rent was supplied; the comparison is a threshold, not a verdict.</li>
<li><strong>If the heir does live in Property A,</strong> the Prop 19 cap limits the tax step to about {money(dA['prop19_qualified_property_tax_year1'])} in year 1 (2045 base), versus about {money(dA['reassessed_property_tax_year1'])} without it. The child must move in within one year.</li>
</ol>
<p class="small">Caveats: market values, water/electric/insurance costs, the solar credit, and every rate on the projection and decision inputs are unverified (see <a href="flagged.html">Flagged for Review</a>). Nothing here is tax or legal advice.</p></section>"""
page("decision.html", "Decision & plan", body, lead="Live, rent, or sell-and-reinvest after taxes, with break-even tests and a sensitivity check.")

# ----------------------------------------------------------------- Flagged
frows = []
for f in FLAGS.values():
    links = srclinks(f["links"]) if f["links"] else "—"
    frows.append([f'<span id="{e(f["id"])}"><strong>{e(f["id"])}</strong></span>', e(f["topic"]), e(f["issue"]), e(f["impact"]), e(f["check"]), links])
body = f"""<section><h2>Flagged for Review</h2>
<p>Each item lists what is unverified, its impact, and where to check it (official source links). Flags do not block the merge.</p>
{table(["ID","Topic","Issue","Impact","How to check","Official link"], frows)}
</section>"""
page("flagged.html", "Flagged for Review", body, lead="Unverified values, data irregularities, and assumptions. Each has an official source for checking.")

# ----------------------------------------------------------------- Sources
srows = []
for s in SRC.values():
    srows.append([e(s["id"]), f'<a href="{e(s["url"])}" target="_blank" rel="noopener">{e(s["title"])}</a>', e(s["publisher"]),
                  '<span class="badge ok">OFFICIAL</span>' if s["official"] else '<span class="badge warn">SECONDARY</span>', e(s.get("access", ""))])
body = f"""<section><h2>Source register</h2>
<p>Official = government agency, tariff filing or regulator. Secondary = context only, never used as verification. "Access" shows how each source was checked.</p>
{table(["ID","Title","Publisher","Type","Access"], srows)}</section>"""
page("sources.html", "Sources", body)

# ----------------------------------------------------------------- assets
(SITE / "assets").mkdir(parents=True, exist_ok=True)
(SITE / "assets" / "study.css").write_text("""
:root{--ink:#1b2430;--muted:#5a6572;--line:#d9dee5;--bg:#f7f8fa;--ok:#1b7f3b;--warn:#b35c00;--user:#3459a6;--accent:#0b5cad}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:var(--ink);background:#fff}
header{background:#14253a;color:#fff;padding:12px 20px}.brand{font-weight:700}.brand span{font-weight:400;opacity:.7;margin-left:8px;font-size:13px}
nav{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:8px}nav a{color:#cfe1f7;text-decoration:none;font-size:14px}nav a.active,nav a:hover{color:#fff;text-decoration:underline}
main{max-width:1200px;margin:0 auto;padding:20px}h1{margin:.2em 0}h2{margin-top:1.8em;border-bottom:1px solid var(--line);padding-bottom:4px}
.lead{color:var(--muted);font-size:16px}.disclaimer{background:var(--bg);border-left:4px solid var(--user);padding:8px 12px;font-size:13px;color:var(--muted)}
footer{max-width:1200px;margin:24px auto;padding:12px 20px;color:var(--muted);font-size:12px;border-top:1px solid var(--line)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin:14px 0}
.card{display:block;border:1px solid var(--line);border-radius:8px;padding:12px;color:var(--ink);text-decoration:none;background:#fff}
.card:hover{border-color:var(--accent);box-shadow:0 1px 4px rgba(0,0,0,.08)}.card .k{font-size:12px;color:var(--muted)}.card .v{font-size:18px;font-weight:600;margin:4px 0}.card .tag{font-size:12px;color:var(--muted)}
.tablewrap{overflow-x:auto;margin:10px 0}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{background:var(--bg);position:sticky;top:0}table.proj td{text-align:right}table.proj td:first-child{text-align:left}
.badge{display:inline-block;font-size:11px;font-weight:700;padding:1px 6px;border-radius:4px;background:#e6ecf5;color:var(--user);white-space:nowrap}
.badge.ok{background:#e3f3e8;color:var(--ok)}.badge.warn{background:#fdeedc;color:var(--warn)}.badge.user{background:#e6ecf5;color:var(--user)}
.flag{background:#fdeedc;color:var(--warn);padding:0 4px;border-radius:3px;text-decoration:none;font-weight:600}
.warn{color:var(--warn)}.small{font-size:13px;color:var(--muted)}section.plan{background:var(--bg);border-radius:8px;padding:12px 18px}
input.filter{margin:6px 0;padding:6px;width:280px;border:1px solid var(--line);border-radius:4px}
""", encoding="utf-8")
(SITE / "assets" / "study.js").write_text("""
document.querySelectorAll('table[data-filter]').forEach(function(t){
  var box=document.createElement('input');box.className='filter';box.placeholder='Filter rows…';
  t.parentElement.insertBefore(box,t);
  box.addEventListener('input',function(){var q=box.value.toLowerCase();
    t.querySelectorAll('tbody tr').forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?'':'none';});});
});
""", encoding="utf-8")
(SITE / ".nojekyll").write_text("")
print("built", len(list(SITE.glob("*.html"))), "pages")
