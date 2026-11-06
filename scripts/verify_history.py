"""Line-by-line check of user-provided property history.
Recomputes each year-over-year % change from the listed values and compares it with the
% the user supplied. Writes data/history_check.json. Exit code 0 always (issues are flagged, not fatal)."""
import json, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
d = json.loads((ROOT / "data/user_inputs.json").read_text())
out = {}
for key in ("property_a", "property_b"):
    rows = sorted(d[key]["history"], key=lambda r: r["year"])  # oldest first
    checks = []
    for prev, cur in zip(rows, rows[1:]):
        for field, stated_key in (("property_tax", "tax_change_pct_stated"), ("assessed_value", "assessed_change_pct_stated")):
            if cur[field] is None or prev[field] in (None, 0):
                continue
            calc = round((cur[field] / prev[field] - 1) * 100, 2)
            stated = cur[stated_key]
            status = "n/a" if stated is None else ("match" if abs(round(calc, 1) - stated) < 0.05 else "MISMATCH")
            checks.append({"year": cur["year"], "field": field, "prev": prev[field], "value": cur[field],
                           "computed_pct": calc, "stated_pct": stated, "status": status})
    # rows where tax is flat or stated change is missing
    for r in rows:
        if r.get("tax_change_pct_stated") is None and r["property_tax"] is not None:
            checks.append({"year": r["year"], "field": "property_tax", "status": "no stated change", "value": r["property_tax"]})
    # implied effective rate on assessed value
    latest = max((r for r in rows if r["property_tax"]), key=lambda r: r["year"])
    rate = round(latest["property_tax"] / latest["assessed_value"] * 100, 3) if latest["property_tax"] else None
    out[key] = {"checks": checks, "effective_rate_pct_latest": rate, "latest_year": latest["year"]}
(ROOT / "data/history_check.json").write_text(json.dumps(out, indent=2))
for k, v in out.items():
    print(k, "effective rate", v["effective_rate_pct_latest"], "%")
    for c in v["checks"]:
        if c["status"] != "match":
            print("  ", c)
