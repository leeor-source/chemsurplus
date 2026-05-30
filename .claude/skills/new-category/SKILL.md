---
name: new-category
description: Add a new chemical category to the ChemSurplus marketplace — taxonomy, sample listings, an icon, and a matching SEO landing page. Use when the user wants to support a new product type/category of chemicals (e.g. "add a fragrances category").
---

# new-category

Add a chemical category end-to-end so it shows in filters, the marketplace, the homepage, and search.

## Inputs
- Category **name** + desired **slug** (kebab-case).
- Which **icon** to reuse from the set in `assets/js/app.js` (`flask, beaker, drop, vial, bubbles, hazard, grid, atom`) — or add a new inline SVG to `ICONS`.

## Steps

1. **Taxonomy** — add to `CATEGORIES` in `assets/js/data.js`:
   ```js
   { slug: "<slug>", name: "<Name>", icon: "<iconKey>" }
   ```
   If using a new icon, add an inline SVG entry to `ICONS` in `assets/js/app.js`.

2. **Seed listings** — add 1–3 realistic lots to `SEED_LISTINGS` in `assets/js/data.js` with `cat: "<slug>"`. Match the existing object shape (id, name, cas, grade, qty, pkg, condition, region, price, list, unit, docs[], dated). Use believable CAS numbers and pricing 30–70% below `list`.

3. **SEO page** — follow `/add-landing-page`: add a `landingPages[]` (+ `keywordBank[]`) entry in `seo/keywords.json` with `relatedCat: "<slug>"`, then run `build-seo.ps1`.

4. **Surface it** — the homepage and buy-page category pills render from `CATEGORIES` automatically, and filters rebuild from data, so no further HTML edits are needed. Verify:
   - `buy.html?cat=<slug>` filters to the new lots.
   - The new category pill appears on `index.html#categories`.
   - `categories/<slug-page>.html` generated and in `sitemap.xml`.

## Rules
- Keep listings plausible and documented (every lot has SDS at minimum) — per `SOUL.md` "trust before volume".
- Reuse CSS tokens and the existing icon style; inline SVG only.
