#!/usr/bin/env python3
"""
model.py — Financial projection model for Cupertino/SF inheritance decision analysis.
Session: arena-6099c2f2 (branch arena/6099c2f2-cupertino1)

All inputs are tagged with a status:
  verified   = confirmed against an official source (URL in SRC)
  user       = user-provided figure (cannot be confirmed externally; flagged)
  assumption = model assumption (flagged; sensitivity provided)

Outputs: build/model.json  (consumed by scripts/build_site.py)
Run:      python3 scripts/model.py
"""
import json, os, math

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "build")
os.makedirs(OUT_DIR, exist_ok=True)

# ----------------------------------------------------------------------------------
# SOURCE URLS (official)
# ----------------------------------------------------------------------------------
SRC = {
    "prop13_county": "https://files.santaclaracounty.gov/exjcpb1531/2025-11/tax-rate-book-2025-2026.pdf",
    "prop19_boe": "https://www.boe.ca.gov/prop19/",
    "prop19_pub": "https://www.boe.ca.gov/pdf/pub800-1.pdf",
    "sf_rate": "https://sftreasurer.org/property/secured-property-taxes",
    "tra_lookup": "https://plandev.santaclaracounty.gov/how-do-i/research-property/find-jurisdiction",
    "irs_estate": "https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax",
    "irs_whatsnew": "https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax",
    "irs_rp2532": "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf",
    "irs_706_when": "https://www.irs.gov/businesses/small-businesses-self-employed/filing-estate-and-gift-tax-returns",
    "irs_706_inst": "https://www.irs.gov/instructions/i706",
    "irs_551": "https://www.irs.gov/publications/p551",
    "irs_salt": "https://www.irs.gov/taxtopics/tc503",
    "irs_p530": "https://www.irs.gov/publications/p530",
    "ftb_capgains": "https://www.ftb.ca.gov/file/personal/income-types/capital-gains-and-losses.html",
    "ftb_estate": "https://www.ftb.ca.gov/tax-pros/law/legislation/2017-2018/sb726-032317.pdf",
    "sfrb": "https://sfrb.org/",
    "sfrb_ab1482": "https://sfrb.org/article/summary-ab-1482-california-tenant-protection-act-2019",
    "civ_1946_2": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1946.2",
    "prob_10810": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PROB&sectionNum=10810.",
    "prob_160617": "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PROB&sectionNum=16061.7",
    "courts_probate": "https://selfhelp.courts.ca.gov/probate/formal-probate",
    "courts_close": "https://www.alameda.courts.ca.gov/divisions/probate/property-transfers/closing-and-distributing-estate",
    "bls_cpi": "https://www.bls.gov/news.release/cpi.nr0.htm",
    "fhfa": "https://www.fhfa.gov/news/news-release/u.s.-house-prices-rise-2.1-percent-year-over-year-up-0.3-percent-quarter-over-quarter",
    "treasury": "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=202611",
    "cdi_mktshare": "https://www.insurance.ca.gov/01-consumers/120-company/04-mrktshare/2025/",
    "cdi_eq": "https://www.insurance.ca.gov/0400-news/0200-studies-reports/0300-earthquake-study/upload/EQEXP2024Summary.pdf",
    "cdi_statefarm": "https://www.insurance.ca.gov/0400-news/0100-press-releases/2025/release026-2025.cfm",
    "cdi_2026": "https://www.insurance.ca.gov/0400-news/0102-alerts/2026/Momentum-continues-to-build-under-Insura.cfm",
    "cpuc_nem": "https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/demand-side-management/net-energy-metering",
    "cpuc_d22": "https://docs.cpuc.ca.gov/PublishedDocs/Published/G000/M500/K043/500043682.PDF",
    "sos_results": "https://electionresults.sos.ca.gov/returns/ballot-measures",
    "sos_qual": "https://www.sos.ca.gov/elections/ballot-measures/qualified-ballot-measures",
    "sos_prop3": "https://voterguide.sos.ca.gov/propositions/3",
    "hud_fmr": "https://www.huduser.gov/portal/datasets/fmr.html",
    "fdic_gsg": "https://www.fdic.gov/regulations/laws/federal/2011/11c224ad74.pdf",
    "irs_409": "https://www.irs.gov/taxtopics/tc409",
    "boe_faq": "https://www.boe.ca.gov/proptaxes/faqs/changeinownership.htm",
    "scc_assessor": "https://assessor.santaclaracounty.gov/",
    "sf_assessor": "https://www.sf.gov/departments--assessor-recorder",
}

