"""Projection + decision model for Property A (Cupertino) and Property B (San Francisco).

Standard library only.  Writes data/projections.json.
All money is nominal USD.  Every assumption is listed in ASSUMPTIONS and copied into the output.
Values marked (verified) come from data/verified_facts.json or data/user_inputs.json (user, unverified).
Nothing here is tax, legal, or investment advice; projections are illustrative.
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
U = json.loads((ROOT / "data/user_inputs.json").read_text())
A, B = U["property_a"], U["property_b"]

START = 2026
END = 2065            # annual model horizon
PROJ_END = 2050       # displayed projection table ends here
DEC_HORIZON = 10      # years after inheritance used for decision comparison
INHERIT_YEARS = [2040, 2045, 2050]
BASE_INHERIT = 2045

# ---- scenario parameters (base / low / high) ----------------------------------------------
SCEN = {
    "base": {"inflation": 0.025, "home_growth": 0.025, "invest_return": 0.060, "rent_growth": 0.016, "utility_growth": 0.0371, "insurance_growth": 0.04},
    "low":  {"inflation": 0.020, "home_growth": 0.010, "invest_return": 0.040, "rent_growth": 0.010, "utility_growth": 0.025,  "insurance_growth": 0.025},
    "high": {"inflation": 0.035, "home_growth": 0.040, "invest_return": 0.080, "rent_growth": 0.025, "utility_growth": 0.050,  "insurance_growth": 0.070},
}
FIXED = {
    "prop13_cap": 0.02,                          # verified (BOE)
    "prop19_cap_amount": 1044586,                # verified (BOE LTA 2025/009); held constant (flag F-09)
    "sale_cost_pct": 0.05,                       # ASSUMPTION (not sourced)
    "invest_tax_drag": 0.15,                     # ASSUMPTION: blended tax drag on portfolio returns
    "cg_tax_rate": 0.238 + 0.123,                # verified parts: 20% LTCG + 3.8% NIIT (IRS) + 12.3% CA top bracket (FTB); MHST excluded (F-11)
    "rental_marginal_rate": 0.35,                # ASSUMPTION (illustrative combined rate; user's bracket unknown)
    "depr_building_share": 0.80,                 # ASSUMPTION (land share unknown; F-17)
    "depr_life_years": 27.5,                     # verified (IRS Pub 527)
    "recapture_rate": 0.25,                      # ASSUMPTION (unrecaptured §1250 max; not retrieved, F-06)
    "sf_vacancy": 0.05,                          # ASSUMPTION
    "cupertino_maint_pct": 0.005,                # ASSUMPTION (user says less than SF; not sourced)
    "sf_maint_pct": 0.010,                       # ASSUMPTION
    "cupertino_water_monthly": 125.0,            # user range midpoint of $100–150 (unverified)
    "cupertino_elec_net_monthly": -15.0,         # user solar credit midpoint of $10–20 (negative = credit; unverified)
    "sf_water_monthly": 365.0,                   # user range midpoint of $330–400 (unverified)
    "sf_elec_monthly": 50.0,                     # user midpoint of $30–70 (unverified)
    "insurance_annual": 1500.0,                  # user guess (unverified)
}
# user history anchors
A_ASSESSED_2026 = 550537         # user table (unverified; BOE says FBYV path, flag F-04)
A_TAX_2025 = 7207
A_ASSESSED_2025 = 539743
A_EFF = A_TAX_2025 / A_ASSESSED_2025
B_ASSESSED_2025 = 114248
B_TAX_2025 = 2439
B_EFF = B_TAX_2025 / B_ASSESSED_2025
B_ASSESSED_2026 = round(B_ASSESSED_2025 * 1.02)   # model projection (no 2026 roll supplied)
ESTATE_KNOWN = {"cupertino": A["estimated_market_value_nov_2026"], "sf": B["estimated_market_value_nov_2026"]}


def run(sc_name):
    p = {**SCEN[sc_name], **FIXED}
    infl, g, r_inv, rent_g, util_g, ins_g = p["inflation"], p["home_growth"], p["invest_return"], p["rent_growth"], p["utility_growth"], p["insurance_growth"]
    r_at = r_inv * (1 - p["invest_tax_drag"])
    years = list(range(START, END + 1))
    MV_A0, MV_B0 = A["estimated_market_value_nov_2026"], B["estimated_market_value_nov_2026"]

    def mvA(t): return MV_A0 * (1 + g) ** (t - START)
    def mvB(t): return MV_B0 * (1 + g) ** (t - START)
    def fbyvA(t): return A_ASSESSED_2026 * (1 + p["prop13_cap"]) ** (t - START)
    def costA(t, mv_t, assessed_t):
        tax = assessed_t * A_EFF
        ins = p["insurance_annual"] * (1 + ins_g) ** (t - START)
        water = p["cupertino_water_monthly"] * 12 * (1 + util_g) ** (t - START)
        elec = p["cupertino_elec_net_monthly"] * 12 * (1 + infl) ** (t - START)
        maint = p["cupertino_maint_pct"] * mv_t
        return {"property_tax": tax, "insurance": ins, "water": water, "electricity_net": elec, "maintenance": maint,
                "total": tax + ins + water + elec + maint}

    # ---- Pre-inheritance (held by owner/trust; Prop 13 path) ----
    rowsA = []
    for t in years:
        mv = mvA(t)
        assessed = fbyvA(t)                    # Prop 13 path (no change in ownership yet)
        c = costA(t, mv, assessed)
        rowsA.append({"year": t, "market_value": round(mv), "assessed_prop13": round(assessed), **{k: round(v) for k, v in c.items()}})

    rowsB = []
    for t in years:
        mv = mvB(t)
        assessed = B_ASSESSED_2026 * (1 + p["prop13_cap"]) ** (t - START)
        tax = assessed * B_EFF
        rent_g_t = 7150 * 12 * (1 + rent_g) ** (t - START)
        gross = rent_g_t
        vac = gross * p["sf_vacancy"]
        water = p["sf_water_monthly"] * 12 * (1 + util_g) ** (t - START)
        elec = p["sf_elec_monthly"] * 12 * (1 + infl) ** (t - START)
        ins = p["insurance_annual"] * (1 + ins_g) ** (t - START)
        maint = p["sf_maint_pct"] * mv
        noi = gross - vac - water - elec - ins - maint - tax
        rowsB.append({"year": t, "market_value": round(mv), "assessed_prop13": round(assessed), "property_tax": round(tax),
                      "rent_gross": round(gross), "vacancy": round(vac), "water": round(water), "electricity": round(elec),
                      "insurance": round(ins), "maintenance": round(maint), "noi": round(noi)})

    # ---- Inheritance decision scenarios ----
    def cupertino_scenarios(Y):
        H = DEC_HORIZON
        MV_Y = mvA(Y)
        net_sale_Y = MV_Y * (1 - p["sale_cost_pct"])
        # Sell at inheritance, invest proceeds
        W_sell = net_sale_Y * (1 + r_at) ** H
        out = {"inherit_year": Y, "market_value_at_inheritance": round(MV_Y), "sell_net_proceeds": round(net_sale_Y),
               "sell_value_at_horizon": round(W_sell)}
        # Live in (Prop 19 qualifying): assessed = FBYV + max(0, MV - FBYV - cap)
        fb = fbyvA(Y)
        assessed_live_Y = fb + max(0.0, MV_Y - fb - p["prop19_cap_amount"])
        # Not qualifying (rented / not moved in): reassessed at market value
        assessed_rent_Y = MV_Y
        def path(assessed_Y):
            costs = []
            for k in range(H):
                t = Y + k
                a_t = assessed_Y * (1 + p["prop13_cap"]) ** k
                costs.append(costA(t, mvA(t), a_t)["total"])
            return costs
        def terminal(Y_end_mv):
            net = Y_end_mv * (1 - p["sale_cost_pct"])
            gain = max(0.0, net - MV_Y)
            return net - p["cg_tax_rate"] * gain
        def future_value(costs, term):
            # costs at end of year k compound at r_at for remaining years
            fv_costs = sum(c * (1 + r_at) ** (H - 1 - k) for k, c in enumerate(costs))
            return term - fv_costs
        costs_live = path(assessed_live_Y)
        costs_rent = path(assessed_rent_Y)
        term = terminal(mvA(Y + H))
        W_live = future_value(costs_live, term)
        W_rent_base = future_value(costs_rent, term)
        out.update({
            "assessed_live_qualified_at_inheritance": round(assessed_live_Y),
            "prop19_qualified_property_tax_year1": round(assessed_live_Y * A_EFF),
            "reassessed_property_tax_year1": round(assessed_rent_Y * A_EFF),
            "live_qualified_year1_costs": round(costs_live[0]),
            "live_wealth_at_horizon_before_avoided_rent": round(W_live),
            "rent_reassessed_wealth_at_horizon_before_rent": round(W_rent_base),
        })
        # Break-even annual rent (or avoided rent) that makes Live or Rent equal to Sell, growing with inflation.
        annuity = sum((1 + infl) ** k * (1 + r_at) ** (H - 1 - k) for k in range(H))
        out["breakeven_avoided_rent_annual_if_live_yr1"] = round(max(0.0, (W_sell - W_live) / annuity), 0)
        out["breakeven_avoided_rent_monthly_if_live_yr1"] = round(max(0.0, (W_sell - W_live) / annuity) / 12, 0)
        # Rented out (no move-in): net rent needed (after 5% vacancy) to match Sell
        annuity_rent = annuity * (1 - p["sf_vacancy"])
        out["breakeven_net_rent_monthly_if_rented_yr1"] = round(max(0.0, (W_sell - W_rent_base) / annuity_rent) / 12, 0)
        out["sell_beats_live_without_rent"] = W_sell > W_live
        return out

    def sf_scenarios(Y):
        H = DEC_HORIZON
        MV_Y = mvB(Y)
        net_sale_Y = MV_Y * (1 - p["sale_cost_pct"])
        W_sell = net_sale_Y * (1 + r_at) ** H
        # Keep as rental: reassessed at MV at transfer (no qualifying principal-residence exclusion for rented units)
        assessed_Y = MV_Y
        dep_annual = p["depr_building_share"] * MV_Y / p["depr_life_years"]
        flows = []
        noi_y1 = 0.0
        for k in range(H):
            t = Y + k
            gross = 7150 * 12 * (1 + rent_g) ** (t - START)
            vac = gross * p["sf_vacancy"]
            water = p["sf_water_monthly"] * 12 * (1 + util_g) ** (t - START)
            elec = p["sf_elec_monthly"] * 12 * (1 + infl) ** (t - START)
            ins = p["insurance_annual"] * (1 + ins_g) ** (t - START)
            maint = p["sf_maint_pct"] * mvB(t)
            tax = assessed_Y * (1 + p["prop13_cap"]) ** k * B_EFF
            noi = gross - vac - water - elec - ins - maint - tax
            taxable = max(0.0, noi - dep_annual)
            after_tax = noi - p["rental_marginal_rate"] * taxable
            flows.append(after_tax)
            if k == 0: noi_y1 = noi
        fv_flows = sum(f * (1 + r_at) ** (H - 1 - k) for k, f in enumerate(flows))
        MV_H = mvB(Y + H)
        net = MV_H * (1 - p["sale_cost_pct"])
        gain = max(0.0, net - MV_Y)
        dep_total = dep_annual * H
        recapture = p["recapture_rate"] * min(gain, dep_total)
        cg = p["cg_tax_rate"] * max(0.0, gain - dep_total) + recapture
        W_keep = fv_flows + net - cg
        return {"inherit_year": Y, "market_value_at_inheritance": round(MV_Y), "sell_net_proceeds": round(net_sale_Y),
                "sell_value_at_horizon": round(W_sell), "keep_rental_reassessed_tax_year1": round(assessed_Y * B_EFF),
                "keep_rental_noi_year1_before_tax": round(noi_y1),
                "keep_rental_wealth_at_horizon": round(W_keep),
                "sell_advantage_vs_keep": round(W_sell - W_keep)}

    decisions = {}
    for Y in INHERIT_YEARS:
        decisions[str(Y)] = {"cupertino": cupertino_scenarios(Y), "sf": sf_scenarios(Y)}

    # Estate-tax exposure (current law; exemption indexed by inflation after 2026 - model)
    def exemption(t): return 15000000 * (1 + infl) ** (t - START)
    estate = []
    for E in [5e6, 10e6, 15e6, 20e6, 30e6, 50e6]:
        row = {"estate_value_2026": int(E)}
        for Y in [2026, 2040, 2045, 2050]:
            ex = exemption(Y)
            row[f"tax_if_death_{Y}_nominal_estate_same"] = round(0.40 * max(0.0, E - ex))
            row[f"exemption_{Y}"] = round(ex)
        estate.append(row)

    known = ESTATE_KNOWN["cupertino"] + ESTATE_KNOWN["sf"]
    headroom = {"known_real_estate_mv_2026": known, "headroom_under_2026_exemption": 15000000 - known}
    return {"estate_headroom": headroom, "scenario": sc_name, "params": p, "r_after_tax_investment": round(r_at, 5), "cupertino_annual": rowsA,
            "sf_annual": rowsB, "decisions": decisions, "estate_tax_projection": estate}


def main():
    out = {
        "disclaimer": "Illustrative projections built from user-provided inputs (unverified) and labeled assumptions. Not tax, legal or investment advice.",
        "start_year": START, "end_year": END, "display_end_year": PROJ_END, "decision_horizon_years": DEC_HORIZON,
        "inheritance_years_evaluated": INHERIT_YEARS, "base_inheritance_year": BASE_INHERIT,
        "derived_anchors": {"cupertino_effective_rate": round(A_EFF, 6), "sf_effective_rate": round(B_EFF, 6),
                            "cupertino_assessed_2026_user": A_ASSESSED_2026, "sf_assessed_2026_model": B_ASSESSED_2026,
                            "prop19_cap": FIXED["prop19_cap_amount"], "federal_exemption_2026": 15000000},
        "scenarios": {},
    }
    for s in SCEN:
        out["scenarios"][s] = run(s)
    (ROOT / "data/projections.json").write_text(json.dumps(out, indent=1))
    b = out["scenarios"]["base"]["decisions"]
    for y in INHERIT_YEARS:
        c = b[str(y)]["cupertino"]; s = b[str(y)]["sf"]
        print(y, "A: MV", c["market_value_at_inheritance"], "tax live", c["prop19_qualified_property_tax_year1"], "tax reassessed", c["reassessed_property_tax_year1"],
              "sellW", c["sell_value_at_horizon"], "liveW", c["live_wealth_at_horizon_before_avoided_rent"], "BE avoided rent/mo", c["breakeven_avoided_rent_monthly_if_live_yr1"],
              "BE rent/mo", c["breakeven_net_rent_monthly_if_rented_yr1"])
        print(y, "B: MV", s["market_value_at_inheritance"], "tax reassessed", s["keep_rental_reassessed_tax_year1"], "NOI pre-tax y1", s["keep_rental_noi_year1_before_tax"],
              "sellW", s["sell_value_at_horizon"], "keepW", s["keep_rental_wealth_at_horizon"])


if __name__ == "__main__":
    main()
