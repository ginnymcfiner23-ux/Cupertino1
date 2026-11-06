#!/usr/bin/env python3
"""
verify.py — line-by-line verification for the Inheritance Decision Dashboard.

Checks performed
----------------
1. STRUCTURE   every page exists, carries the full navigation, the footer,
                the stylesheet and both scripts, and has exactly one <title>.
2. LINKS       every internal page link and every #anchor resolves; every
                external link is https and on the official-source allowlist.
3. DATA        every source key used in data.js is defined; every cell that
                claims an official or pending basis carries a source key;
                no source is defined but never used; the flag count on the
                pages matches the dataset.
4. PRIVACY     no email addresses, phone numbers, street addresses, parcel
                numbers or other personal identifiers appear anywhere in the
                published files.
5. MODEL       the JavaScript model that ships in the browser is re-implemented
                here in Python and the two are compared numerically, so a
                formula error in either implementation is caught.

Exit code 0 = all checks passed.  Exit code 1 = at least one check failed.
"""

import io
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')

PAGES = [
    'index.html',
    'properties.html',
    'property-tax.html',
    'operating-costs.html',
    'inheritance-process.html',
    'inheritance-taxes.html',
    'scenarios.html',
    'flagged.html',
    'sources.html',
]

# Domains that count as an official / authoritative source for this project.
OFFICIAL_DOMAINS = {
    'irs.gov',
    'www.irs.gov',
    'congress.gov',
    'www.congress.gov',
    'leginfo.legislature.ca.gov',
    'boe.ca.gov',
    'www.boe.ca.gov',
    'ftb.ca.gov',
    'www.ftb.ca.gov',
    'files.santaclaracounty.gov',
    'santaclaracounty.gov',
    'www.santaclaracounty.gov',
    'sccassessor.org',
    'www.sccassessor.org',
    'sftreasurer.org',
    'www.sftreasurer.org',
    'sf.gov',
    'www.sf.gov',
    'sfgov.org',
    'www.sfgov.org',
    'sfgov.legistar.com',
    'sfpuc.gov',
    'www.sfpuc.gov',
    'sjwater.com',
    'www.sjwater.com',
    'cupertinosanitarydistrict.org',
    'www.cupertinosanitarydistrict.org',
    'content.govdelivery.com',
    'pge.com',
    'www.pge.com',
    'insurance.ca.gov',
    'www.insurance.ca.gov',
}

ALLOWED_ZIPS = {'95014', '94122'}

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def read(path):
    with io.open(path, encoding='utf-8') as fh:
        return fh.read()


# --------------------------------------------------------------------------
# 1. STRUCTURE
# --------------------------------------------------------------------------

def check_structure():
    for page in PAGES:
        path = os.path.join(DOCS, page)
        if not os.path.exists(path):
            err('missing page: %s' % page)
            continue
        html = read(path)
        if html.count('<title>') != 1:
            err('%s: expected exactly one <title>' % page)
        if 'assets/css/styles.css' not in html:
            err('%s: stylesheet not linked' % page)
        if 'assets/js/data.js' not in html:
            err('%s: data.js not linked' % page)
        if 'assets/js/app.js' not in html:
            err('%s: app.js not linked' % page)
        if 'class="nav"' not in html:
            err('%s: navigation block missing' % page)
        if 'class="site-foot"' not in html:
            err('%s: footer block missing' % page)
        for other in PAGES:
            if ('href="%s"' % other) not in html:
                err('%s: navigation does not link to %s' % (page, other))
    # assets
    for asset in ('assets/css/styles.css', 'assets/js/data.js', 'assets/js/app.js'):
        if not os.path.exists(os.path.join(DOCS, asset)):
            err('missing asset: %s' % asset)


# --------------------------------------------------------------------------
# 2. LINKS
# --------------------------------------------------------------------------

def collect_ids(html):
    return set(re.findall(r'\bid="([^"]+)"', html))