# ----------------------------------------------------------------------------------
# ASSUMPTIONS / INPUTS
# ----------------------------------------------------------------------------------
A = {
    # --- user-provided property data (flagged) ---
    "cup_value_2026": 3_100_000,        # user estimate Nov 2026
    "cup_av_2026": 550_537,             # user-provided 2026 assessment
    "cup_av_2025": 539_743,             # user-provided
    "cup_tax_2025": 7_207,              # user-provided
    "cup_tax_2024": 7_003,              # user-provided
    "sf_value_2026": 1_800_000,         # user estimate Nov 2026
    "sf_av_2025": 114_248,              # user-provided
    "sf_tax_2025": 2_439,               # user-provided
    "sf_income_mo_2026": 7_150,         # user-provided actual (2 units)
    # --- verified rates ---
    "sf_rate": 0.0118162182,            # FY2026-27 official (sftreasurer)
    "sf_rate_2526": 0.0118268325,       # FY2025-26 official
    # --- model assumptions (flagged) ---
    "cup_tra_rate": 0.0120,             # within observed official SC County TRA totals 1.14200%-1.24090%
    "cup_direct": 650.0,                # flat direct-charge allowance (unverified reconciliation)
    "sf_direct": 1_089.0,               # flat direct-charge allowance (unverified reconciliation)
    "av_growth": 0.02,                  # Prop 13 cap (verified law)
    "value_growth": 0.03,               # base case home appreciation (sens 1%, 5%)
    "ins_growth": 0.065,                # insurance premium trend (context: CA DOI ~6.9% filings 2026)
    "util_growth": 0.025,               # water/electric/flat charges
    "cup_water_yr": 125 * 12,           # user: $100-150/mo -> $125 mid
    "cup_elec_credit_yr": 15 * 12,      # user: +$10-20/mo solar credit -> $15 mid
    "sf_water_yr": 365 * 12,            # user: $330-400/mo -> $365 mid
    "sf_elec_yr": 50 * 12,              # user: $30-70/mo -> $50 mid
    "cup_ins_2026": 1_500,              # user estimate (flag; CA avg $1,967.59 DOI 2024)
    "sf_landlord_ins_2026": 2_200,      # assumption (landlord policy; user est $1,500 unverified)
    "cup_maint_pct": 0.0075,            # % of market value/yr (sens 0.5%, 1.0%)
    "sf_maint_pct": 0.01,               # % of market value/yr
    "cup_rent_mo_2026": 5_500,          # assumption, no official source retrievable -> flagged
    "sf_unit3_rent_mo_2026": 3_575,     # assumption = half of user's $7,150 (2 units)
    "rent_growth_market": 0.03,         # market rent growth
    "rent_growth_sf_controlled": 0.02,  # between SF Rent Board cap (~1.6%) and market
    "mgmt_pct": 0.08,                   # property management (Cupertino rental scenario)
    "vacancy_pct": 0.05,                # vacancy/credit loss (Cupertino rental scenario)
    "sell_costs_pct": 0.055,            # selling costs (agent + closing)
    "portfolio_return": 0.06,           # nominal pre-tax portfolio return (sens 4%, 8%)
    "portfolio_after_tax": 0.055,       # after tax on income portion (flag)
    "rental_income_tax": 0.30,          # blended fed+CA on positive net rental income (flag)
    "discount_rate": 0.04,              # NPV discount rate
    "estate_exemption_2026": 15_000_000,
    "estate_index_growth": 0.025,       # post-2026 CPI indexing assumption (OBBBA permanent)
    "base_inherit_year": 2045,          # midpoint of user's 2040-2050 window
    "horizon": 10,                      # years of post-inheritance comparison
    "start_year": 2026,
    "proj_end_year": 2050,
}

