/* ==========================================================================
   tools/smoke.js — headless smoke test for the dashboard renderer
   --------------------------------------------------------------------------
   Builds a minimal fake DOM, loads the real data.js and app.js, lets init()
   run, and then asserts that every table, chart, list and live number was
   actually produced. It catches runtime errors, empty tables and stray
   "undefined" values that a link check cannot see.

   Usage:  node tools/smoke.js
   Exit code 0 = smoke test passed.
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const DOCS = path.join(ROOT, 'docs');
const PAGES = fs.readdirSync(DOCS).filter(function (f) { return /\.html$/.test(f); });

/* ----------------------------------------------------------- fake DOM ---- */

const registry = [];

function makeEl(attrs) {
  const el = {
    attrs: attrs || {},
    innerHTML: '',
    textContent: '',
    value: '',
    getAttribute: function (k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; },
    addEventListener: function () {},
    classList: { add: function () {} }
  };
  registry.push(el);
  return el;
}

function collect(selector) {
  const out = [];
  registry.forEach(function (el) {
    Object.keys(el.attrs).forEach(function (k) {
      if (selector === '[' + k + ']') {
        if (Object.prototype.hasOwnProperty.call(el.attrs, k)) out.push(el);
      }
    });
  });
  return out;
}

global.window = global;
global.location = { pathname: '/index.html' };
global.document = {
  readyState: 'complete',
  querySelectorAll: function (sel) { return collect(sel); },
  querySelector: function (sel) { return collect(sel)[0] || null; },
  getElementById: function () { return makeEl({ id: 'x' }); },
  addEventListener: function () {}
};

/* --------------------------------------------- build the expected DOM ---- */

const tablePaths = new Set();
const chartPaths = new Set();
PAGES.forEach(function (page) {
  const html = fs.readFileSync(path.join(DOCS, page), 'utf8');
  let m;
  const re = /data-table="([^"]+)"/g;
  while ((m = re.exec(html)) !== null) tablePaths.add(m[1]);
  const re2 = /data-chart="([^"]+)"/g;
  while ((m = re2.exec(html)) !== null) chartPaths.add(m[1]);
});

const tableEls = {};
tablePaths.forEach(function (p) { tableEls[p] = makeEl({ 'data-table': p }); });
chartPaths.forEach(function (p) { makeEl({ 'data-chart': p }); });
makeEl({ 'data-sources': '' });
makeEl({ 'data-process': '' });
makeEl({ 'data-flags': '' });
makeEl({ 'data-kpis': '' });
['inherit-year', 'cup-tax-base', 'cup-tax-full', 'cup-tax-prop19', 'cup-fmv', 'sf-tax-base',
  'sf-tax-full', 'sf-fmv', 'sf-noi-base', 'sf-noi-full', 'sf-noi-now', 'cup-tax-now',
  'sf-tax-now', 'prop19-allowance', 'cup-cost-now', 'sf-cost-now'].forEach(function (k) {
  makeEl({ 'data-num': k });
});

/* ------------------------------------------------------------- run it ---- */

require(path.join(DOCS, 'assets/js/data.js'));
require(path.join(DOCS, 'assets/js/app.js'));

const D = global.DATA;

/* ------------------------------------------------------------- asserts --- */

const problems = [];
function check(cond, msg) { if (!cond) problems.push(msg); }

tablePaths.forEach(function (p) {
  const html = tableEls[p].innerHTML;
  const label = 'table "' + p + '"';
  if (html.indexOf('<table') === -1) { problems.push(label + ' produced no table'); return; }
  if (html.indexOf('undefined') !== -1) problems.push(label + ' contains "undefined"');
  if (html.indexOf('NaN') !== -1) problems.push(label + ' contains "NaN"');
  if (html.indexOf('[object Object]') !== -1) problems.push(label + ' contains "[object Object]"');
  const rows = (html.match(/<tr>/g) || []).length;
  if (rows < 2) problems.push(label + ' has no data rows');
});

chartPaths.forEach(function (p) {
  const el = registry.filter(function (e) { return e.getAttribute('data-chart') === p; })[0];
  const html = el ? el.innerHTML : '';
  if (html.indexOf('<svg') === -1) problems.push('chart "' + p + '" produced no SVG');
  if (html.indexOf('NaN') !== -1) problems.push('chart "' + p + '" contains "NaN"');
});

registry.forEach(function (el) {
  if (el.getAttribute('data-num')) {
    if (!el.innerHTML) problems.push('live number "' + el.getAttribute('data-num') + '" was not filled');
    if (el.innerHTML.indexOf('undefined') !== -1) problems.push('live number "' + el.getAttribute('data-num') + '" contains "undefined"');
  }
  if (el.getAttribute('data-flags') !== null) {
    const n = (el.innerHTML.match(/class="callout/g) || []).length;
    if (n !== D.flags.items.length) problems.push('flag list rendered ' + n + ' of ' + D.flags.items.length + ' flags');
  }
  if (el.getAttribute('data-sources') !== null) {
    const n = (el.innerHTML.match(/<li>/g) || []).length;
    if (n !== Object.keys(D.sources).length) problems.push('source list rendered ' + n + ' of ' + Object.keys(D.sources).length + ' sources');
  }
  if (el.getAttribute('data-process') !== null) {
    const n = (el.innerHTML.match(/<li>/g) || []).length;
    if (n < 15) problems.push('process list rendered only ' + n + ' steps');
  }
  if (el.getAttribute('data-kpis') !== null) {
    const n = (el.innerHTML.match(/class="kpi/g) || []).length;
    if (n < 6) problems.push('KPI block rendered ' + n + ' tiles');
  }
});

/* --------------------------------------------------------------- report -- */

if (problems.length) {
  console.error('SMOKE TEST FAILED');
  problems.forEach(function (p) { console.error('  FAIL  ' + p); });
  process.exit(1);
}
console.log('  smoke test: ' + tablePaths.size + ' tables, ' + chartPaths.size +
  ' charts, ' + Object.keys(D.sources).length + ' sources, ' +
  D.flags.items.length + ' flags rendered cleanly');
