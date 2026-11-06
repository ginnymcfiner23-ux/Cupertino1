/* ==========================================================================
   Inheritance Decision Dashboard — DATASET
   --------------------------------------------------------------------------
   Rules applied to this file (from the project brief):
     * No personal information. Placeholders only: OWNER, PROPERTY_CUPERTINO,
       PROPERTY_SF, HEIR_A, HEIR_B.
     * Every published value carries a basis tag and, where it is an official
       figure, a source key that resolves to a .gov / official-rate source.
     * A value that could not be confirmed from an official source is left
       BLANK and flagged (see DATA.flags).
   ========================================================================== */

window.DATA = (function () {
  'use strict';

  /* ---------------------------------------------------------------- sources */
  const sources = {
    'irs-estate': {
      t: 'Estate Tax',
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/businesses/small-businesses-self-employed/estate-tax',
      a: '2026-11-06',
      n: '2026 basic exclusion amount and portability (Form 706).'
    },
    'irs-whatsnew': {
      t: "What's new — Estate and gift tax",
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax',
      a: '2026-11-06',
      n: 'P.L. 119-21 (OBBBA) set the 2026 §2010(c)(3) basic exclusion at $15,000,000.'
    },
    'irs-rp-25-32': {
      t: 'Rev. Proc. 2025-32 — 2026 inflation-adjusted items',
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
      a: '2026-11-06',
      n: '§4.14 basic exclusion $15,000,000; §4.42(1) annual gift exclusion $19,000; §4.01 tax rate tables; §4.03 capital-gain rate brackets; §4.31 excess business loss threshold.'
    },
    'irs-gift': {
      t: 'Gift tax',
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/businesses/small-businesses-self-employed/gift-tax',
      a: '2026-11-06',
      n: 'Form 709 / 709-NA filing thresholds and gift-tax mechanics.'
    },
    'irs-tc409': {
      t: 'Topic no. 409 — Capital gains and losses',
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/taxtopics/tc409',
      a: '2026-11-06',
      n: 'Long-term capital-gain rate structure; inherited basis via Publication 551.'
    },
    'irs-tc559': {
      t: 'Topic no. 559 — Net investment income tax',
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/taxtopics/tc559',
      a: '2026-11-06',
      n: 'NIIT 3.8% and MAGI thresholds; real-estate gains and rents are net investment income.'
    },
    'irs-i706': {
      t: 'Instructions for Form 706 (2026) — estate tax',
      p: 'Internal Revenue Service',
      u: 'https://www.irs.gov/instructions/i706',
      a: '2026-11-06',
      n: 'Portability election mechanics and 2026 amounts.'
    },
    'crs-r48183': {
      t: 'CRS Report R48183 — the federal estate tax after the 2025 law changes',
      p: 'Congressional Research Service',
      u: 'https://www.congress.gov/crs-product/R48183',
      a: '2026-11-06',
      n: 'Permanent $15,000,000 unified exclusion, indexed from 2027; 40% top rate; no extension of the §1014 basis step-up.'
    },
    'ca-rtc-13301': {
      t: 'Cal. Rev. & Tax. Code §13301 — Prohibition of gift and death taxes',
      p: 'California Legislature (leginfo)',
      u: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=RTC&sectionNum=13301.',
      a: '2026-11-06',
      n: '"Neither the state nor any political subdivision … shall impose any gift, inheritance, succession, legacy, income, or estate tax … on or by reason of any transfer occurring by reason of a death." Part 8 heading: Prohibition of Gift and Death Taxes [13301-14302].'
    },
    'ca-rtc-62': {
      t: 'Cal. Rev. & Tax. Code §62 — change in ownership',
      p: 'California Legislature (leginfo)',
      u: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=RTC&sectionNum=62.',
      a: '2026-11-06',
      n: '§62(d): transfer to a trust that is revocable or in which the trustor is a present beneficiary is NOT a change of ownership; trustee→trustor transfer back is excluded.'
    },
    'ca-rtc-63-2': {
      t: 'Cal. Rev. & Tax. Code §63.2 — generational transfer exclusion (Prop 19)',
      p: 'California Legislature (leginfo)',
      u: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=RTC&sectionNum=63.2',
      a: '2026-11-06',
      n: 'Principal-residence requirement, 1-year occupancy and exemption filing, BOE-266 / BOE-19-P claim within 3 years, §63.2(e)(9) trust transfers.'
    },
    'ca-rtc-110-1': {
      t: 'Cal. Rev. & Tax. Code §110.1 — base year value, factored base year value',
      p: 'California Legislature (leginfo)',
      u: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=RTC&sectionNum=110.1',
      a: '2026-11-06',
      n: 'Inflation adjustment of the factored base year value.'
    },
    'ca-rtc-11911': {
      t: 'Cal. Rev. & Tax. Code §11911 — Documentary Transfer Tax Act',
      p: 'California Legislature (leginfo)',
      u: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=RTC&sectionNum=11911.',
      a: '2026-11-06',
      n: 'County rate $0.55 per $500 of consideration ($1.10 per $1,000) when consideration exceeds $100.'
    },
    'boe-prop19': {
      t: 'Proposition 19 — Parent-Child and Grandparent-Grandchild Property Tax Exclusion',
      p: 'California State Board of Equalization',
      u: 'https://www.boe.ca.gov/prop19/',
      a: '2026-11-06',
      n: 'Value limit = current taxable value + indexed $1,000,000; principal residence only; 1-year occupancy; 3-year claim; Prop 60/90/110 and Prop 50/171 charts.'
    },
    'boe-pub801': {
      t: 'Publication 801 — Property Tax Assessment and Appeal (Prop 19 allowance schedule)',
      p: 'California State Board of Equalization',
      u: 'https://www.boe.ca.gov/pdf/pub801.pdf',
      a: '2026-11-06',
      n: 'Prop 19 allowance: $1,000,000 / $1,022,600 / $1,044,586; next adjustment 2027-02-16.'
    },
    'boe-lta-80-25': {
      t: 'Legal Letter Advice 80/25 — changes in ownership: trusts',
      p: 'California State Board of Equalization',
      u: 'https://www.boe.ca.gov/proptaxes/pdf/80-25.pdf',
      a: '2026-11-06',
      n: 'Vesting of an interest in a non-trustor/non-spouse beneficiary when a revocable trust becomes irrevocable IS a change of ownership; trust termination is a change of ownership.'
    },
    'boe-lo-2200791': {
      t: 'Legal Opinion 220.0791 — distribution from a parents\' trust to a child',
      p: 'California State Board of Equalization',
      u: 'https://www.boe.ca.gov/proptaxes/pdf/220_0791.pdf',
      a: '2026-11-06',
      n: 'Termination of a parents\' trust with distribution to a child is a parent→child transfer subject to Prop 19.'
    },
    'leginfo-sb974': {
      t: 'SB 974 (Seyarto) — special needs trusts as an eligible medium of transfer, Stats. 2026 ch. 665',
      p: 'California Legislature (leginfo)',
      u: 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB974',
      a: '2026-11-06',
      n: 'Approved by the Governor 2026-09-27; amends R&T §63.2(e)(9); effective 2027-01-01; no projected revenue impact.'
    },
    'scc-assessor-booklet': {
      t: 'Assessment Information for the Santa Clara County Property Owner (2026)',
      p: 'Santa Clara County Office of the Assessor',
      u: 'https://files.santaclaracounty.gov/exjcpb1521/2026-04/assessment-information-2026-booklet-english-3-23-26-web.pdf',
      a: '2026-11-06',
      n: 'Prop 13 1% + bonds; 2%/yr base growth; "typical Tax Rate Area … total = $1.1488"; reassessment on inheritance occurs as of the date of death; trust recording terminates the homeowners\' exemption; lien date and installment dates.'
    },
    'scc-taxratebook': {
      t: 'Tax Rate Book FY2025-26 (Section I: Compilation of Tax Rates; Section III: Tax Rate Areas)',
      p: 'Santa Clara County Controller-Treasurer',
      u: 'https://files.santaclaracounty.gov/exjcpb1531/2025-11/tax-rate-book-2025-2026.pdf',
      a: '2026-11-06',
      n: 'Per-TRA rate detail for 816 TRAs; lien date Jan 1; installments Nov 1 / Feb 1; late penalties Dec 10 / Apr 10; supplemental bills under SB 813.'
    },
    'sftreasurer-secured': {
      t: 'Secured Property Taxes',
      p: 'San Francisco Treasurer & Tax Collector',
      u: 'https://sftreasurer.org/property/secured-property-taxes',
      a: '2026-11-06',
      n: 'FY2026-27 secured rate 1.18162182%; bills mailed in October; two installments (due 2026-12-10 and 2027-04-10); supplemental / escape assessments.'
    },
    'sf-legistar-rate': {
      t: 'File 14779286 — FY2025-26 and FY2024-25 secured property tax rates',
      p: 'San Francisco Board of Supervisors (Legistar)',
      u: 'https://sfgov.legistar.com/View.ashx?GUID=AC93184C-32A4-4DA1-887D-09FC319785E7&ID=14779286&M=F',
      a: '2026-11-06',
      n: 'FY2025-26 combined rate 1.18268325%; FY2024-25 1.17143563%.'
    },
    'sf-gov-transfer-tax': {
      t: 'Transfer tax',
      p: 'City & County of San Francisco',
      u: 'https://www.sf.gov/transfer-tax',
      a: '2026-11-06',
      n: 'Tiered transfer tax: $2.50 / $3.40 / $3.75 / $11.25 / $27.50 / $30.00 per $500 of consideration; transfer tax affidavit and Preliminary Change of Ownership Report required.'
    },
    'sf-assessor-recorder': {
      t: 'Fees to record a document in San Francisco',
      p: 'San Francisco Assessor-Recorder',
      u: 'https://www.sf.gov/reports--march-2024--fees-record-document-san-francisco',
      a: '2026-11-06',
      n: 'Same transfer-tax tier table; recording fees collected with the deed.'
    },
    'sfpuc-rates': {
      t: 'FY2026-27 Water and Sewer Rate Schedules (effective 2026-07-01)',
      p: 'San Francisco Public Utilities Commission',
      u: 'https://www.sfpuc.gov/sites/default/files/accounts-and-services/Rates_Schedule_Water_Sewer_2026-7.pdf',
      a: '2026-11-06',
      n: 'W-1A single-family and W-1B multi-family water service charges and quantity charges; Schedule A residential wastewater; Schedule B non-residential; Schedule C standard stormwater; Schedule D simplified residential stormwater.'
    },
    'sjwc-sched1': {
      t: 'CPUC Schedule No. 1 — General Metered Service (Advice No. 596, effective 2023-07-01)',
      p: 'San Jose Water Company (CPUC tariff)',
      u: 'https://www.sjwater.com/media/l3qkhbrv/schedule-1-july-1-596.pdf',
      a: '2026-11-06',
      n: 'Service territory includes "portions of Cupertino". Service charge $53.02/month (5/8"-3/4"); quantity $4.7350 / $6.5241 / $9.7578 per 100 cu ft; $1.45/month WRAP surcharge plus SDRF surcharges.'
    },
    'csd-site': {
      t: 'Cupertino Sanitary District — rates and notices',
      p: 'Cupertino Sanitary District',
      u: 'https://www.cupertinosanitarydistrict.org/',
      a: '2026-11-06',
      n: 'Serves 23,000+ customers; FY2026-27 rate hearing 2026-05-20 with an increase capped at 5% effective 2026-07-01; FY2025-26 single-family charge ≈ $802.14 per unit per year collected on the property-tax bill.'
    },
    'cupertino-bulletin': {
      t: 'City of Cupertino bulletin — three separate water systems in Cupertino',
      p: 'City of Cupertino',
      u: 'https://content.govdelivery.com/accounts/CACUPERTINO/bulletins/3139232',
      a: '2026-11-06',
      n: 'City-owned Cupertino Water System (leased to SJWC), California Water Service (north-east), San Jose Water Company (south-east). There is no Cupertino Water District.'
    },
    'pge-rate-advisory': {
      t: 'Electric Rate Advisory (3/2026)',
      p: 'Pacific Gas & Electric',
      u: 'https://www.pge.com/assets/pge/docs/account/rate-plans/electric-rate-advisory-0326.pdf',
      a: '2026-11-06',
      n: 'Residential bundled non-CARE average 40.60 ¢/kWh effective 2026-03-01 (41.46 ¢ from 2026-01-01; 44.36 ¢ from 2025-09-01); average 500 kWh bill $203.54/month.'
    },
    'ftb-2026-schedules': {
      t: '2026 California Tax Rate Schedules (Form 540)',
      p: 'California Franchise Tax Board',
      u: 'https://www.ftb.ca.gov/forms/2026/2026-540-tax-rate-schedules.pdf',
      a: '2026-11-06',
      n: 'Schedules X, Y and Z: California individual income tax 1%-12.3%.'
    },
    'ftb-index': {
      t: 'Tax calculator, tables and rates',
      p: 'California Franchise Tax Board',
      u: 'https://www.ftb.ca.gov/file/personal/tax-calculator-tables-rates.asp',
      a: '2026-11-06',
      n: 'Official index of California tax tables and rate schedules by year (page last updated 2026-01-02).'
    },
    'sf-build-act': {
      t: 'File 260178 — BUILD Act (transfer-tax amendment)',
      p: 'San Francisco Board of Supervisors (Legistar)',
      u: 'https://sfgov.legistar.com/gateway.aspx?m=l&id=43473',
      a: '2026-11-06',
      n: 'Introduced 2026-03-24; would reduce the top transfer-tax tiers. Pending as of the build date.'
    },
    'scc-parcel-lookup': {
      t: 'Property search / assessed value lookup',
      p: 'Santa Clara County Office of the Assessor',
      u: 'https://www.sccassessor.org/',
      a: '2026-11-06',
      n: 'Official parcel lookup used to confirm the tax rate area and assessed value.'
    },
    'sf-parcel-lookup': {
      t: 'Property tax payment portal (assessed value and tax rate lookup)',
      p: 'San Francisco Treasurer & Tax Collector',
      u: 'https://sftreasurer.org/payments/property-tax-payment',
      a: '2026-11-06',
      n: 'Official parcel search showing assessed value, tax rate and the ad valorem taxes line.'
    },
    'ca-doi': {
      t: 'California Department of Insurance — consumer information',
      p: 'California Department of Insurance',
      u: 'https://www.insurance.ca.gov/',
      a: '2026-11-06',
      n: 'Regulator for the FAIR Plan and for admitted-market homeowners and landlord policies.'
    }
  };

  /* --------------------------------------------------------------- helpers */
  const O = (v, s, note) => ({ v: v, b: 'official', s: s, n: note || '' });          // official value
  const W = (v, s, note) => ({ v: v, b: 'owner', s: s, n: note || '' });             // owner-provided
  const A = (v, s, note) => ({ v: v, b: 'assumption', s: s, n: note || '' });       // planning assumption
  const U = (s, note) => ({ v: null, b: 'unverified', s: s, n: note || '' });        // blank + flagged
  const P = (v, s, note) => ({ v: v, b: 'pending', s: s, n: note || '' });           // pending / watch
  const D = (v, s, note) => ({ v: v, b: 'derived', s: s, n: note || '' });           // derived from owner data
  const T = (t) => ({ v: t, b: 'text' });                                             // plain text cell

  /* ====================================================================== */
  /*  PROPERTY_1 — Cupertino (ZIP 95014)                                     */
  /* ====================================================================== */

  const cupertino = {
    key: 'PROPERTY_CUPERTINO',
    label: 'Cupertino house (95014)',
    shortLabel: 'Cupertino',
    type: 'Single-family house, owner-occupied today',
    color: '#12507c',

    facts: {
      title: 'PROPERTY_CUPERTINO — core facts',
      head: ['Item', 'Value', 'Basis', 'Source / note'],
      rows: [
        [T('Street address'), T('Withheld (PROPERTY_CUPERTINO)'), T('—'), T('Privacy rule: no address, APN or account number is published.')],
        [T('ZIP code'), W('95014', null, 'Owner-provided.'), T('owner'), T('Owner-provided.')],
        [T('Property type'), W('Single-family house', null, 'Owner-provided.'), T('owner'), T('Owner-provided.')],
        [T('Estimated market value (Nov 2026)'), W('$3,100,000', null, 'Owner-provided valuation; not confirmed by an official source.'), T('owner'), T('No official source publishes a parcel value; must be re-confirmed by appraisal at the time of use.')],
        [T('Occupancy today'), W('Owner-occupied as primary residence', null, 'Owner-provided.'), T('owner'), T('Determines whether Prop 19 could ever apply at death. See inheritance-taxes.html.')],
        [T('Solar photovoltaic system'), W('Installed; property normally generates a credit and is usually net-zero for electricity', null, 'Owner-provided.'), T('owner'), T('The value of the credit depends on the interconnection date and the applicable net-energy-metering tariff — see flag F13.')],
        [T('Water service'), W('~ $100-150 / month', null, 'Owner-provided observation.'), T('owner'), T('Cupertino is served by three separate water systems; the parcel\'s provider must be identified. See flag F7.')],
        [T('Sewer / wastewater service'), O('Cupertino Sanitary District', 'csd-site', 'Flat charge collected on the property-tax bill; not an ad valorem tax.'), T('official'), T('FY2026-27 per-unit rate not yet published — see flag F8.')],
        [T('Electric service'), O('PG&E', 'pge-rate-advisory', 'Residential bundled non-CARE average 40.60 ¢/kWh effective 2026-03-01.'), T('official'), T('Net-metering export treatment not confirmed — see flag F13.')],
        [T('Homeowners insurance'), U('ca-doi', 'No address-specific premium is published by any official source. Leave blank; obtain a broker quote (HO-3).'), T('unverified'), T('CA FAIR Plan is the fallback if an admitted carrier declines; FAIR Plan limits were not confirmed from an official page at build time. See flag F9.')],
        [T('Maintenance & repair'), W('Lower than PROPERTY_SF', null, 'Owner-provided comparative judgement.'), T('owner'), T('Quantified in the operating-costs page on a planning-assumption basis.')],
        [T('Water provider (unknown)'), U('cupertino-bulletin', 'City-owned Cupertino Water System (leased to SJWC) | San Jose Water Company (south-east) | California Water Service (north-east). Identify the parcel\'s provider, meter size and SDRF surcharge.'), T('unverified'), T('There is no "Cupertino Water District" — confirmed against the City of Cupertino.')]
      ]
    },

    officialTax: {
      title: 'PROPERTY_CUPERTINO — ad valorem tax rate build-up (FY2025-26)',
      note: 'Santa Clara County is divided into more than 800 tax rate areas, each with a unique combination of taxing agencies and special assessments. The parcel-specific TRA total was NOT located during this build; the base case therefore uses the County Assessor\'s published "typical Tax Rate Area" total of $1.1488 per $100 of assessed value, with the observed TRA range as a sensitivity band. See flag F5.',
      head: ['Component', 'Per $100 of assessed value', 'Basis', 'Source / note'],
      rows: [
        [T('General county levy (Prop 13 maximum)'), O('1.00000', 'scc-assessor-booklet', '"The maximum amount of property tax cannot exceed 1% of a property\'s taxable value, plus bonds approved by the voters, service fees, improvement bonds, and special assessments."'), T('official'), T('Cal. Const. art. XIII, §1 as described by the County Assessor.')],
        [T('County bonds (retirement, hospital, parks)'), O('0.03880', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('County-wide.'), ],
        [T('County-wide special assessments (VMC 2008; County housing bond 2016)'), O('0.00520 + 0.00560', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('County-wide.')],
        [T('Water / special district (SCVWD state water project)'), O('0.00390', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('Levied by the district serving the parcel.')],
        [T('Hospital / open space (El Camino Hospital 2003; Mid Peninsula open space 2014)'), O('0.00200 + 0.00140', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('Parcel-specific to the TRA.')],
        [T('Cupertino Elementary School District (three voter-approved measures)'), O('0.01650 + 0.01690 + 0.00010', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('Elementary district — confirm on the parcel record.')],
        [T('Fremont Union High School District (four voter-approved measures)'), O('0.00880 + 0.01070 + 0.01180 + 0.01040', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('High school district — confirm which high-school district serves the parcel.')],
        [T('Foothill-De Anza Community College District'), O('0.00750 + 0.01010 + 0.01350', 'scc-taxratebook', 'Compilation of Tax Rates, Section I.'), T('official'), T('College district.')],
        [T('TRA totals observed elsewhere in the FY2025-26 Tax Rate Book'), O('1.14200 - 1.24090 per $100', 'scc-taxratebook', 'Sample TRA totals read from Section III (e.g. Los Gatos 1.14200-1.24090; Campbell/Union 1.24090; Mountain View 1.14670-1.16910).'), T('official'), T('Used as the sensitivity band for the Cupertino rate.')],
        [T('BASE CASE rate used for all Cupertino projections'), O('1.14880 per $100 of assessed value', 'scc-assessor-booklet', 'County Assessor: "A typical Tax Rate Area has tax rates per $100 of assessed value that include a base rate of 1% of value = $1.00, county bonds = $0.0388, school bonds = $0.100, water bonds = $0.010, total = $1.1488."'), T('official'), T('Low band 1.14200% / high band 1.24090%. Parcel-specific TRA not yet confirmed — flag F5.')]
      ]
    },

    ownerHistory: {
      title: 'PROPERTY_CUPERTINO — owner-supplied tax & assessment history, 2026-2014',
      note: 'OWNER-PROVIDED — UNVERIFIED. The owner\'s source spreadsheet was not available when this site was built, so the dollar cells that could not be recovered are left blank rather than inferred (project rule). What IS recorded from the owner\'s data is stated in the derived-facts table below and is flagged in the Flagged for Review page.',
      head: ['Tax year', 'Assessed value (owner)', 'Property tax (owner)', 'Owner-reported growth', 'Status'],
      rows: [
        ['2026', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'The owner\'s "+x%" column is offset by one row (flag F3); not reproduced.'), T('Owner-provided / unverified')],
        ['2025', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2024', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2023', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2022', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2021', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2020', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), W('0.0% year-over-year tax growth recorded (not +2.8%)', null, 'Owner\'s growth column is offset by one row; this row is the recorded anchor for flag F3.'), T('Owner-provided / unverified')],
        ['2019', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2018', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2017', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2016', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2015', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')],
        ['2014', U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Offset by one row (flag F3).'), T('Owner-provided / unverified')]
      ]
    },

    ownerDerived: {
      title: 'PROPERTY_CUPERTINO — what the owner\'s data does and does not reconcile to',
      head: ['Observation', 'Owner figure', 'Official figure', 'Verdict'],
      rows: [
        [T('Effective ad valorem rate implied by the owner\'s tax ÷ assessment'), W('1.33% - 1.35%', null, 'Derived from the owner\'s own columns.'), O('1.14880% typical TRA; 1.14200% - 1.24090% observed range', 'scc-assessor-booklet', 'County Assessor typical tax rate area total of $1.1488 per $100.'), T('Owner figure is ABOVE the official range — see flag F4. Not used in projections.')],
        [T('Consistency with a Prop 13 base'), T('Assessment grows at the Prop 13 cap'), O('2% per year (or the CA CPI if lower)', 'scc-assessor-booklet', 'Base year value increase limited to 2% per year (or less if the California CPI is below 2%).'), T('Consistent with Prop 13 if the base year is unchanged.')],
        [T('Homeowners\' exemption'), U(null, 'Not recorded in the owner\'s data; worth ~$80/yr and must be re-filed after any deed is recorded.'), O('$7,000 of assessed value ($80.42 at 1.1488)', 'scc-assessor-booklet', 'Recording a deed, including transferring property into or out of trust, automatically terminates the exemption for the upcoming fiscal year.'), T('Action item — see process step 6.')],
        [T('Market value used for every projection'), W('$3,100,000 (Nov 2026)', null, 'Owner-provided valuation.'), U(null, 'No official source publishes a parcel value.'), T('Owner-provided; re-confirm by appraisal before relying on any number on this site.')],
        [T('Assessed value used by the model'), U(null, 'The parcel\'s 2026 assessed value was not recoverable from the owner\'s source spreadsheet at build time (flag F16). The model therefore uses an ILLUSTRATIVE placeholder of $550,537, clearly labelled, for the "base preserved" tax series only.'), O('Official assessed value is available from the County Assessor parcel record', 'scc-parcel-lookup', 'Santa Clara County Assessor property search.'), T('Replace the placeholder with the parcel\'s actual assessed value. The reassessment scenarios do not use it — they are computed from market value.')],
        [T('Assessed value used by the model'), U(null, 'The parcel\'s 2026 assessed value was not recoverable from the owner\'s source spreadsheet at build time (flag F16). The model therefore uses an ILLUSTRATIVE placeholder of $550,537, clearly labelled, for the "base preserved" tax series only.'), O('Official assessed value is available from the County Assessor parcel record', 'scc-parcel-lookup', 'Santa Clara County Assessor property search.'), T('Replace the placeholder with the parcel\'s actual assessed value. The reassessment scenarios do not use it — they are computed from market value.')]
      ]
    },

    model: {
      assessed2026: 550537,
      note: 'ILLUSTRATIVE PLACEHOLDER — the Cupertino parcel\'s 2026 assessed value was not recoverable from the owner\'s source spreadsheet at build time (flag F16). Every projection that depends on the PRESERVED base uses this number and must be re-run once the parcel\'s actual 2026 assessed value is confirmed from the County Assessor record. The reassessment scenarios do NOT depend on it: they are computed from the owner-provided market value and the official tax rate.'
    },

    costs: {
      title: 'PROPERTY_CUPERTINO — 2026 operating cost build-up',
      note: 'Water and sewer come from published rate schedules. Insurance has no verifiable official price and is shown as an assumption band. Electricity is modelled from the owner\'s own observation of a net credit, tested against the published PG&E rate.',
      head: ['Cost line', '2026 amount', 'Basis', 'Source / note'],
      rows: [
        [T('Water — service charge (5/8"-3/4" meter)'), O('$53.02 / month', 'sjwc-sched1', 'General Metered Service, CPUC Schedule No. 1. Tariff territory includes "portions of Cupertino".'), T('official'), T('Applies only if the parcel is on the SJWC system — see flag F7.')],
        [T('Water — volumetric, 0-6 ccf'), O('$4.7350 / 100 cu ft', 'sjwc-sched1', 'General Metered Service, Schedule No. 1.'), T('official'), T('1 ccf = 748.05 gallons.')],
        [T('Water — volumetric, 6-12 ccf'), O('$6.5241 / 100 cu ft', 'sjwc-sched1', 'General Metered Service, Schedule No. 1.'), T('official'), T('Block rate.')],
        [T('Water — volumetric, over 12 ccf'), O('$9.7578 / 100 cu ft', 'sjwc-sched1', 'General Metered Service, Schedule No. 1.'), T('official'), T('Block rate.')],
        [T('Water — WRAP surcharge'), O('$1.45 / month', 'sjwc-sched1', 'Water Rate Adjustment Program surcharge.'), T('official'), T('SDRF surcharge amount not confirmed — see flag F7.')],
        [T('Modelled water total (10 ccf / month)'), D('$107.53 / month = $1,290.40 / year', 'sjwc-sched1', 'Computed from the published tariff: $53.02 + (6 x $4.7350) + (4 x $6.5241).'), T('derived'), T('Inside the owner\'s observed $100-150 / month band.')],
        [T('Sewer — Cupertino Sanitary District flat charge'), O('$802.14 / unit / year (FY2025-26)', 'csd-site', 'Single-family rate, collected on the property-tax bill. Hearing for FY2026-27 was 2026-05-20 with an increase capped at 5% effective 2026-07-01.'), T('official'), T('FY2026-27 adopted figure not published at build time — flag F8.')],
        [T('Electricity — net credit from solar'), W('Net credit of $10-20 / month', null, 'Owner-provided observation.'), T('owner'), T('Modelled as -$180 / year (a credit). Depends on the net-energy-metering tariff — flag F13.')],
        [T('Electricity — published PG&E rate for context'), O('40.60 ¢/kWh residential bundled non-CARE (from 2026-03-01)', 'pge-rate-advisory', 'Electric Rate Advisory 3/2026. Average 500 kWh bill $203.54/month.'), T('official'), T('Shows the size of the credit that solar offsets.')],
        [T('Homeowners insurance (HO-3)'), U('ca-doi', 'No official or published address-specific premium. Blank by rule; modelled as a band of $1,500 (owner estimate) to $5,000 with a $2,500 base case.'), T('unverified'), T('Owner estimate ~$1,500/yr. Obtain a broker quote — flag F9.')],
        [T('Repairs & maintenance'), A('$4,000 / year', null, 'Planning assumption — no official benchmark exists for a specific parcel.'), T('assumption'), T('See the assumptions table for the low / base / high band.')],
        [T('Capital replacement reserve'), A('0.50% of market value', null, 'Planning assumption.'), T('assumption'), T('$15,500 in 2026 at the owner\'s $3,100,000 value.')],
        [T('Property tax'), D('computed', 'scc-assessor-booklet', 'Assessed value x 1.14880 per $100. See the property-tax page.'), T('derived'), T('Official rate, owner-provided assessed value.')]
      ]
    }
  };

  /* ====================================================================== */
  /*  PROPERTY_2 — San Francisco Outer Sunset (ZIP 94122)                    */
  /* ====================================================================== */

  const sf = {
    key: 'PROPERTY_SF',
    label: 'San Francisco house — Outer Sunset (94122)',
    shortLabel: 'San Francisco',
    type: 'Three-unit residential building; owner occupies one unit, two units rented',
    color: '#0f766e',

    facts: {
      title: 'PROPERTY_SF — core facts',
      head: ['Item', 'Value', 'Basis', 'Source / note'],
      rows: [
        [T('Street address'), T('Withheld (PROPERTY_SF)'), T('—'), T('Privacy rule: no address, APN or account number is published.')],
        [T('ZIP code'), W('94122', null, 'Owner-provided.'), T('owner'), T('Owner-provided.')],
        [T('Property type'), W('3 livable units — owner lives in one, two are rented', null, 'Owner-provided.'), T('owner'), T('Owner-provided.')],
        [T('Estimated market value (Nov 2026)'), W('$1,800,000', null, 'Owner-provided valuation; not confirmed by an official source.'), T('owner'), T('Re-confirm by appraisal before relying on any number on this site.')],
        [T('Combined rent, two occupied units'), W('$7,150 / month = $85,800 / year', null, 'Owner-provided.'), T('owner'), T('Two units rented; the third is owner-occupied.')],
        [T('Owner occupancy'), W('Owner may live there as a primary residence without losing the rental income', null, 'Owner-provided.'), T('owner'), T('Does NOT make the building the transferor\'s "family home" for Prop 19 — see flag F11.')],
        [T('Water, sewer & stormwater (all three units)'), W('$330 - $400 / month', null, 'Owner-provided observation.'), T('owner'), T('The official rate build-up on the operating-costs page lands above this band — see flag F16b.')],
        [T('Electricity'), W('$30 - $70 / month', null, 'Owner-provided observation.'), T('owner'), T('Implies ~3.3 ¢/kWh for three units; PG&E\'s published residential average is 40.60 ¢/kWh — see flag F6.')],
        [T('Landlord / rental insurance'), U('ca-doi', 'No address-specific premium is published by any official source. Blank by rule; modelled as a band of $1,500 (owner estimate) to $4,000 with a $2,500 base case.'), T('unverified'), T('A landlord policy (DP-3) is the standard form. Obtain a broker quote — flag F9.')],
        [T('Water & sewer provider'), O('San Francisco Public Utilities Commission', 'sfpuc-rates', 'FY2026-27 rate schedules effective 2026-07-01.'), T('official'), T('Water Schedule W-1B (multi-family), wastewater Schedule A, stormwater Schedule C / D.')],
        [T('Electric service'), O('PG&E', 'pge-rate-advisory', 'Residential bundled non-CARE average 40.60 ¢/kWh effective 2026-03-01.'), T('official'), T('Whether each unit is separately metered is unconfirmed — flag F6.')]
      ]
    },

    officialTax: {
      title: 'PROPERTY_SF — City & County of San Francisco ad valorem tax rate',
      head: ['Fiscal year', 'Secured property tax rate (per $100)', 'Basis', 'Source / note'],
      rows: [
        [T('FY2026-27 (current)'), O('1.18162182', 'sftreasurer-secured', 'Published secured property tax rate for FY2026-27.'), T('official'), T('Bills mailed in October; two installments.')],
        [T('FY2025-26'), O('1.18268325', 'sf-legistar-rate', 'Combined secured rate adopted by the Board of Supervisors.'), T('official'), T('Board of Supervisors file 14779286.')],
        [T('FY2024-25'), O('1.17143563', 'sf-legistar-rate', 'Board of Supervisors file 14779286.'), T('official'), T('Shows the rate has been essentially flat, around 1.17%-1.18%.')],
        [T('FY2027-28'), P('Not yet published', 'sftreasurer-secured', 'The Treasurer publishes each year\'s rate before the October billing; the FY2026-27 book is the latest at build time.'), T('pending'), T('The projection holds the FY2026-27 rate flat and flags it — see flag F14.')],
        [T('Base case rate used for all SF projections'), O('1.18162182% of assessed value', 'sftreasurer-secured', 'FY2026-27 secured rate held flat.'), T('official'), T('Flat-rate assumption flagged in the assumptions table.')],
        [T('Installment due dates'), O('First: 2026-12-10 · Second: 2027-04-10', 'sftreasurer-secured', '10% penalty applies after each due date.'), T('official'), T('Same pattern for Santa Clara County: Dec 10 and Apr 10.')],
        [T('Supplemental / escape assessments'), O('Separate bill, prorated for the months remaining in the fiscal year ending June 30', 'scc-assessor-booklet', 'Supplemental Assessment provision of the County Assessor booklet; the SF Treasurer publishes the equivalent rule.'), T('official'), T('A change of ownership or new construction triggers a supplemental bill in the year of the event.')]
      ]
    },

    ownerHistory: {
      title: 'PROPERTY_SF — owner-supplied tax & assessment history, 2025-2016',
      note: 'OWNER-PROVIDED — UNVERIFIED. The assessment column is DERIVED from the owner\'s own recorded figures (a 2016 base year escalating at exactly 2% per year, reaching $114,248 in 2025) rather than copied verbatim, because the owner\'s source spreadsheet was not available at build time. It is labelled DERIVED and is not used in any projection except through the 2025 endpoint. The owner\'s "+x%" growth column is offset by one row and is not reproduced (flag F3).',
      head: ['Tax year', 'Assessed value', 'Property tax (owner)', 'Implied rate', 'Status'],
      rows: [
        ['2025', D('$114,248', null, 'Owner-recorded 2025 assessment (endpoint of the 2%/yr ladder).'), W('$2,439', null, 'Owner-recorded 2025 tax.'), D('2.135%', null, '$2,439 / $114,248 — far above the official 1.18162%. See flag F1.'), T('Owner-provided / unverified')],
        ['2024', D('$112,007', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2023', D('$109,811', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2022', D('$107,658', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2021', D('$105,547', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2020', D('$103,477', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2019', D('$101,448', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2018', D('$99,459', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2017', D('$97,509', null, '2%/yr escalation from the 2016 base.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')],
        ['2016', D('$95,597', null, 'Implied 2016 base year: $114,248 / 1.02^9. The working log recorded $96,557 for 2016, which does not reconcile to $114,248 at 2%/yr — see flag F16.'), U(null, 'Not recoverable at build time — see flag F16.'), U(null, 'Requires the tax figure.'), T('Owner-provided / derived / unverified')]
      ]
    },

    ownerDerived: {
      title: 'PROPERTY_SF — what the owner\'s data does and does not reconcile to',
      head: ['Observation', 'Owner figure', 'Official figure', 'Verdict'],
      rows: [
        [T('Effective ad valorem rate implied by the owner\'s 2025 tax ÷ assessment'), W('2.135%', null, '$2,439 / $114,248.'), O('1.18162182% (FY2026-27 secured rate)', 'sftreasurer-secured', 'Published City & County secured rate.'), T('Owner figure is 0.95 points above the official rate — see flag F1. Not used in projections.')],
        [T('Tax at the official rate applied to the owner\'s 2025 assessment'), D('$1,350 (2025) / $1,377 (2026)', 'sftreasurer-secured', '$114,248 x 1.18162182% = $1,350; $116,533 x 1.18162182% = $1,377.'), O('1.18162182%', 'sftreasurer-secured', 'Official rate.'), T('$1,062 below the owner\'s reported 2025 tax. Possible causes: a supplemental or escape assessment, a flat special assessment, or figures that describe different things. Confirm from the Treasurer portal.')],
        [T('Assessment growth pattern'), T('2016 base year, exactly 2% per year, no decline-in-value year'), O('Base year value increases by at most 2% per year (or the CA CPI if lower)', 'scc-assessor-booklet', 'Prop 13 base-year growth rule.'), T('Consistent with Prop 13. A pure 2% ladder with no Prop 8 relief year is possible but unusual — see flag F2.')],
        [T('Reassessment on death'), U(null, 'The owner\'s data implies the low base continues indefinitely.'), O('Reassessment of property acquired by inheritance from an estate or living trust occurs as of the date of death', 'scc-assessor-booklet', 'County Assessor booklet, Change in Ownership Reassessments. An assessment is made in the name of the estate even if the property is sold rather than distributed.'), T('This is the single largest risk in the plan for PROPERTY_SF — see the scenarios page.')],
        [T('Rental income'), W('$85,800 / year gross', null, 'Owner-provided.'), O('Rents are net investment income for the 3.8% NIIT', 'irs-tc559', 'IRS Topic no. 559.'), T('Net rental income is also a passive activity for §469 purposes.')]
      ]
    },

    costs: {
      title: 'PROPERTY_SF — 2026 operating cost build-up (all three units)',
      note: 'Water, wastewater and stormwater come from the published FY2026-27 SFPUC schedules. Insurance has no verifiable official price and is shown as an assumption band.',
      head: ['Cost line', '2026 amount', 'Basis', 'Source / note'],
      rows: [
        [T('Water — Schedule W-1B multi-family service charge (1" meter)'), O('$35.53 / month', 'sfpuc-rates', 'FY2026-27 Schedule W-1B: $19.65 (5/8"), $24.93 (3/4"), $35.53 (1"), $62.01 (1-1/2"), $93.81 (2").'), T('official'), T('Meter size unconfirmed — see flag F7b.')],
        [T('Water — first 3 units per dwelling unit'), O('$12.03 per 100 cu ft', 'sfpuc-rates', 'FY2026-27 Schedule W-1B multi-family quantity charge.'), T('official'), T('3 dwelling units x 3 ccf = 9 ccf at the first-block rate.')],
        [T('Water — additional units'), O('$12.91 per 100 cu ft', 'sfpuc-rates', 'FY2026-27 Schedule W-1B multi-family quantity charge.'), T('official'), T('Modelled usage 12 ccf / month total (4 ccf per unit).')],
        [T('Modelled water total'), D('$182.53 / month = $2,190.36 / year', 'sfpuc-rates', '$35.53 + (9 x $12.03) + (3 x $12.91).'), T('derived'), T('Usage assumption flagged in the assumptions table.')],
        [T('Wastewater — Schedule A residential service charge'), O('$6.62 / month', 'sfpuc-rates', 'FY2026-27 Schedule A residential wastewater.'), T('official'), T('Plus a per-discharge-unit charge.')],
        [T('Wastewater — discharge unit charge'), O('$20.74 per discharge unit', 'sfpuc-rates', 'FY2026-27 Schedule A. Multi-family flow factor 95%.'), T('official'), T('12 ccf metered x 95% flow factor = 11.4 discharge units.')],
        [T('Modelled wastewater total'), D('$243.06 / month = $2,916.72 / year', 'sfpuc-rates', '$6.62 + (11.4 x $20.74).'), T('derived'), T('Combined water + wastewater + stormwater is above the owner\'s observed $330-400 band — flag F16b.')],
        [T('Stormwater — Schedule D simplified residential (Tier 3, 3,301-6,000 sq ft)'), O('$29.55 / month', 'sfpuc-rates', 'FY2026-27 Schedule D: Tier 1 (0-1,700 sq ft) $12.63; Tier 2 (1,701-3,300) $19.66; Tier 3 (3,301-6,000) $29.55.'), T('official'), T('Schedule D applies only if the parcel is <=6,000 sq ft and <=6 dwelling units; otherwise Schedule C applies ($1.03 permeable / $10.30 impermeable per 1,000 sq ft). Parcel size unconfirmed — flag F7b.')],
        [T('Electricity — published PG&E rate, 3 units at average use'), O('40.60 ¢/kWh; $203.54 per 500 kWh', 'pge-rate-advisory', 'Electric Rate Advisory 3/2026; average 500 kWh monthly bill $203.54.'), T('official'), T('3 units x 500 kWh = 1,500 kWh = $609 / month.')],
        [T('Electricity — owner observation'), W('$30 - $70 / month', null, 'Owner-provided.'), T('owner'), T('Only reconcilable if the units are separately metered and tenants pay a utility share, or if usage is far below average. Flag F6.')],
        [T('Landlord insurance (DP-3)'), U('ca-doi', 'No official or published address-specific premium. Blank by rule; modelled as a band of $1,500 (owner estimate) to $4,000 with a $2,500 base case.'), T('unverified'), T('Obtain a broker quote — flag F9.')],
        [T('Repairs & maintenance'), A('$4,000 per unit per year = $12,000 / year', null, 'Planning assumption for a three-unit building.'), T('assumption'), T('Low / base / high band in the assumptions table.')],
        [T('Capital replacement reserve'), A('0.75% of market value', null, 'Planning assumption.'), T('assumption'), T('$13,500 in 2026 at the owner\'s $1,800,000 value.')],
        [T('Gross rental income'), W('$85,800 / year', null, 'Owner-provided: $7,150 / month from the two rented units.'), T('owner'), T('Rent escalation assumption 3% / year.')]
      ]
    }
  };

  /* ====================================================================== */
  /*  ASSUMPTIONS                                                            */
  /* ====================================================================== */

  const assumptions = {
    title: 'Planning assumptions used in every projection',
    note: 'No official source publishes these. They are stated so each number can be re-run with different settings on the scenarios page. Every projection on this site is a function of these numbers.',
    head: ['Assumption', 'Low', 'Base case', 'High', 'Basis', 'Why it matters'],
    rows: [
      [T('Home-value appreciation'), T('2.50% / yr'), T('3.50% / yr'), T('4.50% / yr'), T('assumption'), T('Drives every value, tax-on-sale and net-worth figure.')],
      [T('Assessed-value growth (Prop 13 cap)'), T('2.00% / yr'), T('2.00% / yr'), T('2.00% / yr'), T('official'), T('Hard legal cap (or the CA CPI if lower) — not a variable.')],
      [T('Prop 19 allowance inflation adjustment'), T('2.00% every 2 years'), T('2.00% every 2 years'), T('2.00% every 2 years'), T('assumption'), T('BOE adjusts the $1,000,000 allowance for inflation every two years using the California CPI; 2% is a planning proxy.')],
      [T('Inheritance year'), T('2040'), T('2045'), T('2050'), T('assumption'), T('Drives the value, the reassessment and the tax drag. Selectable on the scenarios page.')],
      [T('Utility cost escalation'), T('2.50% / yr'), T('4.00% / yr'), T('5.50% / yr'), T('assumption'), T('Water, sewer and stormwater rates have risen faster than CPI.')],
      [T('Insurance escalation'), T('2.50% / yr'), T('4.00% / yr'), T('6.00% / yr'), T('assumption'), T('Wildfire-driven rate increases have been running hot in California.')],
      [T('Maintenance & repair escalation'), T('2.50% / yr'), T('3.00% / yr'), T('4.00% / yr'), T('assumption'), T('Construction-cost inflation.')],
      [T('Rent escalation (PROPERTY_SF)'), T('2.00% / yr'), T('3.00% / yr'), T('4.00% / yr'), T('assumption'), T('Applied to the owner-provided $85,800 / year.')],
      [T('Market rent if PROPERTY_CUPERTINO is rented (not occupied)'), T('$4,500 / mo'), T('$5,500 / mo'), T('$6,500 / mo'), T('assumption'), T('No official source publishes parcel-level rents; the owner must supply a market rent. Selectable on the scenarios page.')],
      [T('Homeowners insurance (Cupertino)'), T('$1,500 / yr'), T('$2,500 / yr'), T('$5,000 / yr'), T('assumption'), T('Owner estimate is the low end. No official price exists.')],
      [T('Landlord insurance (San Francisco)'), T('$1,500 / yr'), T('$2,500 / yr'), T('$4,000 / yr'), T('assumption'), T('Owner estimate is the low end. No official price exists.')],
      [T('Discount rate for NPV'), T('4.00%'), T('5.00%'), T('6.00%'), T('assumption'), T('Nominal, blended across a home and a stock portfolio.')],
      [T('Sale costs on a Cupertino sale'), T('1.50%'), T('2.00%'), T('2.75%'), T('assumption'), T('Brokerage, escrow, title and recording. Cupertino has no city transfer tax.')],
      [T('Sale costs on a San Francisco sale'), T('2.00%'), T('2.50%'), T('3.50%'), T('assumption'), T('Brokerage, escrow, title, recording plus the SF transfer tax.')],
      [T('Portfolio return if the property is sold and the proceeds invested'), T('4.00% / yr'), T('6.00% / yr'), T('8.00% / yr'), T('assumption'), T('Nominal blended return on stocks / savings for the reinvestment option.')],
      [T('Effective tax rate on a post-death capital gain'), T('20% federal only'), T('33.3% federal + California'), T('37.1% federal + California + NIIT'), T('official'), T('Federal 20% long-term capital-gain rate (Topic 409); California 12.3% top bracket plus the 1% Mental Health Services Tax above $1,000,000 (FTB 2026 schedules); 3.8% NIIT above the MAGI threshold (Topic 559). Assumes the whole gain is above the 15%/0% brackets.')]
    ]
  };

  /* ====================================================================== */
  /*  INHERITANCE TAX THRESHOLDS                                             */
  /* ====================================================================== */

  const thresholds = {
    title: 'Tax-free inheritance thresholds — federal, state and local (2026)',
    head: ['Level', 'Tax', 'Threshold / rate', 'Basis', 'Source'],
    rows: [
      [T('Federal'), T('Estate tax'), O('$15,000,000 per person', 'irs-whatsnew', 'P.L. 119-21 (OBBBA) set the 2026 §2010(c)(3) basic exclusion at $15,000,000; Rev. Proc. 2025-32 §4.14 confirms the amount and states that it is adjusted for inflation for 2027 and later years.'), T('official'), T('irs-rp-25-32')],
      [T('Federal'), T('Estate tax — portability'), O('$30,000,000 with a timely Form 706', 'irs-estate', 'A surviving spouse can preserve the unused exclusion by filing Form 706 within 9 months.'), T('official'), T('irs-estate')],
      [T('Federal'), T('Estate tax — top rate'), O('40%', 'crs-r48183', 'CRS R48183: permanent $15,000,000 unified exclusion, indexed from 2027, 40% top rate.'), T('official'), T('crs-r48183')],
      [T('Federal'), T('Annual gift tax exclusion'), O('$19,000 per donee per year', 'irs-rp-25-32', 'Rev. Proc. 2025-32 §4.42(1): "For calendar year 2026, the first $19,000 of gifts to any person … are not included in the total amount of taxable gifts under §2503."'), T('official'), T('irs-rp-25-32')],
      [T('Federal'), T('Gift tax return'), O('Form 709 (or Form 709-NA) is required for taxable gifts above the annual exclusion', 'irs-gift', 'IRS guidance on which transfers require a gift tax return and when.'), T('official'), T('irs-gift')],
      [T('Federal'), T('Basis step-up at death'), O('Property is inherited at fair market value (§1014)', 'irs-tc409', 'Topic no. 409 refers to Publication 551 for basis of assets acquired by gift or inheritance.'), T('official'), T('irs-tc409')],
      [T('California'), T('Estate tax / inheritance tax'), O('NONE — prohibited by statute', 'ca-rtc-13301', 'R&T §13301 (Part 8, "Prohibition of Gift and Death Taxes"): "Neither the state nor any political subdivision of the state shall impose any gift, inheritance, succession, legacy, income, or estate tax … on or by reason of any transfer occurring by reason of a death." Repealed and added June 8, 1982 by initiative Proposition 6.'), T('official'), T('ca-rtc-13301')],
      [T('California'), T('Gift tax'), O('NONE — prohibited by statute', 'ca-rtc-13301', 'Same statute.'), T('official'), T('ca-rtc-13301')],
      [T('California'), T('Individual income tax'), O('1% - 12.3% (Schedule X/Y/Z), plus 1% Mental Health Services Tax above $1,000,000 of taxable income', 'ftb-2026-schedules', '2026 California Tax Rate Schedules. Single: 1% up to $11,456, rising to 12.3% above $768,213. MFJ: 12.3% above $1,536,426. Head of household: 12.3% above $1,044,771.'), T('official'), T('ftb-2026-schedules')],
      [T('California'), T('Where the rate schedules are published'), O('Official index of California tax tables and rate schedules, by year', 'ftb-index', 'The Franchise Tax Board publishes the rate schedules for each tax year; the index page was last updated 2 January 2026.'), T('official'), T('ftb-index')],
      [T('Santa Clara County'), T('Ad valorem property tax'), O('1% of taxable value plus voter-approved bonds (typical TRA $1.1488 per $100)', 'scc-assessor-booklet', 'County Assessor booklet: typical Tax Rate Area total $1.1488 per $100 of assessed value.'), T('official'), T('scc-assessor-booklet')],
      [T('San Francisco'), T('Ad valorem property tax'), O('1.18162182% of assessed value (FY2026-27)', 'sftreasurer-secured', 'Treasurer & Tax Collector published secured rate.'), T('official'), T('sftreasurer-secured')],
      [T('California'), T('Documentary transfer tax'), O('$1.10 per $1,000 of consideration (0.11%)', 'ca-rtc-11911', 'R&T §11911(a): a county may impose a tax at $0.55 for each $500 of consideration when consideration exceeds $100.'), T('official'), T('ca-rtc-11911')],
      [T('San Francisco'), T('City transfer tax'), O('0.50% / 0.68% / 0.75% / 2.25% / 5.50% / 6.00% by price band', 'sf-gov-transfer-tax', '$2.50, $3.40, $3.75, $11.25, $27.50 and $30.00 per $500 of consideration. The band rate applies to the ENTIRE consideration.'), T('official'), T('sf-gov-transfer-tax')],
      [T('California'), T('Prop 19 base-value allowance (parent to child)'), O('$1,044,586 (transfers 2025-02-16 to 2027-02-15)', 'boe-pub801', 'BOE Publication 801 allowance schedule: $1,000,000, then $1,022,600, then $1,044,586; next adjustment 2027-02-16.'), T('official'), T('boe-pub801')],
      [T('California'), T('Prop 19 excess-reassessment cap'), O('No cap on the excess above the allowance', 'boe-prop19', 'BOE Prop 19 page: value above the allowance is reassessed.'), T('official'), T('boe-prop19')],
      [T('Federal'), T('Net investment income tax (applies to rent and to sale gains)'), O('3.8% above $250,000 MAGI (MFJ) / $200,000 (single)', 'irs-tc559', 'IRS Topic no. 559.'), T('official'), T('irs-tc559')],
      [T('Federal'), T('Passive activity rules on rental income'), O('$25,000 active-participation allowance, phased out $100,000 - $150,000 MAGI', 'irs-tc559', 'Rental activity is passive by definition; rents and real-estate gains are net investment income for NIIT purposes.'), T('official'), T('irs-tc559')],
      [T('Federal'), T('Excess business loss limitation (§461(l))'), O('$256,000 ($512,000 MFJ) for 2026 — permanent', 'irs-rp-25-32', 'Rev. Proc. 2025-32 §4.31.'), T('official'), T('irs-rp-25-32')]
    ]
  };

  /* ====================================================================== */
  /*  PROP 19 / REASSESSMENT MECHANICS                                       */
  /* ====================================================================== */

  const prop19 = {
    title: 'Prop 19 mechanics — what actually preserves the property tax base',
    head: ['Rule', 'What the official source says', 'Source'],
    rows: [
      [T('Which property can be transferred with an exclusion'), T('Only the transferor\'s PRINCIPAL RESIDENCE (or a family farm). "Other real property" — such as a rental building — gets no exclusion.'), T('boe-prop19')],
      [T('Who can receive it'), T('An eligible transferee: a child, grandchild, or in some cases a sibling or a trust. Siblings and legal-entity transferees do not qualify for the sibling category.'), T('boe-prop19')],
      [T('Occupancy test'), T('The transferee must occupy the residence as a principal residence within 1 year of the transfer, and the exclusion ends if the transferee stops qualifying.'), T('ca-rtc-63-2')],
      [T('Exemption filing'), T('The transferee must claim the homeowners\' exemption (or disabled-veterans\' exemption) within 1 year of the transfer.'), T('ca-rtc-63-2')],
      [T('Claim form and deadline'), T('BOE-19-P (and BOE-266) must be filed within 3 years of the purchase or transfer, or before the property goes to a third party or the transferee stops occupying it — whichever is earlier.'), T('ca-rtc-63-2')],
      [T('How the taxable value is built'), T('The factored base year value is adjusted each year by the change in the California Consumer Price Index, but not by more than 2%. The Prop 19 allowance is then added on top of it.'), T('ca-rtc-110-1')],
      [T('Value limit'), T('Taxable value = the existing factored base year value + the indexed allowance ($1,044,586 for 2025-02-16 to 2027-02-15). Value ABOVE that is reassessed to market.'), T('boe-pub801')],
      [T('Trust transfers'), T('§63.2(e)(9): "Transfer" includes any transfer of the present beneficial ownership of property from an eligible transferor to an eligible transferee through the medium of an inter vivos or testamentary trust.'), T('ca-rtc-63-2')],
      [T('Funding a revocable trust during life'), T('§62(d): a transfer to a trust that is revocable, or in which the trustor is a present beneficiary, is NOT a change of ownership. So funding the trust does not trigger reassessment.'), T('ca-rtc-62')],
      [T('What happens at the trustor\'s death'), T('BOE LTA 80/25: when a revocable trust becomes irrevocable, the vesting of an interest in real property in persons OTHER than the trustor (or the trustor\'s spouse) IS a change of ownership. Termination of the trust is also a change of ownership.'), T('boe-lta-80-25')],
      [T('Distribution out of the trust'), T('BOE Legal Opinion 220.0791: termination of a parents\' trust with distribution to a child is treated as a parent-to-child transfer and is subject to Prop 19.'), T('boe-lo-2200791')],
      [T('When the county reassesses'), T('County Assessor: "The reassessment of property acquired by inheritance from an estate or living trust occurs as of the date of the death of the former owner, not on the date of distribution to the beneficiary. An assessment will be made in the name of the estate even if the property is sold rather than distributed to the heirs."'), T('scc-assessor-booklet')],
      [T('Special needs trusts'), T('SB 974 (Stats. 2026 ch. 665, approved 2026-09-27, effective 2027-01-01) adds court-established special needs trusts under Prob. Code §3604 as an eligible medium of transfer. Clarification only — no projected revenue impact.'), T('leginfo-sb974')]
    ]
  };

  /* ====================================================================== */
  /*  PENDING LAW / WATCH LIST                                                */
  /* ====================================================================== */

  const pending = {
    title: 'Pending and future changes — what could move the numbers',
    head: ['Item', 'Status', 'Likely effect on this plan', 'Basis', 'Source'],
    rows: [
      [T('Federal estate exclusion (P.L. 119-21, OBBBA)'), O('Enacted — permanent $15,000,000 for 2026, indexed from 2027', 'irs-rp-25-32', 'Rev. Proc. 2025-32 §4.14: "The basic exclusion amount will be adjusted for inflation for calendar year 2027 and future years."'), T('official'), T('No estate tax for either property unless the estate exceeds $15,000,000 (it does not).')],
      [T('Federal §1014 basis step-up after 2025'), P('Not extended', 'crs-r48183', 'The 2025 legislation made the exclusion permanent but did not extend the basis step-up beyond the scheduled sunset.'), T('pending'), T('No effect on this plan, because both properties stay inside a revocable trust and are therefore in the decedent\'s gross estate, so the step-up still applies. If the trust is NOT funded before death, a built-in gain survives — a reason to fund the trust.')],
      [T('Prop 19 allowance inflation adjustment'), P('Next adjustment 2027-02-16', 'boe-pub801', 'BOE adjusts the allowance every two years using the California CPI; the schedule is $1,000,000 / $1,022,600 / $1,044,586.'), T('pending'), T('Material: the allowance is about $1.3M against a $6M Cupertino value, so the cap buys only a small part of the reassessment.')],
      [T('Santa Clara County FY2026-27 Tax Rate Book'), P('Not yet published (FY2025-26 book published 2025-11-01)', 'scc-taxratebook', 'The Controller-Treasurer republishes annually in the autumn.'), T('pending'), T('Refines the Cupertino tax rate by a few hundredths of a percent. Immaterial to the decision.')],
      [T('San Francisco FY2027-28 secured rate'), P('Not yet published', 'sftreasurer-secured', 'Published before the October billing.'), T('pending'), T('The rate has moved less than 0.12 points in three years, so immaterial.')],
      [T('SF BUILD Act (transfer-tax amendment)'), P('Pending — introduced 2026-03-24', 'sf-build-act', 'Would cut the top transfer-tax tiers.'), T('pending'), T('No effect: the tiers that would change apply only above $10,000,000, far above either property\'s projected value.')],
      [T('California net-energy-metering tariff for the Cupertino solar system'), P('Final; the export-credit level was not confirmed from an official page at build time', 'pge-rate-advisory', 'The value of the Cupertino electricity credit depends on the interconnection date and the applicable PG&E tariff.'), T('pending'), T('Only affects the size of the electricity credit (modelled as -$180 / year), not the property-tax decision. Flag F13.')],
      [T('Federal excess business loss limitation'), O('Permanent; $256,000 ($512,000 MFJ) for 2026', 'irs-rp-25-32', 'Rev. Proc. 2025-32 §4.31.'), T('official'), T('Relevant only if the heirs run a trade or business against the rental losses.')],
      [T('California estate / inheritance tax'), O('Prohibited by statute — no pending change identified', 'ca-rtc-13301', 'R&T §13301.'), T('official'), T('None expected.')]
    ]
  };

  /* ====================================================================== */
  /*  INHERITANCE PROCESS                                                    */
  /* ====================================================================== */

  const process = {
    title: 'Step-by-step inheritance process',
    note: 'Ordered by when the action must happen. Steps marked "Now" are the ones that create value; steps at death are largely mechanical once the planning is right.',
    phases: [
      {
        name: 'Phase A — Now, while the owner is living (the value-creating phase)',
        steps: [
          { h: 'Pull the official records for both parcels', when: 'Now — 1 month', b: 'official', s: 'scc-parcel-lookup', p: 'Get the parcel number, the tax rate area (TRA) number and the current assessed value for PROPERTY_CUPERTINO from the Santa Clara County Assessor, and the assessed value and the ad valorem tax line for PROPERTY_SF from the SF Treasurer portal. These two lookups close flags F1, F2, F4 and F5 in one step.' },
          { h: 'Pull the San Francisco parcel record and three years of bills', when: 'Now — 1 month', b: 'official', s: 'sf-parcel-lookup', p: 'The San Francisco Treasurer portal shows the assessed value, the tax rate and the ad valorem tax line for the parcel. Pull three years of bills and reconcile the owner\'s recorded $2,439 (2025) against the official rate — this closes flag F1 and tells us whether the owner\'s figure included a supplemental assessment, a flat special assessment, or a different parcel.' },
          { h: 'Confirm the Cupertino TRA total', when: 'Now — 1 month', b: 'official', s: 'scc-taxratebook', p: 'With the TRA number, read Section III of the FY2025-26 Tax Rate Book and replace the "typical Tax Rate Area" base case of $1.1488 with the parcel\'s actual total. Then re-file the Homeowners\' Exemption if it is not current.' },
          { h: 'Identify the Cupertino water provider, meter size and sewer rate', when: 'Now — 1 month', b: 'official', s: 'cupertino-bulletin', p: 'Cupertino has three water systems. Confirm which one serves the parcel, the meter size and the SDRF surcharge, and obtain the adopted FY2026-27 Cupertino Sanitary District per-unit charge. Closes flags F7 and F8.' },
          { h: 'Get insurance quotes', when: 'Now — 1-2 months', b: 'official', s: 'ca-doi', p: 'Obtain an HO-3 quote for PROPERTY_CUPERTINO and a DP-3 quote for PROPERTY_SF, and ask both carriers whether the FAIR Plan would be the fallback. The premiums are the largest blank in the cost model.' },
          { h: 'Decide the San Francisco strategy, and get the numbers needed to decide it', when: 'Now — before any transfer', b: 'official', s: 'boe-prop19', p: 'The 3-unit building is not a "family home", so no Prop 19 exclusion is expected at death. The choice is between selling during the owner\'s lifetime and keeping it and accepting full reassessment. Comparing the two requires the ORIGINAL purchase basis and the original purchase date — which is why the lifetime-sale option cannot be quantified on this site yet (flag F12).' },
          { h: 'Fund a revocable living trust and put BOTH properties into it', when: 'Now — the single highest-value step', b: 'official', s: 'ca-rtc-62', p: 'R&T §62(d): a transfer to a revocable trust, or in which the trustor is a present beneficiary, is NOT a change of ownership, so the low Prop 13 base is preserved and no supplemental tax bill is issued. Two consequences to note: recording the deed automatically terminates the Homeowners\' Exemption for the upcoming fiscal year (worth about $80 a year), and the trust must be funded — a deed into the trust, not just a promise in a will.' },
          { h: 'Draft the trust so that no interest in the real property vests in the beneficiaries at death', when: 'Now — at drafting', b: 'official', s: 'boe-lta-80-25', p: 'This is the instruction that preserves the assessed value. BOE LTA 80/25 states that when a revocable trust becomes irrevocable at the trustor\'s death, the vesting of an interest in the property in anyone OTHER than the trustor or the trustor\'s spouse IS a change of ownership — and a later distribution to a child is treated as a parent-to-child transfer subject to Prop 19 (BOE Legal Opinion 220.0791). The trust must therefore continue for the beneficiaries rather than vest outright at death. This MUST be confirmed in writing by estate counsel and, ideally, pre-confirmed with the County Assessor.' },
          { h: 'Get a written Prop 19 eligibility opinion for PROPERTY_CUPERTINO', when: 'Now — with counsel', b: 'official', s: 'ca-rtc-63-2', p: 'Ask counsel to confirm, in writing: (a) whether PROPERTY_CUPERTINO is the transferor\'s "family home"; (b) whether the heirs can satisfy the 1-year occupancy and 1-year exemption-filing tests; (c) whether the trust drafting leaves the property outside the exclusion entirely; and (d) what happens if a beneficiary later stops occupying the house as a principal residence (the exclusion is then removed and the property is reassessed).' },
          { h: 'Name successors, fund a liquidity reserve and calendar the annual dates', when: 'Now — once', b: 'official', s: 'scc-assessor-booklet', p: 'Name a successor trustee and successor beneficiaries; hold a liquid reserve inside the trust sized to cover a possible SF supplemental assessment and a year of holding costs; and diary the annual calendar: Jan 1 lien date, Feb 15 exemption-claim deadline, Dec 10 and Apr 10 installments, Jul 2 - Sep 15 appeal window, and the biennial BOE adjustment to the Prop 19 allowance.' },
          { h: 'Re-file the Homeowners\' Exemption after funding the trust', when: 'Now — within the annual window', b: 'official', s: 'scc-assessor-booklet', p: 'Recording the deed into trust terminates the exemption for the upcoming fiscal year. File BOE-266 to restore it (deadline Feb 15; late-application deadline Dec 10).' }
        ]
      },
      {
        name: 'Phase B — At the owner\'s death (expected 2040-2050)',
        steps: [
          { h: 'Obtain date-of-death valuations of both properties', when: 'Within 60 days', b: 'official', s: 'irs-estate', p: 'Both properties must be valued as of the date of death for the gross estate and for the §1014 basis. A qualified appraisal is the standard evidence.' },
          { h: 'The trustee takes title — no probate required', when: 'Within days', b: 'official', s: 'scc-assessor-booklet', p: 'Because both properties were deeded into the revocable trust during life, they pass under the trust terms rather than through probate. Keep the trust funded, the transfer documents current, and the successor-trustee succession clean.' },
          { h: 'Expect the assessor to reassess as of the date of death', when: 'At death', b: 'official', s: 'scc-assessor-booklet', p: '"The reassessment of property acquired by inheritance from an estate or living trust occurs as of the date of the death of the former owner, not on the date of distribution to the beneficiary. An assessment will be made in the name of the estate even if the property is sold rather than distributed to the heirs." Whether that reassessment produces a low or a high taxable value depends entirely on the trust drafting from Phase A.' },
          { h: 'File the change-of-ownership paperwork and any Prop 19 claim', when: 'Within the statutory windows', b: 'official', s: 'ca-rtc-63-2', p: 'File the Preliminary Change of Ownership Report with the recorder. If PROPERTY_CUPERTINO is claimed under Prop 19, the transferee must occupy it as a principal residence within 1 year, claim the homeowners\' exemption within 1 year, and file BOE-19-P within 3 years (or before the property passes to a third party, whichever is earlier). Note the 3-year claim window runs from the transfer, so it is a diary item the trustee must own.' },
          { h: 'Pay the property taxes and any supplemental assessment', when: 'Dec 10 and Apr 10', b: 'official', s: 'sftreasurer-secured', p: 'Both counties bill in October with two instalments (Dec 10 / Apr 10). A supplemental or escape assessment arising from the change in ownership is a separate bill, prorated for the months remaining in the fiscal year ending June 30.' },
          { h: 'Decide the San Francisco property — sell or keep', when: 'In the first year after death', b: 'official', s: 'sf-gov-transfer-tax', p: 'This is the decision the scenarios page models. If it is sold, file the Transfer Tax Affidavit and the Preliminary Change of Ownership Report with the deed; the transfer tax rate depends on the price band and the rate applies to the entire consideration.' },
          { h: 'File Form 706 only if you want portability', when: 'Within 9 months', b: 'official', s: 'irs-i706', p: 'At the projected estate size there is no federal estate tax. Filing Form 706 anyway can preserve the unused exclusion for a surviving spouse, but it is costly and unnecessary if there is no surviving spouse or if portability is not wanted.' }
        ]
      },
      {
        name: 'Phase C — Years after the inheritance',
        steps: [
          { h: 'The preserved base keeps escalating at 2% a year', when: 'Every January', b: 'official', s: 'scc-assessor-booklet', p: 'The factored base year value rises by at most 2% per year (or the CA CPI if lower), so the tax on a preserved base stays low and predictable even as market value doubles.' },
          { h: 'Watch the Prop 19 conditions every year', when: 'Annually', b: 'official', s: 'ca-rtc-63-2', p: 'If a beneficiary stops occupying PROPERTY_CUPERTINO as a principal residence, the exclusion is removed and the property is reassessed. If the heirs rent it instead of living in it, that risk is live from day one — which is a cost of the "rent it" option that the cash-flow model alone does not show.' },
          { h: 'Re-check the net-energy-metering tariff and consider a battery', when: 'Annually', b: 'official', s: 'pge-rate-advisory', p: 'The value of the solar credit depends on the tariff and the interconnection date. A battery materially improves the economics under a low export rate. The Cupertino electric cost line is a credit, not a cost, and it should stay that way.' },
          { h: 'Re-shop insurance every year', when: 'Annually', b: 'official', s: 'ca-doi', p: 'California\'s homeowners market is volatile. Keep the FAIR Plan fallback in mind and keep the DIC wrap if the FAIR Plan is ever used.' },
          { h: 'Hold the properties in the trust and do not distribute them out of it', when: 'Continuously', b: 'official', s: 'boe-lta-80-25', p: 'Distribution out of the trust is itself an ownership event. Holding the property inside a continuing trust is the mechanism that keeps the base intact.' }
        ]
      }
    ]
  };

  /* ====================================================================== */
  /*  FLAGS / IRREGULARITIES                                                  */
  /* ====================================================================== */

  const flags = {
    title: 'Flagged for review',
    note: 'Every item below is either an owner-data inconsistency, a value that could not be confirmed from an official source, or an open legal question. None of them block the build; all of them need a human decision or a document.',
    items: [
      { id: 'F1', sev: 'high', area: 'PROPERTY_SF — owner data', what: 'The owner\'s 2025 property tax of $2,439 divided by the owner\'s 2025 assessment of $114,248 implies an effective rate of 2.135%, which is 0.95 points above the official San Francisco secured rate of 1.18162182% for FY2026-27. Applying the official rate to the owner\'s own assessment gives $1,350 for 2025 and $1,377 for 2026 — about $1,062 a year below the owner\'s figure.', why: 'Possible explanations include a supplemental or escape assessment, a flat special assessment, a possession-interest tax, or two figures that describe different things.', action: 'Pull the parcel record and three years of bills from the SF Treasurer portal and reconcile each line item. Until then the site uses the OFFICIAL rate against the owner\'s assessment and never the owner\'s tax figure.', s: 'sftreasurer-secured' },
      { id: 'F2', sev: 'medium', area: 'PROPERTY_SF — owner data', what: 'The owner\'s assessment series runs from a 2016 base year upward at exactly 2% per year with no decline-in-value year in between.', why: 'Prop 13 does cap base-year growth at 2% (or the CA CPI if lower), so the pattern is possible — but a property that never had a Prop 8 temporary reduction is unusual in San Francisco.', action: 'Confirm the base year and the base year value from the Assessor record; check whether any year had a decline-in-value reduction.', s: 'scc-assessor-booklet' },
      { id: 'F3', sev: 'medium', area: 'Both properties — owner data', what: 'In the owner\'s spreadsheet the "+x%" growth column sits against the FOLLOWING year\'s value, so the growth column is offset by one row. The recorded anchor is that 2019 to 2020 tax growth is 0.0%, not the +2.8% the column shows.', why: 'Reproducing the column as given would put a wrong growth rate on every row.', action: 'The growth column is not reproduced anywhere on this site. Ask the owner for a re-exported file, or ignore the column and re-derive growth from the dollar columns.', s: null },
      { id: 'F4', sev: 'high', area: 'PROPERTY_CUPERTINO — owner data', what: 'The owner\'s tax ÷ assessment implies 1.33% - 1.35%, above the County-wide ad valorem range and above the County Assessor\'s published typical tax rate area total of $1.1488%.', why: 'The owner figure is 0.18 - 0.20 points too high, which on a $550,000 assessment is about $1,000 a year.', action: 'Confirm the parcel\'s tax rate area and its exact total from the Tax Rate Book once the TRA number is known. The site uses the official rate for all projections.', s: 'scc-assessor-booklet' },
      { id: 'F5', sev: 'high', area: 'PROPERTY_CUPERTINO — missing official figure', what: 'The parcel-specific tax rate area total for the 95014 parcel (001-xxx series) was not located in the FY2025-26 Tax Rate Book extraction.', why: 'Every Cupertino projection therefore uses the County Assessor\'s "typical Tax Rate Area" total of $1.1488 per $100, with the observed book range of 1.14200% - 1.24090% carried as a sensitivity band.', action: 'Look the TRA number up on the County Assessor parcel search, then read Section III of the Tax Rate Book. One lookup closes this.', s: 'scc-taxratebook' },
      { id: 'F6', sev: 'high', area: 'PROPERTY_SF — electricity', what: 'The owner\'s $30 - $70 per month for three dwelling units implies roughly 3.3 cents per kWh, against PG&E\'s published residential bundled non-CARE average of 40.60 cents per kWh (about $203.54 for an average 500 kWh month). Three units at average use would be about $609 per month.', why: 'The two figures can only agree if the units are separately metered and tenants pay a utility share, if usage is far below average, or if there is solar.', action: 'Obtain twelve months of PG&E bills and the metering configuration for each unit, then re-baseline the electricity line.', s: 'pge-rate-advisory' },
      { id: 'F7', sev: 'medium', area: 'PROPERTY_CUPERTINO — water', what: 'Cupertino is served by THREE separate water systems: the City-owned Cupertino Water System (leased to San Jose Water Company), San Jose Water Company in the south-east, and California Water Service in the north-east. There is no "Cupertino Water District".', why: 'The Cupertino cost model is built on the San Jose Water Company CPUC tariff, which covers "portions of Cupertino" — the parcel\'s actual provider, meter size and SDRF surcharge are not confirmed.', action: 'Confirm the provider and meter size, then read the correct tariff. The modelled $107.53 per month sits inside the owner\'s observed $100 - $150 band.', s: 'cupertino-bulletin' },
      { id: 'F7b', sev: 'medium', area: 'PROPERTY_SF — utilities', what: 'The SFPUC model needs the meter size (Schedule W-1B service charge ranges from $19.65 for 5/8" to $93.81 for 2"), the metered usage (about 12 ccf per month is assumed), and the parcel area (which selects the Schedule D stormwater tier and determines whether Schedule D even applies).', why: 'These inputs move the water, wastewater and stormwater lines by roughly $100 a month.', action: 'Read the meter and the last twelve bills; confirm the parcel square footage against the Schedule D eligibility rule (6,000 sq ft and 6 dwelling units).', s: 'sfpuc-rates' },
      { id: 'F8', sev: 'low', area: 'PROPERTY_CUPERTINO — sewer', what: 'The Cupertino Sanitary District FY2026-27 per-unit charge was not published at build time. The rate hearing was held 2026-05-20 with an increase capped at 5%, effective 2026-07-01.', why: 'The model uses the FY2025-26 figure of $802.14 per unit per year.', action: 'Obtain the adopted FY2026-27 rate from the district and update the model.', s: 'csd-site' },
      { id: 'F9', sev: 'high', area: 'Both properties — insurance', what: 'No address-specific homeowners (HO-3) or landlord (DP-3) premium can be confirmed from an official source. California FAIR Plan dwelling limits and eligibility rules were also not confirmed from an official page during this build.', why: 'The official column is left blank by rule. The model carries a $1,500 - $5,000 band for the Cupertino house and a $1,500 - $4,000 band for the San Francisco building, with the owner\'s $1,500 estimate at the low end.', action: 'Obtain written quotes from at least two admitted carriers, and ask each what happens if it declines and the FAIR Plan becomes the only option.', s: 'ca-doi' },
      { id: 'F10', sev: 'high', area: 'Trust drafting — the highest-impact open item', what: 'It is not established whether the trust drafting can preserve the Santa Clara County assessed value at death.', why: 'BOE LTA 80/25 says that when a revocable trust becomes irrevocable, an interest vesting in someone other than the trustor or the trustor\'s spouse IS a change of ownership; and BOE Legal Opinion 220.0791 says a later distribution to a child is a parent-to-child transfer subject to Prop 19. The difference between preserving the base and losing it is about $44,000 to $59,000 a year on the Cupertino house alone.', action: 'Obtain a written opinion from California estate counsel on the vesting language, and ideally a pre-confirmation from the County Assessor. This is the first action in Phase A.', s: 'boe-lta-80-25' },
      { id: 'F11', sev: 'high', area: 'PROPERTY_SF — Prop 19 eligibility', what: 'On the facts given, the San Francisco building (three units, two rented, owner in the third) is not the transferor\'s "family home", so no Prop 19 exclusion is expected at death and the property is expected to be reassessed to market value.', why: 'Prop 19 covers the transferor\'s principal residence only; a multi-unit building with two tenancies is an investment property. The consequence is about $39,000 a year of additional tax at 2045.', action: 'Confirm with counsel. If the conclusion changes, the scenarios page re-runs instantly.', s: 'boe-prop19' },
      { id: 'F12', sev: 'medium', area: 'Both properties — basis', what: 'The original purchase price and purchase date for both properties were not provided, so a lifetime sale cannot be quantified.', why: 'Selling during the owner\'s lifetime avoids reassessment entirely but taxes the appreciation since purchase at ordinary rates. That trade-off is the core of the San Francisco decision.', action: 'Supply the purchase price and date for each property.', s: 'irs-tc409' },
      { id: 'F13', sev: 'low', area: 'PROPERTY_CUPERTINO — solar', what: 'The value of the electricity credit depends on the interconnection date and the applicable net-energy-metering tariff. The export-credit level was not confirmed from an official page during this build.', why: 'The model uses the owner\'s own observation of a $10 - $20 per month net credit (-$180 per year). A materially lower export rate would shrink that credit.', action: 'Pull the interconnection agreement and the PG&E net-energy-metering tariff; price a battery.', s: 'pge-rate-advisory' },
      { id: 'F14', sev: 'low', area: 'Rates', what: 'The Santa Clara County FY2026-27 Tax Rate Book and the San Francisco FY2027-28 secured rate are not yet published.', why: 'The model holds the latest published rates flat. For San Francisco the rate has moved less than 0.12 points in three years.', action: 'Refresh both when published.', s: 'sftreasurer-secured' },
      { id: 'F15', sev: 'medium', area: 'Model', what: 'The 3.5% a year home-value appreciation assumption has no official source.', why: 'It drives every value, every tax-on-sale figure and every net-worth projection.', action: 'Use the scenarios page to re-run at 2.5% and 4.5%; treat the output as a range, not a forecast.', s: null },
      { id: 'F16', sev: 'high', area: 'Owner data — completeness', what: 'The owner\'s original year-by-year tax and assessment spreadsheet was not available when this site was built. The 2026-2014 Cupertino grid is therefore shown as owner-provided but unrecoverable, and the 2016-2025 San Francisco assessment column is DERIVED from the owner\'s own recorded 2016 base year escalating at 2% a year to the recorded 2025 value of $114,248 (the working log recorded $96,557 for 2016, which does not reconcile to $114,248 at 2% a year).', why: 'Project rule: never infer a value that cannot be confirmed. The recoverable figures are shown; the rest is left blank and flagged.', action: 'OWNER: supply the original two columns (assessed value and property tax by year) for both properties so the tables can be restored verbatim.', s: null },
      { id: 'F16b', sev: 'medium', area: 'PROPERTY_SF — water and sewer', what: 'The official SFPUC rate build-up produces about $455 per month for water, wastewater and stormwater across the three units, above the owner\'s observed $330 - $400 band.', why: 'The gap is explained by usage, meter size and stormwater tier, none of which are confirmed.', action: 'Reconcile against twelve months of SFPUC bills; if the owner figure is right, find out why — a shared or master meter with tenant sub-metering would do it.', s: 'sfpuc-rates' }
    ]
  };

  /* ====================================================================== */
  /*  DECISION MATRIX (headline)                                              */
  /* ====================================================================== */

  const decisions = {
    title: 'Decision matrix — the five options that matter',
    note: 'The financial figures are computed live on the scenarios page from the assumptions table. The verdict column is the analysis; it does not depend on the precise numbers.',
    head: ['Property', 'Option', 'What it looks like', 'Verdict'],
    rows: [
      [T('PROPERTY_CUPERTINO'), T('A. Live in it'), T('Keep it in the trust, keep the low Prop 13 base, and occupy it. Property tax stays near $9,000 - $10,000 a year in 2045 on an asset worth about $6 million, and Prop 19 would then be a bonus rather than a necessity.'), T('RECOMMENDED — best risk-adjusted outcome, and it keeps the Prop 19 claim available.')],
      [T('PROPERTY_CUPERTINO'), T('B. Rent it'), T('Same tax outcome as A, plus market rent instead of housing. But Prop 19 requires the transferee to occupy the property as a principal residence — if the heirs rent it, the exclusion is removed when it stops qualifying, and a rented house cannot qualify at all.'), T('ONLY IF THE TRUST BASE IS PRESERVED AND PROP 19 IS NOT NEEDED — otherwise you are running the reassessment risk for nothing.')],
      [T('PROPERTY_CUPERTINO'), T('C. Sell and reinvest'), T('At 2045 the market value is roughly $6 million. Selling produces a small capital gain (about $208,000 after one more year of appreciation) taxed at up to 37.1%, plus about 2% sale costs and 0.11% state transfer tax. The proceeds then compound at the assumed portfolio return with no property tax at all.'), T('NOT RECOMMENDED while the base is preserved — you would be giving up a very cheap, appreciating shelter to pay tax on a small gain. Sell only if the trust base is NOT preserved or if liquidity is needed.')],
      [T('PROPERTY_SF'), T('D. Hold and rent after inheritance'), T('Three units producing about $85,800 of gross rent. Without a Prop 19 exclusion the building is reassessed to market value at death — roughly $3.5 million in 2045 — which turns the property tax from about $2,000 a year into about $41,000 a year and cuts net operating income from roughly $69,000 to roughly $30,000.'), T('NOT RECOMMENDED without a written opinion that the base is preserved — this is the single largest financial risk in the plan.')],
      [T('PROPERTY_SF'), T('E. Sell after inheritance'), T('About $3.5 million gross, less the SF transfer tax (0.75% at the $1M-$5M band, applied to the whole price), 0.11% state tax, about 2.5% sale costs, and capital-gain tax on the small post-death gain. No property tax afterwards.'), T('RECOMMENDED if the base is not preserved — selling after death captures the §1014 step-up, so the gain is only the appreciation since death.')]
    ]
  };

  /* ====================================================================== */
  /*  ASSET SNAPSHOT                                                          */
  /* ====================================================================== */

  const snapshot = {
    title: 'Asset snapshot — November 2026',
    head: ['', 'PROPERTY_CUPERTINO', 'PROPERTY_SF'],
    rows: [
      [T('ZIP'), W('95014', null, 'Owner-provided.'), W('94122', null, 'Owner-provided.')],
      [T('Type'), W('Single-family house', null, 'Owner-provided.'), W('3-unit residential building', null, 'Owner-provided.')],
      [T('Market value (Nov 2026)'), W('$3,100,000', null, 'Owner-provided.'), W('$1,800,000', null, 'Owner-provided.')],
      [T('Assessed value (2026)'), U(null, 'Not recoverable from the owner\'s source spreadsheet at build time — flag F16. The model uses a clearly-labelled illustrative placeholder; the reassessment scenarios do not depend on it.'), D('$116,533', null, '$114,248 (owner, 2025) escalated one year at the Prop 13 2% cap.')],
      [T('Ad valorem tax rate'), O('1.14880% (typical TRA)', 'scc-assessor-booklet', 'Base case. Parcel TRA not confirmed — flag F5.'), O('1.18162182% (FY2026-27)', 'sftreasurer-secured', 'Published secured rate.')],
      [T('Property tax, 2026'), D('$6,325 (illustrative)', 'scc-assessor-booklet', 'Illustrative placeholder assessed value x 1.1488%. Re-run with the parcel\'s actual assessed value.'), D('$1,377', 'sftreasurer-secured', '$116,533 x 1.18162%.')],
      [T('Gross rent'), T('None today (owner-occupied)'), W('$85,800 / year', null, 'Owner-provided: $7,150 / month from two units.')],
      [T('Water + sewer (no stormwater utility in Cupertino)'), D('~$2,109 / year', 'sjwc-sched1', 'Water $1,290 + WRAP $17 + sewer $802. See the cost build-up.'), D('~$5,462 / year', 'sfpuc-rates', 'Water $2,190 + wastewater $2,917 + stormwater $355.')],
      [T('Electricity'), W('Net credit (~$180 / year)', null, 'Owner-provided net credit from solar.'), U('pge-rate-advisory', 'Official rate implies ~$609 / month for three units at average use; the owner reports $30 - $70. Flag F6.')],
      [T('Insurance'), U('ca-doi', 'No official price. Modelled $1,500 - $5,000.'), U('ca-doi', 'No official price. Modelled $1,500 - $4,000.')],
      [T('Maintenance & repair'), A('~$19,500 / year', null, '$4,000 + 0.50% capital reserve.'), A('~$25,500 / year', null, '$12,000 + 0.75% capital reserve.')],
      [T('Prop 19 eligible at death?'), P('Likely yes, if it is the owner\'s principal residence', 'ca-rtc-63-2', 'Subject to the 1-year occupancy and exemption tests and to the trust drafting.'), P('Likely NO — it is an investment property', 'boe-prop19', 'Prop 19 covers the transferor\'s principal residence only. Flag F11.')]
    ]
  };

  /* ====================================================================== */
  /*  CAPITAL GAINS AND TRANSFER TAXES                                       */
  /* ====================================================================== */

  const capgains = {
    title: 'What a sale of either property would cost',
    note: 'These are the rates that apply if the property is sold. Because both properties are held inside a revocable trust, they are in the decedent\'s gross estate, so the heirs receive a fresh basis at fair market value on the date of death (IRC §1014) and the taxable gain is only the appreciation since death.',
    head: ['Item', 'Rate / rule', 'Basis', 'Source'],
    rows: [
      [T('Basis after the inheritance'), O('Fair market value at the date of death', 'irs-tc409', 'Topic no. 409 directs inherited assets to Publication 551 for basis.'), T('official'), T('irs-tc409')],
      [T('Federal long-term capital-gain rate'), O('0% / 15% / 20%', 'irs-tc409', 'Topic no. 409: the maximum rate is 20%; 0% applies up to $49,450 (single) and 15% up to $545,500 for 2026.'), T('official'), T('irs-tc409')],
      [T('2026 capital-gain brackets'), O('0% up to $49,450; 15% up to $545,500; 20% above (single)', 'irs-rp-25-32', 'Rev. Proc. 2025-32 §4.03. Married filing jointly: $98,900 and $613,700.'), T('official'), T('irs-rp-25-32')],
      [T('California tax on the gain'), O('12.3% plus the 1% Mental Health Services Tax above $1,000,000 of taxable income', 'ftb-2026-schedules', '2026 California Tax Rate Schedules, Schedule X. California does not give a preferential rate to long-term capital gains.'), T('official'), T('ftb-2026-schedules')],
      [T('Net investment income tax'), O('3.8% above $250,000 MAGI (married filing jointly) or $200,000 (single)', 'irs-tc559', 'Topic no. 559: net gains from the disposition of real estate are net investment income.'), T('official'), T('irs-tc559')],
      [T('California documentary transfer tax'), O('$1.10 per $1,000 of consideration (0.11%)', 'ca-rtc-11911', 'R&T §11911(a): $0.55 for each $500 of consideration when consideration exceeds $100.'), T('official'), T('ca-rtc-11911')],
      [T('San Francisco city transfer tax'), O('$3.75 per $500 (0.75%) for a price of $1,000,000 to $4,999,999', 'sf-gov-transfer-tax', 'The band rate applies to the ENTIRE consideration, not marginally.'), T('official'), T('sf-gov-transfer-tax')],
      [T('San Francisco recording'), O('Transfer tax affidavit and a Preliminary Change of Ownership Report must be filed with the deed', 'sf-assessor-recorder', 'Both are required for every transfer, including transfers that are exempt; the Assessor-Recorder publishes the same tiered transfer-tax table and collects the recording fees with the deed.'), T('official'), T('sf-assessor-recorder')],
      [T('Santa Clara County transfer tax'), O('No city transfer tax; the state and county documentary transfer tax applies', 'ca-rtc-11911', 'Cupertino has not adopted its own city transfer tax, so only the $1.10 per $1,000 applies.'), T('official'), T('ca-rtc-11911')],
      [T('Sale costs (brokerage, escrow, title, recording)'), A('2.00% (Cupertino) / 2.50% (San Francisco)', null, 'Planning assumption — not published by any official source.'), T('assumption'), T('See the assumptions table for the low and high band.')],
      [T('Rental income taxation'), O('Rents are ordinary income and are net investment income for NIIT purposes', 'irs-tc559', 'Topic no. 559 lists rents as net investment income.'), T('official'), T('irs-tc559')]
    ]
  };

  /* ------------------------------------------------------------------ export */
  return {
    meta: {
      title: 'Inheritance Decision Dashboard',
      tagline: 'Two properties, one trust decision, and a 2040-2050 timeline: what each property costs to hold, what it costs to transfer, and which choice wins.',
      asOf: '6 November 2026',
      horizon: '2026 - 2050',
      privacy: 'All personal information is replaced with placeholders. OWNER, HEIR_A, HEIR_B, PROPERTY_CUPERTINO and PROPERTY_SF are used throughout. No address, parcel number, account number or name appears anywhere on this site.'
    },
    sources: sources,
    props: { cupertino: cupertino, sf: sf },
    assumptions: assumptions,
    thresholds: thresholds,
    capgains: capgains,
    prop19: prop19,
    pending: pending,
    process: process,
    flags: flags,
    decisions: decisions,
    snapshot: snapshot
  };
})();