def fv(amount, rate, years):
    return amount * ((1 + rate) ** years)

# ----------------------------------------------------------------------------------
# 1. PRE-INHERITANCE PROJECTIONS (2026-2050): Cupertino, SF, estate exemption
# ----------------------------------------------------------------------------------
def build_projections():
    rows_cup, rows_sf, rows_estate = [], [], []
    sf_av_2026 = round(A["sf_av_2025"] * (1 + A["av_growth"]))  # 116,533
    for y in range(A["start_year"], A["proj_end_year"] + 1):
        t = y - A["start_year"]
        # Cupertino
        v_lo = fv(A["cup_value_2026"], 0.01, t)
        v_base = fv(A["cup_value_2026"], A["value_growth"], t)
        v_hi = fv(A["cup_value_2026"], 0.05, t)
        av = fv(A["cup_av_2026"], A["av_growth"], t)
        tax = av * A["cup_tra_rate"] + A["cup_direct"] * ((1 + A["util_growth"]) ** t)
        rows_cup.append({
            "year": y, "value_lo": round(v_lo), "value_base": round(v_base), "value_hi": round(v_hi),
            "av": round(av), "tax": round(tax),
        })
        # SF
        sf_av = fv(sf_av_2026, A["av_growth"], t)
        sf_v = fv(A["sf_value_2026"], A["value_growth"], t)
        sf_tax = sf_av * A["sf_rate"] + A["sf_direct"] * ((1 + A["util_growth"]) ** t)
        rows_sf.append({"year": y, "value": round(sf_v), "av": round(sf_av), "tax": round(sf_tax)})
        # Federal estate exemption (projected)
        ex = fv(A["estate_exemption_2026"], A["estate_index_growth"], t)
        rows_estate.append({"year": y, "exemption": round(ex, -3)})
    return rows_cup, rows_sf, rows_estate

