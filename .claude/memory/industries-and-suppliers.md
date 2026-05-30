# Industries & suppliers (personalization model)

ChemSurplus = clean **interface layer**; existing brokerages = the **actual suppliers** that hold stock. Researched and consolidated in `seo/suppliers.json` (12 brokers: ChemDeals, Altiras, Tychem, Waste Optima, Providence, Allchem, Stobec, Advanced Chemical Exchange, SUR+ International, Lab Alley, repurposedMATERIALS, Camachem). Their common UX failings (raw tables, contact-to-inquire, no personalization, dated design) = our wedge.

**Industry personalization (core UX):** buyer picks an industry → sees only relevant surplus. 9 industries in `seo/industries.json`: pharma, personal-care, coatings, cleaning, food, plastics, water-treatment, adhesives, oil-gas. Segmentation is based on real brokerage taxonomy (ChemDeals' industry list).

**Mechanics:**
- Chosen industry persists in `localStorage` `cs_industry` and via `?industry=<slug>`.
- `listingsForIndustry(slug)` shows a lot if its `industries[]` tag includes the slug OR its category is in the industry's `categories[]`.
- Each `SEED_LISTINGS` entry has `supplier` + `industries[]`; cards show "via <Broker> · verified".
- `index.html#industries` = industry picker cards; `buy.html` = banner + switcher + scoped filters.

**Build:** `seo/industries.json` → `build-industries.ps1` generates `industries/*.html` AND `assets/js/industries.js` (runtime). Single source of truth → no drift. Use `build.ps1` (runs both generators + full sitemap). See [seo-engine](seo-engine.md), [gotchas](gotchas.md). Skill: `/add-industry`.
