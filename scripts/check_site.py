"""Checks the built site: internal links and anchors resolve, no leaked 'None'/'nan' text,
external links use https, no obvious personal identifiers, every verified fact has a source id.
Exit code 1 on failure (blocks deploy)."""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
errors = []
pages = {p.name: p.read_text(encoding="utf-8") for p in SITE.glob("*.html")}
ids = {n: set(re.findall(r'id="([^"]+)"', t)) for n, t in pages.items()}
for name, text in pages.items():
    for href in re.findall(r'href="([^"]+)"', text):
        if href.startswith("http"):
            if not href.startswith("https://"): errors.append(f"{name}: non-https link {href}")
            continue
        if href.startswith("#"): continue
        target, _, anchor = href.partition("#")
        if target.startswith("assets/"):
            if not (SITE / target).exists(): errors.append(f"{name}: missing asset {target}")
            continue
        if target not in pages: errors.append(f"{name}: broken link {href}"); continue
        if anchor and anchor not in ids[target]: errors.append(f"{name}: missing anchor {href}")
    text_only = re.sub(r"<[^>]+>", " ", text)
    for bad in (r"[\(\[,:=]\s*None\b", r"\bNone\s*[\)\],}]", r"\bnan\b", r"\{[a-z_]+\}"):
        if re.search(bad, text_only): errors.append(f"{name}: leaked token matching {bad}")
    for pat in (r"\bAPN\b", r"\b\d{3,5} [A-Z][a-z]+ (St|Ave|Rd|Dr|Way|Ct|Ln|Blvd)\b", r"@[a-z]+\.", r"\bTrust of\b", r"\bnetherlands\b", r"\bNL\b"):
        if re.search(pat, text_only, re.I): errors.append(f"{name}: possible personal/identifying text ({pat})")
# every verified fact row must cite at least one source id that exists and is official
sources = {s["id"]: s for s in json.loads((ROOT / "data/sources.json").read_text())["sources"]}
for f in json.loads((ROOT / "data/verified_facts.json").read_text())["rows"]:
    if f["status"] == "verified" and not f["source_ids"]: errors.append(f"{f['id']}: verified without source")
    for sid in f["source_ids"]:
        if sid not in sources: errors.append(f"{f['id']}: unknown source {sid}")
    if f["status"] == "verified" and not any(sources[s]["official"] for s in f["source_ids"] if s in sources):
        errors.append(f"{f['id']}: verified but no official source")
    if f["value"] is None and f["status"] == "verified" and f["id"] not in ("V-04","V-09","V-17","V-23","V-37","V-41"):
        errors.append(f"{f['id']}: verified row has blank value (check status)")
    if f["value"] is None and f["flag_id"] is None and f["status"] != "verified":
        errors.append(f"{f['id']}: blank row without flag")
flags = {x["id"] for x in json.loads((ROOT / "data/flags.json").read_text())["flags"]}
for f in json.loads((ROOT / "data/verified_facts.json").read_text())["rows"]:
    if f["flag_id"] and f["flag_id"] not in flags: errors.append(f"{f['id']}: unknown flag {f['flag_id']}")
print("pages:", len(pages), "errors:", len(errors))
for e in errors: print(" -", e)
sys.exit(1 if errors else 0)