# ----------------------------------------------------------------------------------
# 2. SCENARIO ENGINE (inheritance in 2045, horizon 10 yrs -> 2055)
# ----------------------------------------------------------------------------------
def build_scenarios(value_growth=None, portfolio_return=None, cup_rent_mo=None,
                    cup_maint_pct=None, inherit_year=None, label="base"):
    g_v = A["value_growth"] if value_growth is None else value_growth
    g_p = A["portfolio_return"] if portfolio_return is None else portfolio_return
    g_pat = g_p - 0.005  # after-tax haircut (flagged in assumptions)
    rent_mo = A["cup_rent_mo_2026"] if cup_rent_mo is None else cup_rent_mo
    maint_pct = A["cup_maint_pct"] if cup_maint_pct is None else cup_maint_pct
    y0 = A["base_inherit_year"] if inherit_year is None else inherit_year
    H = A["horizon"]
    t_inh = y0 - A["start_year"]  # years from 2026 to inheritance

    cup_value = fv(A["cup_value_2026"], g_v, t_inh)
    cup_av_preserved = fv(A["cup_av_2026"], A["av_growth"], t_inh)
    sf_value = fv(A["sf_value_2026"], g_v, t_inh)
    sf_av = fv(round(A["sf_av_2025"] * (1 + A["av_growth"])), A["av_growth"], t_inh)

    cup_rent_yr = rent_mo * 12 * ((1 + A["rent_growth_market"]) ** t_inh)
    sf_unit3_yr = A["sf_unit3_rent_mo_2026"] * 12 * ((1 + A["rent_growth_market"]) ** t_inh)
    sf_income_yr = A["sf_income_mo_2026"] * 12 * ((1 + A["rent_growth_sf_controlled"]) ** t_inh)

    ins_cup = fv(A["cup_ins_2026"], A["ins_growth"], t_inh)
    ins_sf = fv(A["sf_landlord_ins_2026"], A["ins_growth"], t_inh)
    water_cup = fv(A["cup_water_yr"], A["util_growth"], t_inh)
    water_sf = fv(A["sf_water_yr"], A["util_growth"], t_inh)
    elec_sf = fv(A["sf_elec_yr"], A["util_growth"], t_inh)
    elec_credit_cup = fv(A["cup_elec_credit_yr"], A["util_growth"], t_inh)
    cup_direct = fv(A["cup_direct"], A["util_growth"], t_inh)
    sf_direct = fv(A["sf_direct"], A["util_growth"], t_inh)

    results = {"meta": {"inherit_year": y0, "horizon": H, "end_year": y0 + H,
                        "value_growth": g_v, "portfolio_return": g_p,
                        "cup_rent_mo_2045": round(cup_rent_yr / 12), "label": label},
               "start": {"cup_value": round(cup_value), "cup_av_preserved": round(cup_av_preserved),
                         "sf_value": round(sf_value), "sf_av": round(sf_av)}}

    def option_A():
        """Live in Cupertino house (Prop 19 base preserved); rent all 3 SF units."""
        rows, port = [], 0.0
        cv, sv = cup_value, sf_value
        capA = cup_av_preserved            # preserved assessed value, grows 2%/yr
        sav = sf_av
        s3, si = sf_unit3_yr, sf_income_yr
        ic, iw, icd = ins_cup, water_cup, cup_direct
        isc, iw2, ie2, ecr = ins_sf, water_sf, elec_sf, elec_credit_cup
        for i in range(H):
            year = y0 + i
            cup_tax = capA * A["cup_tra_rate"] + icd
            cup_cost = cup_tax + ic + iw - ecr + maint_pct * cv
            sf_income = si + s3
            sf_tax = sav * A["sf_rate"] + sf_direct_yr(sf_direct, i)
            sf_cost = sf_tax + isc + iw2 + ie2 + A["sf_maint_pct"] * sv
            sf_gross_net = sf_income - sf_cost
            sf_net = sf_gross_net - max(0.0, sf_gross_net) * A["rental_income_tax"]
            net_cash = sf_net - cup_cost
            port = (port + net_cash) * (1 + g_pat)
            rows.append({"year": year, "cup_cost": round(cup_cost), "sf_income": round(sf_income),
                         "sf_cost": round(sf_cost), "net_cash": round(net_cash),
                         "portfolio": round(port), "cup_equity": round(cv), "sf_equity": round(sv)})
            cv *= (1 + g_v); sv *= (1 + g_v)
            capA *= (1 + A["av_growth"]); sav *= (1 + A["av_growth"])
            ic *= (1 + A["ins_growth"]); iw *= (1 + A["util_growth"]); icd *= (1 + A["util_growth"])
            ecr *= (1 + A["util_growth"])
            isc *= (1 + A["ins_growth"]); iw2 *= (1 + A["util_growth"]); ie2 *= (1 + A["util_growth"])
            si *= (1 + A["rent_growth_sf_controlled"]); s3 *= (1 + A["rent_growth_market"])
        return rows, port

    def option_B():
        """Rent Cupertino (reassessed to market value); continue living in SF unit 1."""
        rows, port = [], 0.0
        cv, sv = cup_value, sf_value
        capB = cup_value                   # reassessed base = FMV at death, then +2%/yr cap
        sav = sf_av
        cr, si = cup_rent_yr, sf_income_yr
        ic, iw, icd = ins_sf, water_cup, cup_direct
        isc, iw2, ie2, ecr = ins_sf, water_sf, elec_sf, elec_credit_cup
        for i in range(H):
            year = y0 + i
            gross = cr
            egi = gross * (1 - A["vacancy_pct"])
            mgmt = gross * A["mgmt_pct"]
            cup_tax = capB * A["cup_tra_rate"] + icd
            cup_opex = cup_tax + ic + iw - ecr + maint_pct * cv
            noi = egi - mgmt - cup_opex
            cup_net = noi - max(0.0, noi) * A["rental_income_tax"]
            sf_tax = sav * A["sf_rate"] + sf_direct_yr(sf_direct, i)
            sf_cost = sf_tax + isc + iw2 + ie2 + A["sf_maint_pct"] * sv
            sf_gross_net = si - sf_cost
            sf_net = sf_gross_net - max(0.0, sf_gross_net) * A["rental_income_tax"]
            net_cash = sf_net + cup_net
            port = (port + net_cash) * (1 + g_pat)
            rows.append({"year": year, "cup_rent_net": round(egi - mgmt),
                         "cup_opex": round(cup_opex), "cup_net": round(cup_net),
                         "sf_income": round(si), "sf_cost": round(sf_cost),
                         "net_cash": round(net_cash), "portfolio": round(port),
                         "cup_equity": round(cv), "sf_equity": round(sv)})
            cv *= (1 + g_v); sv *= (1 + g_v)
            capB *= (1 + A["av_growth"]); sav *= (1 + A["av_growth"])
            ic *= (1 + A["ins_growth"]); iw *= (1 + A["util_growth"]); icd *= (1 + A["util_growth"])
            ecr *= (1 + A["util_growth"])
            isc *= (1 + A["ins_growth"]); iw2 *= (1 + A["util_growth"]); ie2 *= (1 + A["util_growth"])
            si *= (1 + A["rent_growth_sf_controlled"]); cr *= (1 + A["rent_growth_market"])
        return rows, port

    def option_C():
        rows, port = [], 0.0
        proceeds = cup_value * (1 - A["sell_costs_pct"])
        port = proceeds
        sv = sf_value
        sav, si, isc, iw2, ie2 = sf_av, sf_income_yr, ins_sf, water_sf, elec_sf
        for i in range(H):
            year = y0 + i
            sf_tax = sav * A["sf_rate"] + sf_direct_yr(sf_direct, i)
            sf_cost = sf_tax + isc + iw2 + ie2 + A["sf_maint_pct"] * sv
            sf_net = si - sf_cost - max(0.0, si - sf_cost) * A["rental_income_tax"]
            net_cash = sf_net
            port = (port + net_cash) * (1 + g_pat)
            rows.append({"year": year, "proceeds": round(proceeds) if i == 0 else "",
                         "sf_income": round(si), "sf_cost": round(sf_cost),
                         "net_cash": round(net_cash), "portfolio": round(port),
                         "cup_equity": 0, "sf_equity": round(sv)})
            sv *= (1 + g_v)
            isc *= (1 + A["ins_growth"]); iw2 *= (1 + A["util_growth"]); ie2 *= (1 + A["util_growth"])
            si *= (1 + A["rent_growth_sf_controlled"])
            sav = sf_av * ((1 + A["av_growth"]) ** (i + 1))
        return rows, port, proceeds

    def sf_direct_yr(base, i):
        return base * ((1 + A["util_growth"]) ** i)

    rowsA, portA = option_A()
    rowsB, portB = option_B()
    rowsC, portC, proceeds = option_C()

    cup_end_A = fv(cup_value, g_v, H)
    cup_end_B = fv(cup_value, g_v, H)
    sf_end = fv(sf_value, g_v, H)

    def npv(cash_rows, terminal):
        s = 0.0
        for i, r in enumerate(cash_rows):
            s += r["net_cash"] / ((1 + A["discount_rate"]) ** (i + 1))
        s += terminal / ((1 + A["discount_rate"]) ** H)
        return s

    nwA = portA + cup_end_A + sf_end
    nwB = portB + cup_end_B + sf_end
    nwC = portC + 0 + sf_end
    results["options"] = {
        "A": {"name": "Live in Cupertino house", "rows": rowsA, "portfolio_end": round(portA),
              "cup_equity_end": round(cup_end_A), "sf_equity_end": round(sf_end),
              "net_worth_end": round(nwA),
              "npv": round(npv(rowsA, portA + cup_end_A + sf_end))},
        "B": {"name": "Rent Cupertino house (reassessed)", "rows": rowsB, "portfolio_end": round(portB),
              "cup_equity_end": round(cup_end_B), "sf_equity_end": round(sf_end),
              "net_worth_end": round(nwB),
              "npv": round(npv(rowsB, portB + cup_end_B + sf_end))},
        "C": {"name": "Sell Cupertino house, reinvest", "rows": rowsC, "portfolio_end": round(portC),
              "cup_equity_end": 0, "sf_equity_end": round(sf_end),
              "net_worth_end": round(nwC), "sale_proceeds": round(proceeds),
              "npv": round(npv(rowsC, portC + sf_end))},
    }
    # imputed rent (consumption, not profit): A lives in Cupertino, B/C live in SF unit1
    results["imputed"] = {
        "A_mo": round(cup_rent_yr / 12), "B_mo": round(cup_rent_yr / 12),
        "C_mo": round(sf_unit3_yr / 12),
        "note": "Housing consumed: A/B occupy Cupertino (market rent shown); C occupies SF unit 1 (market rent of a SF unit shown)."
    }
    return results

