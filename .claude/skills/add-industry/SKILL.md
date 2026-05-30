---
name: add-industry
description: Add a new industry vertical to ChemSurplus so buyers in that industry get a personalized marketplace + a dedicated SEO page. Use when the user wants to support a new buyer segment (e.g. "add an agriculture industry", "support electronics buyers"). Edits seo/industries.json and runs build.ps1.
---

# add-industry

Industries power the personalized experience: a buyer picks one and only sees relevant surplus. `seo/industries.json` is the single source of truth — it generates both the runtime taxonomy (`assets/js/industries.js`) and the SEO landing page (`industries/<slug>.html`).

## Inputs to gather
- Industry **name** + **slug** (kebab-case).
- An **icon** key from `assets/js/app.js` ICONS (pill, sparkle, brush, spray, food, water, link, oil, grid, …) — or add a new inline SVG to ICONS.
- Which existing **categories** are relevant (slugs from CATEGORIES in `assets/js/data.js`).
- Which **suppliers** serve it (slugs from `seo/suppliers.json`).

## Steps

1. Read `seo/industries.json`, `seo/suppliers.json`, and `SOUL.md`.

2. Append to `industries[]`:
   ```json
   {
     "slug": "...", "name": "...", "icon": "<iconKey>",
     "tagline": "<one line, on-voice>",
     "categories": ["<cat-slug>", "..."],
     "exampleChemicals": ["...", "..."],
     "suppliers": ["<supplier-slug>", "..."],
     "pains": ["<buyer pain>", "...", "..."],
     "title": "Surplus Chemicals for <Industry> | ... — ChemSurplus",
     "metaDescription": "<≤158 chars>"
   }
   ```

3. **Tag listings** so the new industry has inventory: in `assets/js/data.js`, add the new slug to the `industries:[...]` array of any relevant `SEED_LISTINGS` (also category-matched lots appear automatically via `listingsForIndustry`).

4. Bump `seo/industries.json` `meta.lastUpdated`.

5. Rebuild: `powershell -ExecutionPolicy Bypass -File build.ps1`

6. Verify (preview_eval): on `buy.html?industry=<slug>` the banner shows the industry, every shown lot is relevant, the switcher includes it, and `industries/<slug>.html` + the homepage `#indGrid` card exist. Confirm it's in `sitemap.xml`.

## Rules
- Never hand-edit `assets/js/industries.js` or `industries/*.html` — they're generated.
- Make sure at least a few listings map to the industry (by tag or category) or the personalized view will be empty.
- Voice per `SOUL.md`; keep `.ps1` untouched (only data changes here).
