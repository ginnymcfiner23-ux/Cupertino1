#!/usr/bin/env python3
"""check_links.py — verifies internal links + anchors across the static site,
and extracts every external URL for the integration review.
Exit code 0 = all internal links OK.
"""
import os, re, sys, html

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PAGES = ["index.html"] + [os.path.join("pages", f) for f in sorted(os.listdir(os.path.join(ROOT, "pages")))
                          if f.endswith(".html")]

href_re = re.compile(r'(?:href|src)="([^"]+)"')

def ids_of(path):
    with open(path) as f:
        return set(re.findall(r'id="([^"]+)"', f.read()))

errors, externals = [], set()
internal_count = 0

for page in PAGES:
    full = os.path.join(ROOT, page)
    base = os.path.dirname(full)
    with open(full) as f:
        content = f.read()
    for url in href_re.findall(html.unescape(content)):
        if url.startswith(("http://", "https://")):
            externals.add(url)
            continue
        if url.startswith(("mailto:", "#")):
            continue
        internal_count += 1
        target, _, frag = url.partition("#")
        tpath = os.path.normpath(os.path.join(base, target)) if target else full
        if not os.path.exists(tpath):
            errors.append(f"{page}: missing target -> {url}")
            continue
        if frag and tpath.endswith(".html"):
            if frag not in ids_of(tpath):
                errors.append(f"{page}: missing anchor #{frag} in {target}")

print(f"Pages checked: {len(PAGES)}")
print(f"Internal links checked: {internal_count}")
print(f"External URLs (deduped): {len(externals)}")
if errors:
    print("\nERRORS:")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print("\nAll internal links and anchors OK.")