# ----------------------------------------------------------------------------------
# 3. SENSITIVITY GRID
# ----------------------------------------------------------------------------------
def sensitivity():
    grid = []
    for vg in (0.01, 0.03, 0.05):
        for pr in (0.04, 0.06, 0.08):
            r = build_scenarios(value_growth=vg, portfolio_return=pr, label=f"vg{vg}_pr{pr}")
            o = r["options"]
            best = max(o, key=lambda k: o[k]["net_worth_end"])
            grid.append({"value_growth": vg, "portfolio_return": pr,
                         "A": o["A"]["net_worth_end"], "B": o["B"]["net_worth_end"],
                         "C": o["C"]["net_worth_end"], "best": best})
    return grid

# ----------------------------------------------------------------------------------
# 4. ESTATE TAX THRESHOLD TABLE (2026 rules) + projected exemption
# ----------------------------------------------------------------------------------
def estate_tax_table():
    rows = []
    for size in (10e6, 15e6, 16e6, 18e6, 20e6, 25e6, 30e6, 40e6, 50e6):
        single_tax = max(0.0, size - A["estate_exemption_2026"]) * 0.40
        couple_tax = max(0.0, size - 2 * A["estate_exemption_2026"]) * 0.40
        rows.append({"estate": int(size), "tax_single": int(single_tax), "tax_couple": int(couple_tax)})
    return rows