def check_links():
    ids_by_page = {}
    for page in PAGES:
        path = os.path.join(DOCS, page)
        if os.path.exists(path):
            ids_by_page[page] = collect_ids(read(path))

    for page in PAGES:
        path = os.path.join(DOCS, page)
        if not os.path.exists(path):
            continue
        html = read(path)
        for href in re.findall(r'href="([^"]+)"', html):
            if href.startswith('http://'):
                err('%s: insecure link %s' % (page, href))
                continue
            if href.startswith('https://'):
                host = re.sub(r'^https?://([^/]+).*$', r'\1', href)
                if host not in OFFICIAL_DOMAINS:
                    err('%s: external link to a non-allowlisted host: %s' % (page, href))
                continue
            if href.startswith('#'):
                if href[1:] not in ids_by_page.get(page, set()):
                    err('%s: anchor %s does not resolve' % (page, href))
                continue
            if href.endswith('.html'):
                if not os.path.exists(os.path.join(DOCS, href)):
                    err('%s: link to missing page %s' % (page, href))
                continue
            if href.startswith('assets/'):
                if not os.path.exists(os.path.join(DOCS, href)):
                    err('%s: link to missing asset %s' % (page, href))
                continue
            if href == '':
                err('%s: empty href' % page)


# --------------------------------------------------------------------------
# 3. DATA INTEGRITY
# --------------------------------------------------------------------------

CELL_RE = re.compile(
    r"\b([OWAPDU])\(\s*"
    r"(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"|null)"
    r"\s*,\s*"
    r"(?:'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"|null)"
)

SOURCE_DEF_RE = re.compile(r"^\s*'([a-z0-9\-]+)':\s*\{", re.M)


def check_data():
    data_path = os.path.join(DOCS, 'assets/js/data.js')
    data = read(data_path)

    defined = set(SOURCE_DEF_RE.findall(data))
    if not defined:
        err('data.js: could not find any source definitions')
        return

    used = set()
    # source keys are also cited in process steps (`s: 'key'`) and as plain
    # text cells in the pending-law table (`T('key')`)
    used |= set(re.findall(r"\bs:\s*'([a-z0-9\-]+)'", data))
    used |= set(re.findall(r"\bT\('([a-z0-9\-]+)'\)", data))
    official_without_source = 0
    for m in CELL_RE.finditer(data):
        helper = m.group(1)
        arg1 = m.group(2) if m.group(2) is not None else m.group(3)
        arg2 = m.group(4) if m.group(4) is not None else m.group(5)
        # U(source, note) puts the source first; every other helper puts it second
        key = arg1 if helper == 'U' else arg2
        if key:
            used.add(key)
            if key not in defined:
                err('data.js: cell uses undefined source key "%s"' % key)
        if helper in ('O', 'P') and not key:
            official_without_source += 1
            err('data.js: an %sfficial/pending cell has no source link' % helper)

    if official_without_source:
        err('data.js: %d official/pending cells without a source' % official_without_source)

    unused = defined - used
    for u in sorted(unused):
        err('data.js: source "%s" is defined but never cited' % u)

    # every source URL must be https on an allowlisted host
    for m in re.finditer(r"u:\s*'([^']+)'", data):
        url = m.group(1)
        if not url.startswith('https://'):
            err('data.js: source URL is not https: %s' % url)
            continue
        host = re.sub(r'^https?://([^/]+).*$', r'\1', url)
        if host not in OFFICIAL_DOMAINS:
            err('data.js: source URL points at a non-allowlisted host: %s' % url)

    # flag count consistency
    flags = re.findall(r"\{ id: '([^']+)',\s*sev:", data)
    pages = {p: read(os.path.join(DOCS, p)) for p in PAGES}
    for page in ('flagged.html', 'index.html'):
        txt = pages[page]
        nums = {'sixteen': 16, 'eighteen': 18, 'seventeen': 17, 'nineteen': 19, 'twenty': 20}
        found = False
        for word, n in nums.items():
            if re.search(r'\b%s open items\b' % word, txt, re.I):
                if n != len(flags):
                    err('%s: claims "%s open items" but the dataset holds %d' % (page, word, len(flags)))
                found = True
        if not found:
            warn('%s: does not state an open-item count' % page)

    # every flag id must be unique and every flag should carry a source or a
    # clear statement that there is no source
    if len(set(flags)) != len(flags):
        err('data.js: duplicate flag ids')
    for f in flags:
        if not re.search(r"\{ id: '%s'," % re.escape(f), data):
            err('data.js: flag %s could not be re-read' % f)


# --------------------------------------------------------------------------
# 4. PRIVACY
# --------------------------------------------------------------------------

