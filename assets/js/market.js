/* ChemSurplus - market reference data (INDICATIVE, 2025 wholesale benchmarks).
   Powers the savings estimator and the market-opportunity map. These are PUBLIC market
   benchmarks + savings bands - NOT our lot quote prices (those stay quote-only).
   Refresh quarterly; sources: ICIS, ChemAnalyst, Intratec, S&P Global, Methanex, Waste Optima. */
const CS_MARKET = {
  surplusBand: { low: 0.30, high: 0.70 },           // 30-70% below market (industry-observed)
  tiers: {
    "overstock":  { low: 0.20, high: 0.40, label: "Overstock - meets prime spec" },
    "off-spec":   { low: 0.40, high: 0.70, label: "Off-spec / wide-spec" },
    "distressed": { low: 0.50, high: 0.70, label: "Distressed / forced liquidation" }
  },
  disposal: { drumLow: 146, drumHigh: 381, tonLow: 200, tonHigh: 1000 },  // USD avoided cost
  /* reference wholesale price (USD per kg), indicative 2025 */
  chemicals: [
    { slug: "isopropyl-alcohol",            name: "Isopropyl Alcohol (IPA)",   refLow: 1.05, refHigh: 1.60 },
    { slug: "acetone",                      name: "Acetone",                   refLow: 0.58, refHigh: 0.80 },
    { slug: "toluene",                      name: "Toluene",                   refLow: 0.75, refHigh: 1.40 },
    { slug: "ethyl-acetate",                name: "Ethyl Acetate",             refLow: 0.90, refHigh: 1.55 },
    { slug: "methanol",                     name: "Methanol",                  refLow: 0.33, refHigh: 0.89 },
    { slug: "mek",                          name: "Methyl Ethyl Ketone (MEK)", refLow: 1.06, refHigh: 1.46 },
    { slug: "titanium-dioxide",             name: "Titanium Dioxide",          refLow: 2.00, refHigh: 2.10 },
    { slug: "sodium-hydroxide",             name: "Caustic Soda (NaOH)",       refLow: 0.40, refHigh: 0.45 },
    { slug: "citric-acid",                  name: "Citric Acid",               refLow: 0.62, refHigh: 0.83 },
    { slug: "soda-ash",                     name: "Soda Ash",                  refLow: 0.23, refHigh: 0.28 },
    { slug: "hydrochloric-acid",            name: "Hydrochloric Acid",         refLow: 0.10, refHigh: 0.19 },
    { slug: "polyethylene-glycol-peg-400",  name: "PEG-400",                   refLow: 1.10, refHigh: 1.23 },
    { slug: "glycerin",                     name: "Glycerin",                  refLow: 1.00, refHigh: 1.05 },
    { slug: "propylene-glycol",             name: "Propylene Glycol",          refLow: 0.80, refHigh: 1.50 },
    { slug: "calcium-carbonate",            name: "Calcium Carbonate",         refLow: 0.05, refHigh: 0.52 },
    { slug: "epoxy-resin",                  name: "Epoxy Resin (BPA)",         refLow: 1.96, refHigh: 4.54 },
    { slug: "sodium-laureth-sulfate",       name: "SLES (70%)",                refLow: 0.79, refHigh: 1.43 },
    { slug: "cocamidopropyl-betaine",       name: "Cocamidopropyl Betaine",    refLow: 0.99, refHigh: 4.50 },
    { slug: "xanthan-gum",                  name: "Xanthan Gum",               refLow: 2.00, refHigh: 2.13 },
    { slug: "zinc-oxide",                   name: "Zinc Oxide",                refLow: 1.41, refHigh: 3.25 }
  ],
  /* geographic arbitrage: cheap source regions -> expensive buyer regions */
  regions: {
    sources: [
      { name: "US Gulf Coast", role: "Primary supply origination", why: "Densest cluster of world-scale plants on cheap shale gas/ethane - the most physical surplus, off-spec and distressed lots are generated here." },
      { name: "Middle East",   role: "Low-cost exporter",          why: "Advantaged gas/ethane feedstock; e.g. Iran is ~11% of global methanol capacity." },
      { name: "China",         role: "Oversupplied exporter",      why: "~70% of 2020-25 global ethylene capacity additions; now exports excess, depressing prices elsewhere." }
    ],
    buyers: [
      { name: "Europe (EU)",     role: "Premium buyer",        why: "Highest-cost region (gas ~3x US), shrinking domestic capacity - the largest market-vs-surplus saving gap." },
      { name: "India / Asia",    role: "Growth-demand buyer",  why: "Largest, fast-growing demand center; import-reliant for solvents, methanol, surfactant feedstocks." },
      { name: "Latin America",   role: "Import-dependent",     why: "Limited local commodity capacity; pulls from US Gulf Coast." }
    ]
  },
  /* notable regional spreads (USD/kg) - the 'savings story' */
  spreads: [
    { name: "Epoxy Resin (BPA)",       asia: 1.96, us: 2.80, eu: 4.54, premium: "EU ~130% above Asia" },
    { name: "Zinc Oxide",              asia: 1.41, us: 3.25, eu: null, premium: "US ~130% above NE Asia" },
    { name: "Isopropyl Alcohol",       asia: 1.07, us: 1.30, eu: 1.57, premium: "EU ~47% above Asia" },
    { name: "Methanol",                asia: 0.41, us: 0.74, eu: null, premium: "US ~50-80% above China" },
    { name: "MEK",                     asia: 1.06, us: 1.46, eu: null, premium: "US ~38% above SE Asia" },
    { name: "Toluene",                 asia: 0.76, us: 1.06, eu: null, premium: "US ~40% above China" },
    { name: "Acetone",                 asia: 0.58, us: 0.76, eu: null, premium: "US ~31% above SE Asia" }
  ]
};
function marketChem(slug) { return CS_MARKET.chemicals.find(c => c.slug === slug); }