def estate_projection_table():
    rows = []
    for y in range(2026, 2051, 2):
        t = y - 2026
        ex = fv(A["estate_exemption_2026"], A["estate_index_growth"], t)
        rows.append({"year": y, "exemption_single": round(ex, -3),
                     "exemption_couple": round(2 * ex, -3),
                     "taxable_at_40pct_single": round(ex, -3)})
    return rows

# ----------------------------------------------------------------------------------
def main():
    cup, sf, estate = build_projections()
    base = build_scenarios()
    sens = sensitivity()
    model = {
        "assumptions": A,
        "sources": SRC,
        "proj_cupertino": cup,
        "proj_sf": sf,
        "proj_estate_exemption": estate,
        "scenarios_base": base,
        "sensitivity": sens,
        "estate_tax_2026": estate_tax_table(),
        "estate_projection": estate_projection_table(),
    }
    path = os.path.join(OUT_DIR, "model.json")
    with open(path, "w") as f:
        json.dump(model, f, indent=1)
    # console summary
    o = base["options"]
    print("Inheritance base year:", base["meta"]["inherit_year"])
    print("Start values:", base["start"])
    for k in ("A", "B", "C"):
        print(f"  {k} {o[k]['name']}: portfolio_end={o[k]['portfolio_end']:,}  "
              f"net_worth_end={o[k]['net_worth_end']:,}  npv={o[k]['npv']:,}")
    wins = {}
    for g in sens:
        wins[g["best"]] = wins.get(g["best"], 0) + 1
    print("Sensitivity wins (of 9):", wins)
    print("Wrote", os.path.abspath(path))

if __name__ == "__main__":
    main()