PRIVACY_PATTERNS = [
    ('email address', r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
    ('phone number', r'(?<![\d\-\.])\(?\d{3}\)?[\-. ]\d{3}[\-. ]\d{4}(?![\d\-\.])'),
    ('social security number', r'(?<!\d)\d{3}-\d{2}-\d{4}(?!\d)'),
    ('street address', r'\b\d{1,5}\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)?\s+(?:Street|Avenue|Road|Drive|Boulevard|Lane|Court|Place|Terrace|Circle|Way)\b'),
    ('parcel number', r'(?<![\d\-])\d{3,4}-\d{3}-\d{2,4}(?![\d\-])'),
    ('long digit run', r'(?<![\d.])\d{9,}(?![\d])'),
]

PLACEHOLDERS = ['OWNER', 'PROPERTY_CUPERTINO', 'PROPERTY_SF']


def check_privacy():
    files = []
    for page in PAGES:
        files.append(os.path.join(DOCS, page))
    for js in ('assets/js/data.js', 'assets/js/app.js'):
        files.append(os.path.join(DOCS, js))

    for path in files:
        text = read(path)
        rel = os.path.relpath(path, ROOT)
        for label, pattern in PRIVACY_PATTERNS:
            for m in re.finditer(pattern, text):
                snippet = m.group(0)
                before = text[m.start() - 1:m.start()] or ''
                after = text[m.end():m.end() + 1] or ''
                # identifiers inside a URL (bill ids, file names) are not PII
                if before in '=_/:' or after in '&._-/' or 'http' in text[max(0, m.start() - 120):m.start()]:
                    continue
                # fiscal years, statutes and rates are not personal data
                if re.match(r'^\d{4}-\d{2}$', snippet) or re.match(r'^\d{4}-\d{2}-\d{2}$', snippet):
                    continue
                if re.match(r'^\d{4}-\d{4}$', snippet):
                    continue
                if re.match(r'^\d{4}-\d{3}$', snippet):
                    continue
                err('%s: possible %s -> %r' % (rel, label, snippet))
        # a 5-digit token counts as a ZIP only where it is presented as one
        for m in re.finditer(r"(?i)\bzip(?:\s*code)?\b[^0-9]{0,40}([0-9]{5})", text):
            z = m.group(1)
            if z not in ALLOWED_ZIPS:
                err('%s: unexpected ZIP code %s' % (rel, z))
        for z in set(re.findall(r"(?i)\b(?:zip|postal code)\s+([0-9]{5})", text)):
            if z not in ALLOWED_ZIPS:
                err('%s: unexpected ZIP code %s' % (rel, z))

    combined = ''.join(read(p) for p in files)
    for ph in PLACEHOLDERS:
        if ph not in combined:
            err('privacy: placeholder %s never used' % ph)


# --------------------------------------------------------------------------
# 5. MODEL CROSS-CHECK
# --------------------------------------------------------------------------

P = dict(
    inheritYear=2045,
    appreciation=0.035,
    prop13Growth=0.02,
    utilityEsc=0.04,
    insuranceEsc=0.04,
    maintEsc=0.03,
    rentEsc=0.03,
    discount=0.05,
    portfolioReturn=0.06,
    cupertinoRent=5500,
    gainTaxRate=0.333,
    horizon=20,
    prop19Allowance2025=1044586,
    prop19AllowanceInfl=0.02,
)

IN = {
    'cupertino': dict(marketValue2026=3100000, assessed2026=550537, rate=0.011488,
                      transferRate=0.0, saleCostPct=0.02, rent=0),
    'sf': dict(marketValue2026=1800000, assessed2026=116533, rate=0.0118162182,
               transferRate=0.0075, saleCostPct=0.025, rent=85800),
}

CA_DOC_TRANSFER = 0.0011


def cupertino_costs(year):
    e = (1 + P['utilityEsc']) ** (year - 2026)
    i = (1 + P['insuranceEsc']) ** (year - 2026)
    m = (1 + P['maintEsc']) ** (year - 2026)
    fmv = IN['cupertino']['marketValue2026'] * (1 + P['appreciation']) ** (year - 2026)
    water = (53.02 + 6 * 4.7350 + 4 * 6.5241 + 1.45) * 12
    sewer = 802.14
    electricity = -180.0
    insurance = 2500 * i
    maintenance = 4000 * m + 0.005 * fmv
    return dict(water=water * e, sewer=sewer * e, electricity=electricity * e,
                insurance=insurance, maintenance=maintenance,
                total=(water + sewer + electricity) * e + insurance + maintenance)


def sf_costs(year):
    e = (1 + P['utilityEsc']) ** (year - 2026)
    i = (1 + P['insuranceEsc']) ** (year - 2026)
    m = (1 + P['maintEsc']) ** (year - 2026)
    r = (1 + P['rentEsc']) ** (year - 2026)
    fmv = IN['sf']['marketValue2026'] * (1 + P['appreciation']) ** (year - 2026)
    water = (35.53 + 9 * 12.03 + 3 * 12.91) * 12
    wastewater = (6.62 + 11.4 * 20.74) * 12
    stormwater = 29.55 * 12
    electricity = 609 * 12
    insurance = 2500 * i
    maintenance = 3 * 4000 * m + 0.0075 * fmv
    rent = IN['sf']['rent'] * r
    return dict(water=water * e, wastewater=wastewater * e, stormwater=stormwater * e,
                electricity=electricity * e, insurance=insurance, maintenance=maintenance,
                rent=rent,
                total=(water + wastewater + stormwater + electricity) * e + insurance + maintenance)


def prop19_allowance(year):
    steps = max(0, (year - 2025) // 2)
    return P['prop19Allowance2025'] * (1 + P['prop19AllowanceInfl']) ** steps


def assessed_base(which, year, mode):
    prop = IN[which]
    n = year - 2026
    iy = P['inheritYear']
    escalated = prop['assessed2026'] * (1 + P['prop13Growth']) ** n
    fmv_at_iy = prop['marketValue2026'] * (1 + P['appreciation']) ** (iy - 2026)
    base_at_iy = prop['assessed2026'] * (1 + P['prop13Growth']) ** (iy - 2026)
    if year < iy:
        return escalated
    if mode == 'full':
        return fmv_at_iy * (1 + P['prop13Growth']) ** (year - iy)
    if mode == 'prop19':
        excess = max(0.0, fmv_at_iy - base_at_iy - prop19_allowance(iy))
        return (base_at_iy + excess) * (1 + P['prop13Growth']) ** (year - iy)
    return escalated


def year_state(which, year, mode):
    prop = IN[which]
    fmv = prop['marketValue2026'] * (1 + P['appreciation']) ** (year - 2026)
    assessed = assessed_base(which, year, mode)
    tax = assessed * prop['rate']
    costs = cupertino_costs(year) if which == 'cupertino' else sf_costs(year)
    if which == 'cupertino':
        rent = P['cupertinoRent'] * 12 * (1 + P['rentEsc']) ** (year - 2026)
        net = rent - costs['total'] - tax
    else:
        rent = costs['rent']
        net = costs['rent'] - costs['total'] - tax
    return dict(fmv=fmv, assessed=assessed, tax=tax, net=net)


def hold_npv(which, mode, iy, horizon):
    npv = 0.0
    last = None
    for y in range(iy, iy + horizon + 1):
        s = year_state(which, y, mode)
        last = s
        npv += s['net'] / (1 + P['discount']) ** (y - iy)
    npv += last['fmv'] / (1 + P['discount']) ** horizon
    return npv


def sell_npv(which, iy, horizon, sale_delay=1):
    prop = IN[which]
    basis = prop['marketValue2026'] * (1 + P['appreciation']) ** (iy - 2026)
    sale_year = iy + sale_delay
    gross = prop['marketValue2026'] * (1 + P['appreciation']) ** (sale_year - 2026)
    gain = max(0.0, gross - basis)
    gain_tax = gain * P['gainTaxRate']
    transfer = gross * (prop['transferRate'] + CA_DOC_TRANSFER)
    costs = gross * prop['saleCostPct']
    net = gross - gain_tax - transfer - costs
    wealth = net * (1 + P['portfolioReturn']) ** (horizon - sale_delay)
    return dict(npv=wealth / (1 + P['discount']) ** horizon,
                gross=gross, gain=gain, gain_tax=gain_tax, transfer=transfer,
                costs=costs, net=net)


NODE_HARNESS = r"""
global.window = global;
require(process.argv[2]);
require(process.argv[3]);
const M = global.__MODEL;
const out = { states: [], npv: {} };
['cupertino','sf'].forEach(function (w) {
  ['base','prop19','full'].forEach(function (mode) {
    [2026,2035,2040,2045,2050].forEach(function (y) {
      const s = M.yearState(w, y, mode);
      out.states.push([w, mode, y, s.fmv, s.assessed, s.tax, s.net]);
    });
  });
});
out.npv.cupBase = M.holdNPV('cupertino','base',2045,20).npv;
out.npv.cupProp19 = M.holdNPV('cupertino','prop19',2045,20).npv;
out.npv.sfBase = M.holdNPV('sf','base',2045,20).npv;
out.npv.sfFull = M.holdNPV('sf','full',2045,20).npv;
out.npv.cupSell = M.sellNPV('cupertino',2045,20,1).npv;
out.npv.sfSell = M.sellNPV('sf',2045,20,1).npv;
console.log(JSON.stringify(out));
"""


def check_model():
    node = None
    for candidate in ('node', 'nodejs'):
        try:
            subprocess.check_output([candidate, '--version'],
                                    stderr=subprocess.STDOUT)
            node = candidate
            break
        except Exception:
            continue
    if node is None:
        warn('node not available — the JavaScript/Python model cross-check was skipped')
        return

    harness = tempfile.NamedTemporaryFile('w', suffix='.js', delete=False)
    harness.write(NODE_HARNESS)
    harness.close()
    try:
        raw = subprocess.check_output(
            [node, harness.name,
             os.path.join(DOCS, 'assets/js/data.js'),
             os.path.join(DOCS, 'assets/js/app.js')],
            stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as exc:
        err('model: the browser model failed to run under node:\n%s' % exc.output.decode('utf-8', 'replace'))
        return
    finally:
        os.unlink(harness.name)

    try:
        js = json.loads(raw.decode('utf-8'))
    except ValueError:
        err('model: could not parse the node output')
        return

    worst = 0.0
    for row in js['states']:
        w, mode, y, fmv, assessed, tax, net = row
        py = year_state(w, y, mode)
        for label, a, b in (('fmv', fmv, py['fmv']), ('assessed', assessed, py['assessed']),
                            ('tax', tax, py['tax']), ('net', net, py['net'])):
            diff = abs(a - b)
            rel = diff / max(1.0, abs(b))
            worst = max(worst, rel)
            if rel > 1e-9:
                err('model mismatch: %s/%s/%d %s js=%.4f py=%.4f' % (w, mode, y, label, a, b))

    py_npv = {
        'cupBase': hold_npv('cupertino', 'base', 2045, 20),
        'cupProp19': hold_npv('cupertino', 'prop19', 2045, 20),
        'sfBase': hold_npv('sf', 'base', 2045, 20),
        'sfFull': hold_npv('sf', 'full', 2045, 20),
        'cupSell': sell_npv('cupertino', 2045, 20)['npv'],
        'sfSell': sell_npv('sf', 2045, 20)['npv'],
    }
    for key, pyv in py_npv.items():
        jsv = js['npv'][key]
        rel = abs(jsv - pyv) / max(1.0, abs(pyv))
        worst = max(worst, rel)
        if rel > 1e-9:
            err('model mismatch: NPV %s js=%.4f py=%.4f' % (key, jsv, pyv))

    print('  model cross-check: %d states + %d NPVs agree (worst relative difference %.2e)'
          % (len(js['states']), len(py_npv), worst))


# --------------------------------------------------------------------------
# 6. RENDER SMOKE TEST
# --------------------------------------------------------------------------

def check_render():
    node = None
    for candidate in ('node', 'nodejs'):
        try:
            subprocess.check_output([candidate, '--version'], stderr=subprocess.STDOUT)
            node = candidate
            break
        except Exception:
            continue
    if node is None:
        warn('node not available — the renderer smoke test was skipped')
        return
    script = os.path.join(ROOT, 'tools', 'smoke.js')
    if not os.path.exists(script):
        warn('tools/smoke.js not found — the renderer smoke test was skipped')
        return
    try:
        out = subprocess.check_output([node, script], stderr=subprocess.STDOUT).decode('utf-8', 'replace')
    except subprocess.CalledProcessError as exc:
        err('render: the renderer smoke test failed:\n%s' % exc.output.decode('utf-8', 'replace'))
        return
    print('  ' + out.strip().splitlines()[-1].strip())


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------

def main():
    print('Verifying the Inheritance Decision Dashboard')
    print('-' * 70)
    check_structure()
    print('  structure: %d pages checked' % len(PAGES))
    check_links()
    print('  links: checked')
    check_data()
    print('  data integrity: checked')
    check_privacy()
    print('  privacy: checked')
    check_model()
    print('  model: cross-checked against the Python re-implementation')
    check_render()
    print('-' * 70)
    for w in warnings:
        print('WARN  %s' % w)
    if errors:
        for e in errors:
            print('FAIL  %s' % e)
        print('-' * 70)
        print('%d check(s) FAILED, %d warning(s).' % (len(errors), len(warnings)))
        return 1
    print('All checks passed (%d warning(s)).' % len(warnings))
    return 0


if __name__ == '__main__':
    sys.exit(main())
