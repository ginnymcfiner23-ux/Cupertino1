/* ==========================================================================
   Inheritance Decision Dashboard — model + renderer
   --------------------------------------------------------------------------
   Two jobs:
     1. A deterministic financial model (no dependencies) that turns the
        dataset plus the assumption sliders into year-by-year projections and
        option-by-option NPVs.
     2. A tiny renderer that turns declarative tables in data.js into HTML,
        with a basis badge and a link to the official source on every value.
   ========================================================================== */

(function () {
  'use strict';

  const D = window.DATA;

  /* ------------------------------------------------------------ formatting */

  const nf = (n, dp) => (n === null || n === undefined || isNaN(n))
    ? '—'
    : n.toLocaleString('en-US', { minimumFractionDigits: dp || 0, maximumFractionDigits: dp === undefined ? 0 : dp });

  const usd = (n, dp) => (n === null || n === undefined || isNaN(n)) ? '—' : '$' + nf(n, dp);
  const usd0 = (n) => usd(n, 0);
  const pct = (n, dp) => (n === null || n === undefined || isNaN(n)) ? '—' : nf(n * 100, dp === undefined ? 2 : dp) + '%';
  const rate = (n) => (n === null || n === undefined || isNaN(n)) ? '—' : nf(n * 100, 5) + '%';

  const BASIS_LABEL = {
    official: 'official', owner: 'owner', assumption: 'assumption',
    unverified: 'unverified', pending: 'pending', derived: 'derived', text: ''
  };

  /* ------------------------------------------------------- model parameters */

  const P = {
    inheritYear: 2045,
    appreciation: 0.035,
    prop13Growth: 0.02,
    utilityEsc: 0.04,
    insuranceEsc: 0.04,
    maintEsc: 0.03,
    rentEsc: 0.03,
    discount: 0.05,
    portfolioReturn: 0.06,
    cupertinoRent: 5500,
    gainTaxRate: 0.333,
    horizon: 20,
    prop19Allowance2025: 1044586,
    prop19AllowanceInfl: 0.02
  };

  const IN = {
    cupertino: {
      key: 'PROPERTY_CUPERTINO',
      marketValue2026: 3100000,
      assessed2026: D.props.cupertino.model.assessed2026,
      rate: 0.011488,
      transferRate: 0,
      saleCostPct: 0.02,
      color: '#12507c',
      rent: 0
    },
    sf: {
      key: 'PROPERTY_SF',
      marketValue2026: 1800000,
      assessed2026: 116533,
      rate: 0.0118162182,
      transferRate: 0.0075,          // SF band $1M-$5M, applied to the entire consideration
      saleCostPct: 0.025,
      color: '#0f766e',
      rent: 85800
    }
  };

  const CA_DOC_TRANSFER = 0.0011;   // R&T §11911 — $1.10 per $1,000

  /* --------------------------------------------------------------- helpers */

  const esc = (s) => String(s === null || s === undefined ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const yoy = (base, n) => base * Math.pow(1 + n, 1);

  function prop19Allowance(year) {
    // BOE adjusts the $1,000,000 allowance for inflation every two years
    // (2/16/2025 -> $1,044,586). Adjustments: 2025-02-16, 2027-02-16, ...
    const steps = Math.max(0, Math.floor((year - 2025) / 2));
    return P.prop19Allowance2025 * Math.pow(1 + P.prop19AllowanceInfl, steps);
  }

  /* --------------------------------------------------------- cost build-ups */

  function cupertinoCosts(year) {
    const e = Math.pow(1 + P.utilityEsc, year - 2026);
    const i = Math.pow(1 + P.insuranceEsc, year - 2026);
    const m = Math.pow(1 + P.maintEsc, year - 2026);
    const fmv = IN.cupertino.marketValue2026 * Math.pow(1 + P.appreciation, year - 2026);

    const water = (53.02 + (6 * 4.7350) + (4 * 6.5241) + 1.45) * 12;   // SJWC Schedule No. 1
    const sewer = 802.14;                                              // Cupertino Sanitary District FY2025-26
    const electricity = -180;                                          // owner-reported net solar credit
    const insurance = 2500 * i;
    const maintenance = (4000 * m) + (0.005 * fmv);

    return {
      water: water * e, sewer: sewer * e, electricity: electricity * e,
      insurance: insurance, maintenance: maintenance,
      total: (water + sewer + electricity) * e + insurance + maintenance
    };
  }

  function sfCosts(year) {
    const e = Math.pow(1 + P.utilityEsc, year - 2026);
    const i = Math.pow(1 + P.insuranceEsc, year - 2026);
    const m = Math.pow(1 + P.maintEsc, year - 2026);
    const r = Math.pow(1 + P.rentEsc, year - 2026);
    const fmv = IN.sf.marketValue2026 * Math.pow(1 + P.appreciation, year - 2026);

    const water = (35.53 + (9 * 12.03) + (3 * 12.91)) * 12;            // SFPUC W-1B
    const wastewater = (6.62 + (11.4 * 20.74)) * 12;                   // SFPUC Schedule A
    const stormwater = 29.55 * 12;                                     // SFPUC Schedule D, tier 3
    const electricity = 609 * 12;                                      // PG&E 40.60 c/kWh x 1,500 kWh
    const insurance = 2500 * i;
    const maintenance = (3 * 4000 * m) + (0.0075 * fmv);
    const rent = IN.sf.rent * r;

    return {
      water: water * e, wastewater: wastewater * e, stormwater: stormwater * e,
      electricity: electricity * e, insurance: insurance, maintenance: maintenance,
      rent: rent, total: (water + wastewater + stormwater + electricity) * e + insurance + maintenance
    };
  }

  /* ------------------------------------------------------- year-by-year state */

  function reassessedBase(prop, year) {
    // Assessed value carried forward from the inheritance, in three modes.
    const n = year - 2026;
    const IY = P.inheritYear;
    const escalated = prop.assessed2026 * Math.pow(1 + P.prop13Growth, n);
    const fmvAtIY = prop.marketValue2026 * Math.pow(1 + P.appreciation, IY - 2026);
    const baseAtIY = prop.assessed2026 * Math.pow(1 + P.prop13Growth, IY - 2026);

    if (year < IY) return escalated;

    if (prop.mode === 'full') {
      return fmvAtIY * Math.pow(1 + P.prop13Growth, year - IY);
    }
    if (prop.mode === 'prop19') {
      const excess = Math.max(0, fmvAtIY - baseAtIY - prop19Allowance(IY));
      const newBase = baseAtIY + excess;
      return newBase * Math.pow(1 + P.prop13Growth, year - IY);
    }
    return escalated;   // 'base' — assessed value preserved
  }

  function yearState(which, year, mode) {
    const prop = Object.assign({}, IN[which], { mode: mode });
    const fmv = prop.marketValue2026 * Math.pow(1 + P.appreciation, year - 2026);
    const assessed = reassessedBase(prop, year);
    const tax = assessed * prop.rate;
    const costs = which === 'cupertino' ? cupertinoCosts(year) : sfCosts(year);
    const rent = which === 'cupertino'
      ? (P.cupertinoRent * 12) * Math.pow(1 + P.rentEsc, year - 2026)
      : costs.rent;

    let net;
    if (which === 'cupertino') {
      net = rent - costs.total - tax;     // rent is the benefit (imputed if owner-occupied)
    } else {
      net = costs.rent - costs.total - tax;   // NOI from the two rented units
    }
    return { year: year, fmv: fmv, assessed: assessed, tax: tax, costs: costs, rent: rent, net: net };
  }

  function series(which, mode, from, to) {
    const out = [];
    for (let y = from; y <= to; y++) out.push(yearState(which, y, mode));
    return out;
  }

  /* ------------------------------------------------------------- option NPVs */

  function holdNPV(which, mode, IY, horizon, opts) {
    let npv = 0;
    let first = null, last = null;
    for (let y = IY; y <= IY + horizon; y++) {
      const s = yearState(which, y, mode);
      if (!first) first = s;
      last = s;
      npv += s.net / Math.pow(1 + P.discount, y - IY);
    }
    npv += last.fmv / Math.pow(1 + P.discount, horizon);
    return { npv: npv, first: first, last: last };
  }

  function sellNPV(which, IY, horizon, saleDelay) {
    const prop = IN[which];
    const basis = prop.marketValue2026 * Math.pow(1 + P.appreciation, IY - 2026);   // §1014 step-up
    const saleYear = IY + (saleDelay === undefined ? 1 : saleDelay);
    const gross = prop.marketValue2026 * Math.pow(1 + P.appreciation, saleYear - 2026);
    const gain = Math.max(0, gross - basis);
    const gainTax = gain * P.gainTaxRate;
    const transfer = gross * (prop.transferRate + CA_DOC_TRANSFER);
    const costs = gross * prop.saleCostPct;
    const net = gross - gainTax - transfer - costs;
    const wealth = net * Math.pow(1 + P.portfolioReturn, horizon - saleDelay);
    const npv = wealth / Math.pow(1 + P.discount, horizon);
    return { npv: npv, gross: gross, basis: basis, gain: gain, gainTax: gainTax, transfer: transfer, costs: costs, net: net, saleYear: saleYear };
  }

  /* --------------------------------------------------------- table renderer */

  function resolve(path) {
    return path.split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, D);
  }

  function sourceChip(key) {
    if (!key) return '';
    const s = D.sources[key];
    if (!s) return '<span class="src-link" title="Source key not found">missing:' + esc(key) + '</span>';
    return '<a class="src-link" href="' + esc(s.u) + '" target="_blank" rel="noopener" title="' + esc(s.p + ' — ' + s.t + (s.n ? '\n' + s.n : '')) + '">source</a>';
  }

  function cell(c) {
    if (c === null || c === undefined) return '<td>—</td>';
    if (typeof c === 'string' || typeof c === 'number') return '<td>' + esc(c) + '</td>';
    if (c.b === 'text') return '<td>' + esc(c.v) + '</td>';

    const b = c.b;
    const badge = '<span class="badge ' + b + '">' + BASIS_LABEL[b] + '</span>';
    let val;
    if (c.v === null || c.v === undefined) {
      val = '<span class="muted">—</span>';
    } else {
      val = '<span>' + esc(c.v) + '</span>';
    }
    const note = c.n ? '<br><small class="muted">' + esc(c.n) + '</small>' : '';
    const src = c.s ? ' ' + sourceChip(c.s) : '';
    return '<td>' + val + ' ' + badge + src + note + '</td>';
  }

  function renderTable(target, t) {
    if (!t) { target.innerHTML = '<p class="muted">Table not found: ' + esc(target.getAttribute('data-table')) + '</p>'; return; }
    let h = '';
    if (t.title) h += '<h3>' + esc(t.title) + '</h3>';
    h += '<div class="table-scroll"><table class="compact"><thead><tr>';
    t.head.forEach(function (c) { h += '<th>' + esc(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    t.rows.forEach(function (r) {
      const cls = (r.length === 1 && r[0] && r[0].totalRow) ? ' class="total"' : '';
      h += '<tr' + cls + '>';
      r.forEach(function (c) { h += cell(c); });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    if (t.note) h += '<p class="small muted" style="margin-top:8px">' + esc(t.note) + '</p>';
    target.innerHTML = h;
  }

  /* ------------------------------------------------------------ chart maker */

  function renderChart(target, cfg) {
    const W = 900, H = 340, ML = 78, MR = 18, MT = 14, MB = 44;
    const xs = cfg.xs, series = cfg.series;
    const allY = [];
    series.forEach(function (s) { s.pts.forEach(function (p) { if (p.y !== null && !isNaN(p.y)) allY.push(p.y); }); });
    if (!allY.length) { target.innerHTML = ''; return; }
    let yMin = cfg.yMin !== undefined ? cfg.yMin : Math.min.apply(null, allY);
    let yMax = cfg.yMax !== undefined ? cfg.yMax : Math.max.apply(null, allY);
    if (yMax === yMin) { yMax = yMin + 1; }
    const pad = (yMax - yMin) * 0.08;
    yMin = cfg.yMin !== undefined ? yMin : yMin - pad;
    yMax = cfg.yMax !== undefined ? yMax : yMax + pad;

    const x0 = ML, x1 = W - MR, y0 = H - MB, y1 = MT;
    const sx = function (x) { return x0 + (x - xs[0]) / (xs[xs.length - 1] - xs[0]) * (x1 - x0); };
    const sy = function (y) { return y0 - (y - yMin) / (yMax - yMin) * (y0 - y1); };

    let h = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(cfg.alt || 'chart') + '">';
    // gridlines
    for (let i = 0; i <= 4; i++) {
      const y = y1 + (y0 - y1) * i / 4;
      const v = yMax - (yMax - yMin) * i / 4;
      h += '<line x1="' + x0 + '" y1="' + y.toFixed(1) + '" x2="' + x1 + '" y2="' + y.toFixed(1) + '" stroke="#e6ebf2" stroke-width="1"/>';
      h += '<text x="' + (x0 - 8) + '" y="' + (y + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="#667085">' + esc(cfg.fmtY ? cfg.fmtY(v) : nf(v)) + '</text>';
    }
    // x labels
    const every = Math.max(1, Math.ceil(xs.length / 12));
    xs.forEach(function (x, i) {
      if (i % every !== 0 && i !== xs.length - 1) return;
      h += '<text x="' + sx(x).toFixed(1) + '" y="' + (y0 + 18) + '" text-anchor="middle" font-size="11" fill="#667085">' + x + '</text>';
    });
    h += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '" stroke="#c3ccd9" stroke-width="1"/>';

    series.forEach(function (s) {
      if (s.dash) {
        let d = '';
        s.pts.forEach(function (p, i) { d += (i ? 'L' : 'M') + sx(p.x).toFixed(1) + ' ' + sy(p.y).toFixed(1) + ' '; });
        h += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2" stroke-dasharray="5 4"/>';
      } else {
        let d = '';
        s.pts.forEach(function (p, i) { d += (i ? 'L' : 'M') + sx(p.x).toFixed(1) + ' ' + sy(p.y).toFixed(1) + ' '; });
        h += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2.5"/>';
      }
    });
    h += '</svg>';
    h += '<div class="chart-legend">';
    series.forEach(function (s) {
      h += '<span><i class="swatch" style="background:' + s.color + '"></i>' + esc(s.name) + '</span>';
    });
    h += '</div>';
    target.innerHTML = h;
  }

  /* ------------------------------------------------------- dynamic builders */

  function projectionTable(which, mode, title, note) {
    const rows = [];
    const s = series(which, mode, 2026, 2050);
    s.forEach(function (y) {
      const rowsRow = [];
      rowsRow.push(String(y.year));
      rowsRow.push({ v: usd0(y.fmv), b: 'derived' });
      rowsRow.push({ v: usd0(y.assessed), b: 'derived' });
      rowsRow.push({ v: usd0(y.tax), b: 'derived' });
      rows.push(rowsRow);
    });
    return {
      title: title,
      note: note,
      head: ['Year', 'Market value', 'Assessed value', 'Property tax'],
      rows: rows
    };
  }

  function buildScenarioTable() {
    const IY = P.inheritYear, H = P.horizon;
    const cupBase = holdNPV('cupertino', 'base', IY, H);
    const cupP19 = holdNPV('cupertino', 'prop19', IY, H);
    const cupSell = sellNPV('cupertino', IY, H, 1);
    const sfBase = holdNPV('sf', 'base', IY, H);
    const sfFull = holdNPV('sf', 'full', IY, H);
    const sfSell = sellNPV('sf', IY, H, 1);

    const rows = [
      [esc('PROPERTY_CUPERTINO'), esc('A. Live in it — base preserved'),
        usd0(cupBase.first.net) + ' / yr', usd0(cupBase.first.tax) + ' / yr tax', usd0(cupBase.npv),
        'Best risk-adjusted outcome. Keeps the low base, keeps the Prop 19 claim available.'],
      [esc('PROPERTY_CUPERTINO'), esc('A2. Live in it — Prop 19 partial exclusion only'),
        usd0(cupP19.first.net) + ' / yr', usd0(cupP19.first.tax) + ' / yr tax', usd0(cupP19.npv),
        'Fallback if the trust base is lost. The $1.27M allowance caps only a small part of the gap.'],
      [esc('PROPERTY_CUPERTINO'), esc('C. Sell in ' + (IY + 1) + ' and invest'),
        usd0(cupSell.net) + ' net proceeds', 'no property tax', usd0(cupSell.npv),
        'Gain of ' + usd0(cupSell.gain) + ' taxed at ' + pct(P.gainTaxRate, 1) + '. Only sensible if the base is lost or liquidity is needed.'],
      [esc('PROPERTY_SF'), esc('D. Hold and rent — base preserved'),
        usd0(sfBase.first.net) + ' / yr', usd0(sfBase.first.tax) + ' / yr tax', usd0(sfBase.npv),
        'Only if a written opinion confirms the base survives the trust.'],
      [esc('PROPERTY_SF'), esc("D2. Hold and rent — full reassessment (expected without Prop 19)"),
        usd0(sfFull.first.net) + ' / yr', usd0(sfFull.first.tax) + ' / yr tax', usd0(sfFull.npv),
        'The likely outcome. Net operating income collapses.'],
      [esc('PROPERTY_SF'), esc('E. Sell in ' + (IY + 1) + ' and invest'),
        usd0(sfSell.net) + ' net proceeds', 'no property tax', usd0(sfSell.npv),
        'Gain of ' + usd0(sfSell.gain) + ' taxed at ' + pct(P.gainTaxRate, 1) + ' after the §1014 step-up. Recommended if the base is lost.']
    ];
    return {
      title: 'Option comparison at an inheritance in ' + IY + ' (NPV over ' + H + ' years, discounted at ' + pct(P.discount, 1) + ')',
      note: 'NPV = the discounted value of (annual net cash flow + the terminal market value) measured at the inheritance year, compared with (net sale proceeds grown at ' + pct(P.portfolioReturn, 1) + ' and discounted back). Cash flow for PROPERTY_CUPERTINO is shown net of costs with the market rent as the benefit, whether it is received or simply avoided. SF cash flow is the net operating income from the two rented units; the owner-occupied unit is not valued as rent.',
      head: ['Property', 'Option', 'Cash flow at inheritance', 'Property tax at inheritance', 'NPV at ' + IY, 'Assessment'],
      rows: rows
    };
  }

  function buildReassessmentTable() {
    const IY = P.inheritYear;
    const rows = [];
    const c = IN.cupertino, s = IN.sf;
    const cBase = yearState('cupertino', IY, 'base');
    const cP19 = yearState('cupertino', IY, 'prop19');
    const cFull = yearState('cupertino', IY, 'full');
    const sBase = yearState('sf', IY, 'base');
    const sFull = yearState('sf', IY, 'full');
    const allowance = prop19Allowance(IY);

    rows.push([
      { v: 'PROPERTY_CUPERTINO', b: 'text' },
      { v: 'Market value in ' + IY, b: 'derived' },
      { v: usd0(cBase.fmv), b: 'derived' },
      { v: 'Base preserved — taxable value', b: 'derived' },
      { v: usd0(cBase.assessed), b: 'derived' },
      { v: usd0(cBase.tax), b: 'derived' },
      { v: '—', b: 'text' }
    ]);
    rows.push([
      { v: '', b: 'text' },
      { v: '', b: 'text' },
      { v: '', b: 'text' },
      { v: 'Prop 19 partial exclusion (allowance ' + usd0(allowance) + ')', b: 'derived' },
      { v: usd0(cP19.assessed), b: 'derived' },
      { v: usd0(cP19.tax), b: 'derived' },
      { v: '+' + usd0(cP19.tax - cBase.tax) + ' / yr', b: 'derived' }
    ]);
    rows.push([
      { v: '', b: 'text' },
      { v: '', b: 'text' },
      { v: '', b: 'text' },
      { v: 'Full reassessment to market value', b: 'derived' },
      { v: usd0(cFull.assessed), b: 'derived' },
      { v: usd0(cFull.tax), b: 'derived' },
      { v: '+' + usd0(cFull.tax - cBase.tax) + ' / yr', b: 'derived' }
    ]);
    rows.push([
      { v: 'PROPERTY_SF', b: 'text' },
      { v: 'Market value in ' + IY, b: 'derived' },
      { v: usd0(sBase.fmv), b: 'derived' },
      { v: 'Base preserved — taxable value', b: 'derived' },
      { v: usd0(sBase.assessed), b: 'derived' },
      { v: usd0(sBase.tax), b: 'derived' },
      { v: '—', b: 'text' }
    ]);
    rows.push([
      { v: '', b: 'text' },
      { v: '', b: 'text' },
      { v: '', b: 'text' },
      { v: 'Full reassessment (expected — no Prop 19 for a rental building)', b: 'derived' },
      { v: usd0(sFull.assessed), b: 'derived' },
      { v: usd0(sFull.tax), b: 'derived' },
      { v: '+' + usd0(sFull.tax - sBase.tax) + ' / yr', b: 'derived' }
    ]);

    return {
      title: 'Reassessment impact at an inheritance in ' + IY,
      note: 'The market values come from the owner\'s Nov-2026 estimates grown at ' + pct(P.appreciation, 1) + ' a year. The Prop 19 allowance is the BOE indexed figure (' + usd0(prop19Allowance(2025)) + ' for 2025-02-16 to 2027-02-15) grown at ' + pct(P.prop19AllowanceInfl, 1) + ' every two years to ' + IY + '. The Cupertino "base preserved" column uses an ILLUSTRATIVE starting assessed value — see flag F16.',
      head: ['Property', 'Measure', 'Value', 'Scenario', 'Taxable value', 'Property tax', 'Increase vs base'],
      rows: rows
    };
  }

  function buildCostTable(which) {
    const y = 2026;
    const c = which === 'cupertino' ? cupertinoCosts(y) : sfCosts(y);
    const tax = yearState(which, y, 'base').tax;
    const rows = [];
    const label = which === 'cupertino' ? 'PROPERTY_CUPERTINO' : 'PROPERTY_SF';
    const src = which === 'cupertino' ? 'sjwc-sched1' : 'sfpuc-rates';
    if (which === 'cupertino') {
      rows.push([{ v: 'Water (SJWC Schedule No. 1, 10 ccf/month)', b: 'text' }, { v: usd0(c.water), b: 'official' }, { v: src, b: 'text' }]);
      rows.push([{ v: 'Sewer (Cupertino Sanitary District flat charge)', b: 'text' }, { v: usd0(c.sewer), b: 'official' }, { v: 'csd-site', b: 'text' }]);
      rows.push([{ v: 'Electricity (net solar credit)', b: 'text' }, { v: usd0(c.electricity), b: 'owner' }, { v: 'pge-rate-advisory', b: 'text' }]);
      rows.push([{ v: 'Homeowners insurance', b: 'text' }, { v: usd0(c.insurance), b: 'assumption' }, { v: 'unverified — broker quote required', b: 'text' }]);
    } else {
      rows.push([{ v: 'Water (SFPUC Schedule W-1B)', b: 'text' }, { v: usd0(c.water), b: 'official' }, { v: src, b: 'text' }]);
      rows.push([{ v: 'Wastewater (SFPUC Schedule A)', b: 'text' }, { v: usd0(c.wastewater), b: 'official' }, { v: src, b: 'text' }]);
      rows.push([{ v: 'Stormwater (SFPUC Schedule D, tier 3)', b: 'text' }, { v: usd0(c.stormwater), b: 'official' }, { v: src, b: 'text' }]);
      rows.push([{ v: 'Electricity (PG&E rate, 3 units at average use)', b: 'text' }, { v: usd0(c.electricity), b: 'official' }, { v: 'pge-rate-advisory', b: 'text' }]);
      rows.push([{ v: 'Landlord insurance (DP-3)', b: 'text' }, { v: usd0(c.insurance), b: 'assumption' }, { v: 'unverified — broker quote required', b: 'text' }]);
    }
    rows.push([{ v: 'Repairs, maintenance and capital reserve', b: 'text' }, { v: usd0(c.maintenance), b: 'assumption' }, { v: 'planning assumption', b: 'text' }]);
    rows.push([{ v: 'Property tax (official rate on the assessed value)', b: 'text' }, { v: usd0(tax), b: 'derived' }, { v: which === 'cupertino' ? 'scc-assessor-booklet' : 'sftreasurer-secured', b: 'text' }]);
    const total = c.total + tax;
    rows.push([{ v: 'TOTAL annual holding cost, ' + label + ' (2026)', b: 'text' }, { v: usd0(total), b: 'derived' }, { v: '', b: 'text' }]);
    return {
      title: label + ' — total annual holding cost, 2026',
      note: 'Water, sewer, stormwater and electricity come from published rate schedules. Insurance and maintenance are planning assumptions (band in the assumptions table). The property tax line for PROPERTY_CUPERTINO uses the illustrative starting assessed value — see flag F16.',
      head: ['Cost line', '2026 amount', 'Basis / source'],
      rows: rows
    };
  }

  function buildSFNetTable() {
    const rows = [];
    const IY = P.inheritYear;
    ['2026', '2035', '2040', '2045', '2050'].forEach(function (y) {
      const base = yearState('sf', +y, 'base');
      const full = yearState('sf', +y, 'full');
      rows.push([
        { v: y, b: 'text' },
        { v: usd0(base.costs.rent), b: 'owner' },
        { v: usd0(base.costs.total), b: 'derived' },
        { v: usd0(base.tax), b: 'derived' },
        { v: usd0(base.net), b: 'derived' },
        { v: usd0(full.tax), b: 'derived' },
        { v: usd0(full.net), b: 'derived' }
      ]);
    });
    return {
      title: 'PROPERTY_SF — rental economics under the two tax outcomes',
      note: 'Net = gross rent from the two rented units less all operating costs and the property tax. The "full reassessment" column is what happens at death unless the trust preserves the base or the property somehow qualifies as the transferor\'s principal residence.',
      head: ['Year', 'Gross rent', 'Operating costs', 'Tax (base preserved)', 'NOI (base preserved)', 'Tax (reassessed)', 'NOI (reassessed)'],
      rows: rows
    };
  }

  /* ------------------------------------------------------------- page wiring */

  function renderStatic() {
    document.querySelectorAll('[data-table]').forEach(function (el) {
      const path = el.getAttribute('data-table');
      if (path.indexOf('dynamic:') === 0) return;
      renderTable(el, resolve(path));
    });

    // sources
    const srcHost = document.querySelector('[data-sources]');
    if (srcHost) {
      let h = '<ul class="src-list">';
      Object.keys(D.sources).forEach(function (k) {
        const s = D.sources[k];
        h += '<li><span class="sid">' + esc(k) + '</span> &middot; <strong>' + esc(s.t) + '</strong><br>'
          + esc(s.p) + ' &middot; accessed ' + esc(s.a) + '<br>'
          + '<a href="' + esc(s.u) + '" target="_blank" rel="noopener">' + esc(s.u) + '</a>'
          + (s.n ? '<br><small class="muted">' + esc(s.n) + '</small>' : '') + '</li>';
      });
      h += '</ul>';
      srcHost.innerHTML = h;
    }

    // process
    const procHost = document.querySelector('[data-process]');
    if (procHost) {
      let h = '';
      D.process.phases.forEach(function (ph) {
        h += '<h3>' + esc(ph.name) + '</h3><ol class="steps">';
        ph.steps.forEach(function (st) {
          h += '<li><h4>' + esc(st.h) + '</h4>'
            + '<div class="when"><span class="badge ' + st.b + '">' + BASIS_LABEL[st.b] + '</span> &middot; ' + esc(st.when)
            + (st.s ? ' &middot; ' + sourceChip(st.s) : '') + '</div>'
            + '<p class="small">' + esc(st.p) + '</p></li>';
        });
        h += '</ol>';
      });
      procHost.innerHTML = h;
    }

    // flags
    const flagHost = document.querySelector('[data-flags]');
    if (flagHost) {
      let h = '';
      D.flags.items.forEach(function (f) {
        h += '<div class="callout ' + (f.sev === 'high' ? 'critical' : (f.sev === 'medium' ? 'warning' : 'neutral')) + '">'
          + '<h4>' + esc(f.id) + ' &middot; ' + esc(f.area) + ' <span class="badge ' + (f.sev === 'high' ? 'unverified' : (f.sev === 'medium' ? 'owner' : 'pending')) + '">' + esc(f.sev) + '</span></h4>'
          + '<p><strong>' + esc(f.what) + '</strong></p>'
          + '<p class="small"><em>Why it matters:</em> ' + esc(f.why) + '</p>'
          + '<p class="small"><em>Action:</em> ' + esc(f.action) + (f.s ? ' ' + sourceChip(f.s) : '') + '</p>'
          + '</div>';
      });
      flagHost.innerHTML = h;
    }
  }

  function renderDynamic() {
    const map = {
      'dynamic:proj-cupertino-base': projectionTable('cupertino', 'base', 'PROPERTY_CUPERTINO — base preserved (assessed value grows at the Prop 13 2% cap)', 'Market value grows at ' + pct(P.appreciation, 1) + ' a year; the assessed value grows at the legal 2% cap; the tax is the official rate of 1.1488% applied to the assessed value. The starting assessed value is an illustrative placeholder — flag F16.'),
      'dynamic:proj-cupertino-full': projectionTable('cupertino', 'full', 'PROPERTY_CUPERTINO — full reassessment at the inheritance year (no Prop 19)', 'At the inheritance year the taxable value jumps to market value and then escalates at 2% a year.'),
      'dynamic:proj-sf-base': projectionTable('sf', 'base', 'PROPERTY_SF — base preserved (assessed value grows at the Prop 13 2% cap)', 'Market value grows at ' + pct(P.appreciation, 1) + ' a year; the tax uses the published FY2026-27 secured rate of 1.18162182%, held flat.'),
      'dynamic:proj-sf-full': projectionTable('sf', 'full', 'PROPERTY_SF — full reassessment at the inheritance year (the expected outcome)', 'A rental building is not the transferor\'s principal residence, so no Prop 19 exclusion is expected; the taxable value jumps to market value at the inheritance year.'),
      'dynamic:reassessment': buildReassessmentTable(),
      'dynamic:scenarios': buildScenarioTable(),
      'dynamic:cost-cupertino': buildCostTable('cupertino'),
      'dynamic:cost-sf': buildCostTable('sf'),
      'dynamic:sf-net': buildSFNetTable()
    };

    document.querySelectorAll('[data-table]').forEach(function (el) {
      const path = el.getAttribute('data-table');
      if (path.indexOf('dynamic:') !== 0) return;
      renderTable(el, map[path]);
    });

    // charts
    const years = []; for (let y = 2026; y <= 2050; y++) years.push(y);
    const cupBase = series('cupertino', 'base', 2026, 2050);
    const cupFull = series('cupertino', 'full', 2026, 2050);
    const sfBase = series('sf', 'base', 2026, 2050);
    const sfFull = series('sf', 'full', 2026, 2050);

    const chartMap = {
      'chart:cupertino-tax': {
        xs: years, yMin: 0, fmtY: function (v) { return '$' + nf(v / 1000) + 'k'; },
        alt: 'Cupertino annual property tax, base preserved compared with full reassessment',
        series: [
          { name: 'Tax if the base is preserved', color: '#14653d', pts: cupBase.map(function (p) { return { x: p.year, y: p.tax }; }) },
          { name: 'Tax if reassessed to market value at ' + P.inheritYear, color: '#9a1c1c', dash: true, pts: cupFull.map(function (p) { return { x: p.year, y: p.tax }; }) }
        ]
      },
      'chart:sf-tax': {
        xs: years, yMin: 0, fmtY: function (v) { return '$' + nf(v / 1000) + 'k'; },
        alt: 'San Francisco annual property tax, base preserved compared with full reassessment',
        series: [
          { name: 'Tax if the base is preserved', color: '#14653d', pts: sfBase.map(function (p) { return { x: p.year, y: p.tax }; }) },
          { name: 'Tax if reassessed to market value at ' + P.inheritYear, color: '#9a1c1c', dash: true, pts: sfFull.map(function (p) { return { x: p.year, y: p.tax }; }) }
        ]
      },
      'chart:sf-noi': {
        xs: years, fmtY: function (v) { return '$' + nf(v / 1000) + 'k'; },
        alt: 'San Francisco net operating income under both tax outcomes',
        series: [
          { name: 'NOI — base preserved', color: '#0f766e', pts: sfBase.map(function (p) { return { x: p.year, y: p.net }; }) },
          { name: 'NOI — full reassessment', color: '#9a1c1c', dash: true, pts: sfFull.map(function (p) { return { x: p.year, y: p.net }; }) }
        ]
      },
      'chart:cupertino-value': {
        xs: years, yMin: 0, fmtY: function (v) { return '$' + nf(v / 1000000, 1) + 'M'; },
        alt: 'Cupertino market value projection',
        series: [
          { name: 'Market value', color: '#12507c', pts: cupBase.map(function (p) { return { x: p.year, y: p.fmv }; }) }
        ]
      },
      'chart:sf-value': {
        xs: years, yMin: 0, fmtY: function (v) { return '$' + nf(v / 1000000, 1) + 'M'; },
        alt: 'San Francisco market value projection',
        series: [
          { name: 'Market value', color: '#0f766e', pts: sfBase.map(function (p) { return { x: p.year, y: p.fmv }; }) }
        ]
      }
    };

    document.querySelectorAll('[data-chart]').forEach(function (el) {
      const cfg = chartMap[el.getAttribute('data-chart')];
      if (cfg) renderChart(el, cfg);
    });

    // KPI tiles
    const kpiHost = document.querySelector('[data-kpis]');
    if (kpiHost) {
      const IY = P.inheritYear;
      const cBase = yearState('cupertino', IY, 'base');
      const cFull = yearState('cupertino', IY, 'full');
      const sBase = yearState('sf', IY, 'base');
      const sFull = yearState('sf', IY, 'full');
      const cNow = yearState('cupertino', 2026, 'base');
      const sNow = yearState('sf', 2026, 'base');
      const tiles = [
        { l: 'PROPERTY_CUPERTINO market value', v: usd0(IN.cupertino.marketValue2026), n: 'Owner estimate, Nov 2026', c: '' },
        { l: 'Cupertino property tax, ' + IY, v: usd0(cBase.tax), n: 'If the assessed value is preserved', c: 'good' },
        { l: 'Cupertino property tax, ' + IY, v: usd0(cFull.tax), n: 'If reassessed to market value (+' + usd0(cFull.tax - cBase.tax) + ')', c: 'bad' },
        { l: 'PROPERTY_SF market value', v: usd0(IN.sf.marketValue2026), n: 'Owner estimate, Nov 2026', c: '' },
        { l: 'San Francisco property tax, ' + IY, v: usd0(sFull.tax), n: 'Expected full reassessment (+' + usd0(sFull.tax - sBase.tax) + ' vs base preserved)', c: 'bad' },
        { l: 'San Francisco NOI, ' + IY, v: usd0(sFull.net), n: 'If reassessed — down from ' + usd0(sBase.net) + ' if preserved', c: 'warn' }
      ];
      let h = '<div class="grid cols-3">';
      tiles.forEach(function (t) {
        h += '<div class="kpi ' + t.c + '"><div class="k-label">' + esc(t.l) + '</div><div class="k-value">' + esc(t.v) + '</div><div class="k-note">' + esc(t.n) + '</div></div>';
      });
      h += '</div>';
      kpiHost.innerHTML = h;
    }

    // headline numbers inside prose
    document.querySelectorAll('[data-num]').forEach(function (el) {
      const key = el.getAttribute('data-num');
      const IY = P.inheritYear;
      let v = '';
      if (key === 'cup-tax-base') v = usd0(yearState('cupertino', IY, 'base').tax);
      else if (key === 'cup-tax-full') v = usd0(yearState('cupertino', IY, 'full').tax);
      else if (key === 'cup-tax-prop19') v = usd0(yearState('cupertino', IY, 'prop19').tax);
      else if (key === 'cup-fmv') v = usd0(yearState('cupertino', IY, 'base').fmv);
      else if (key === 'sf-tax-base') v = usd0(yearState('sf', IY, 'base').tax);
      else if (key === 'sf-tax-full') v = usd0(yearState('sf', IY, 'full').tax);
      else if (key === 'sf-fmv') v = usd0(yearState('sf', IY, 'base').fmv);
      else if (key === 'sf-noi-base') v = usd0(yearState('sf', IY, 'base').net);
      else if (key === 'sf-noi-full') v = usd0(yearState('sf', IY, 'full').net);
      else if (key === 'sf-noi-now') v = usd0(yearState('sf', 2026, 'base').net);
      else if (key === 'cup-tax-now') v = usd0(yearState('cupertino', 2026, 'base').tax);
      else if (key === 'sf-tax-now') v = usd0(yearState('sf', 2026, 'base').tax);
      else if (key === 'inherit-year') v = String(IY);
      else if (key === 'prop19-allowance') v = usd0(prop19Allowance(IY));
      else if (key === 'cup-cost-now') v = usd0(cupertinoCosts(2026).total + yearState('cupertino', 2026, 'base').tax);
      else if (key === 'sf-cost-now') v = usd0(sfCosts(2026).total + yearState('sf', 2026, 'base').tax);
      if (v) el.innerHTML = '<strong>' + v + '</strong>';
    });
  }

  /* ------------------------------------------------------------- controls UI */

  function wireControls() {
    const host = document.querySelector('[data-controls]');
    if (!host) return;

    function control(label, help, inner) {
      return '<div class="control"><label>' + esc(label) + '</label>' + inner
        + (help ? '<div class="chelp">' + esc(help) + '</div>' : '') + '</div>';
    }

    let h = '';
    h += control('Inheritance year', 'Drives every value, tax and NPV on this page.',
      '<input type="range" id="c-inherit" min="2040" max="2050" step="1" value="' + P.inheritYear + '"><div class="cval" id="v-inherit">' + P.inheritYear + '</div>');
    h += control('Home-value appreciation', 'Planning assumption — 2.5% to 4.5%.',
      '<input type="range" id="c-app" min="0.025" max="0.045" step="0.0025" value="' + P.appreciation + '"><div class="cval" id="v-app">' + pct(P.appreciation, 2) + '</div>');
    h += control('Discount rate', 'Nominal, for NPV comparisons.',
      '<input type="range" id="c-disc" min="0.03" max="0.08" step="0.005" value="' + P.discount + '"><div class="cval" id="v-disc">' + pct(P.discount, 1) + '</div>');
    h += control('Return if sold and reinvested', 'Nominal blended return on the proceeds.',
      '<input type="range" id="c-port" min="0.03" max="0.09" step="0.005" value="' + P.portfolioReturn + '"><div class="cval" id="v-port">' + pct(P.portfolioReturn, 1) + '</div>');
    h += control('Market rent if Cupertino is rented', 'No official source publishes parcel rents. Owner input.',
      '<input type="number" id="c-rent" min="0" step="100" value="' + P.cupertinoRent + '"><div class="cval" id="v-rent">$' + nf(P.cupertinoRent) + ' / month</div>');
    h += control('Tax on a post-death capital gain', '20% federal alone, or 33.3% federal plus California, or 37.1% with the NIIT.',
      '<select id="c-gain"><option value="0.2">20.0% — federal only</option><option value="0.333" selected>33.3% — federal + California</option><option value="0.371">37.1% — federal + California + NIIT</option></select>');
    h += control('NPV horizon after the inheritance', 'Years held or invested before the comparison.',
      '<input type="range" id="c-hor" min="5" max="30" step="1" value="' + P.horizon + '"><div class="cval" id="v-hor">' + P.horizon + ' years</div>');
    h += control('Reset', 'Restore the base case.', '<button id="c-reset" type="button" style="padding:6px 14px;border:1px solid #c3ccd9;border-radius:6px;background:#fff;cursor:pointer;">Reset to base case</button>');
    host.innerHTML = h;

    function bind(id, key, fmt, parse) {
      const el = document.getElementById(id);
      const out = document.getElementById('v-' + id.slice(2));
      el.addEventListener('input', function () {
        P[key] = parse ? parse(el.value) : parseFloat(el.value);
        out.innerHTML = fmt(P[key]);
        renderDynamic();
      });
    }

    bind('c-inherit', 'inheritYear', function (v) { return v; });
    bind('c-app', 'appreciation', function (v) { return pct(v, 2); });
    bind('c-disc', 'discount', function (v) { return pct(v, 1); });
    bind('c-port', 'portfolioReturn', function (v) { return pct(v, 1); });
    bind('c-rent', 'cupertinoRent', function (v) { return '$' + nf(v) + ' / month'; });
    bind('c-hor', 'horizon', function (v) { return v + ' years'; });

    const gain = document.getElementById('c-gain');
    gain.addEventListener('change', function () { P.gainTaxRate = parseFloat(gain.value); renderDynamic(); });

    document.getElementById('c-reset').addEventListener('click', function () {
      P.inheritYear = 2045; P.appreciation = 0.035; P.discount = 0.05; P.portfolioReturn = 0.06;
      P.cupertinoRent = 5500; P.gainTaxRate = 0.333; P.horizon = 20;
      document.getElementById('c-inherit').value = 2045;
      document.getElementById('c-app').value = 0.035;
      document.getElementById('c-disc').value = 0.05;
      document.getElementById('c-port').value = 0.06;
      document.getElementById('c-rent').value = 5500;
      document.getElementById('c-hor').value = 20;
      document.getElementById('c-gain').value = '0.333';
      document.getElementById('v-inherit').textContent = '2045';
      document.getElementById('v-app').textContent = pct(0.035, 2);
      document.getElementById('v-disc').textContent = pct(0.05, 1);
      document.getElementById('v-port').textContent = pct(0.06, 1);
      document.getElementById('v-rent').textContent = '$' + nf(5500) + ' / month';
      document.getElementById('v-hor').textContent = '20 years';
      renderDynamic();
    });
  }

  /* ------------------------------------------------------------------- init */

  function init() {
    // nav
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a').forEach(function (a) {
      const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
      if (href === here) a.classList.add('active');
    });
    // footers
    const y = document.querySelector('[data-year]');
    if (y) y.textContent = D.meta.asOf;

    renderStatic();
    wireControls();
    renderDynamic();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }

  // expose for the verification script / console
  window.__MODEL = { P: P, IN: IN, yearState: yearState, series: series, holdNPV: holdNPV, sellNPV: sellNPV, usd: usd, pct: pct };
})();
