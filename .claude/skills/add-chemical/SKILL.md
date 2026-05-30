---
name: add-chemical
description: Add a per-chemical / per-CAS SEO page to ChemSurplus. Use when you want a dedicated landing page for a specific chemical (targets "surplus [chemical] for sale" + the CAS number). Edits seo/chemicals.json and runs build-chemicals.ps1.
---

# add-chemical

Per-CAS pages are a top SEO play (high-intent, low-competition). They're data-driven from `seo/chemicals.json` → `build-chemicals.ps1` → `chemical/<slug>.html` (+ the A-Z `chemicals.html` index). Live lots are matched to the page by CAS at runtime.

## Steps
1. Read `seo/chemicals.json`.
2. Append a chemical object:
   ```json
   { "slug":"<kebab>", "name":"<Name>", "cas":"<CAS>", "formula":"<e.g. C3H8O>",
     "mw":"<g/mol>", "synonyms":["..."], "cat":"<category-slug>",
     "industries":["..."], "priceLow":0.00, "priceHigh":0.00, "offerCount":1, "unit":"kg",
     "applications":["...","..."], "desc":"<2-3 sentence intro, accurate, on-voice>" }
   ```
   - `formula`/`mw` power `ChemicalSubstance` schema (omit for mixtures — use `"cas":"Mixture"`).
   - `priceLow/High/offerCount` summarize current lots for AggregateOffer schema (prices are NOT shown to users; pricing is quote-only).
3. Ensure at least one lot with that CAS exists in `data/broker-feeds.json` (so the page shows live lots) — otherwise the page renders an empty-state. See `/add-broker-feed`.
4. Run `powershell -ExecutionPolicy Bypass -File build-chemicals.ps1` (or `build.ps1`).
5. Verify: `chemical/<slug>.html` exists, schema present (Breadcrumb + Product + ChemicalSubstance), live lots render by CAS, it's in `chemicals.html` and `sitemap-chemicals.xml`. Deploy via `/deploy`.

## Rules
- Accurate CAS/formula/MW. Voice per `SOUL.md`. Never hand-edit generated `chemical/*.html`.
