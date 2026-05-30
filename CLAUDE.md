# CLAUDE.md — ChemSurplus

Project guide for Claude Code. Read `SOUL.md` for product identity, voice, and personas before writing any user-facing copy.

## What this is
**ChemSurplus** — an SEO-led B2B marketplace for surplus, excess & obsolete chemicals. We are the **clean discovery/interface layer**; existing brokerages (ChemDeals, Altiras, Tychem, Waste Optima, …) are the **actual suppliers** that hold the stock. See `seo/suppliers.json` for the consolidated research.

Two audiences:
- **Sellers (first users):** manufacturers, distributors, contract labs with dead/excess stock. Job: recover value, avoid disposal cost, free warehouse space.
- **Buyers (secondary):** procurement, formulators, smaller manufacturers, labs, brokers. Job: source quality chemicals 30–70% below market.

**Industry personalization (core UX):** a buyer picks their industry (pharma, coatings, food, …) and the marketplace shows *only* relevant surplus, each lot attributed to the broker who holds it. Chosen industry persists in `localStorage` (`cs_industry`) and via `?industry=<slug>`.

## Stack & constraints
- **100% static** HTML / CSS / vanilla JS. **No build step. No framework. No Node** (not installed; Python is only the Windows Store stub).
- Windows host → use **PowerShell**. Scripts are PowerShell 5.1 compatible.
- All imagery is **inline SVG** — never add binary image assets.
- Fonts load **non-render-blocking** (`media="print" onload` swap). Keep it that way (Core Web Vitals = SEO).

## Layout
```
index.html buy.html lot.html rfq.html sell.html how-it-works.html 404.html   core hand-built pages
categories/*.html        GENERATED (build-seo.ps1) — never hand-edit
industries/*.html        GENERATED (build-industries.ps1) — never hand-edit
assets/css/styles.css    design system (all tokens in :root)
assets/js/ data.js        categories, seed listings (tagged supplier+industries), getAllListings(),
                          industry helpers (listingsForIndustry, get/setIndustry), complianceBadges()
           app.js         nav + inline SVG icon set (icon(name))
           industries.js  GENERATED — runtime INDUSTRIES taxonomy (DO NOT hand-edit)
           suppliers.js   GENERATED — runtime SUPPLIERS + supplierName/supplierInfo (DO NOT hand-edit)
           marketplace.js BUYER discover: personalized render/search/filter/sort + supplier attribution
           lot.js         BUYER evaluate: lot.html?id= detail page (docs, trust, supplier, sticky CTA)
           rfq.js         shared RFQ "cart" (localStorage cs_rfq) + nav badge + toast
           rfq-page.js    BUYER convert: rfq.html list + minimal quote form
           sell.js        SELLER: calculator + 3-step form + dashboard
seo/keywords.json        keyword bank + landingPages[]   (SOURCE OF TRUTH for category SEO)
seo/industries.json      industry taxonomy + pages        (SOURCE OF TRUTH for industries + industries.js)
seo/suppliers.json       brokerage research               (SOURCE OF TRUTH for suppliers.js — the real suppliers)
build.ps1               master: runs build-seo then build-industries (USE THIS)
build-seo.ps1           keywords.json -> categories/*.html
build-industries.ps1    industries.json + suppliers.json -> industries/*.html + industries.js + suppliers.js + sitemap
serve.ps1               local static server (HttpListener)
```

**Buyer journey:** industry pick (`index#industries` / `buy?industry=`) → browse (`buy.html`) → evaluate (`lot.html?id=`) → add to RFQ (`cs_rfq`) → request quote (`rfq.html`) → confirmation. Deploy: see `DEPLOY.md` (static, generated files committed, no server build).

## The engines — how to work on them
Content is **data-driven**. Edit data and regenerate; never hand-write generated pages.
- **Category SEO:** edit `seo/keywords.json` → it generates `categories/*.html`.
- **Industries + personalization:** edit `seo/industries.json` → it generates `industries/*.html` AND `assets/js/industries.js` (the runtime taxonomy). This is the single source of truth, so the personalized UI and the SEO pages never drift.
- **Always rebuild via the master:** `powershell -ExecutionPolicy Bypass -File build.ps1` (writes the complete sitemap covering core + categories + industries). Bump `meta.lastUpdated` in the edited JSON first.

See skills: `/seo-refresh`, `/add-landing-page`, `/new-category`, `/add-industry`.

## Run / preview
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8099   # http://localhost:8099/
```

## Conventions
- Every page: unique keyword-front-loaded `<title>` (≤60 chars) + meta description (≤158), canonical, OG, and JSON-LD. New page types need matching schema.org markup.
- Keep one `<h1>` per page; descriptive `alt`/`aria` on SVGs.
- Match existing CSS tokens (`var(--teal)`, `var(--mint)`, …) — don't introduce new hex colors ad hoc.
- Seed listings live in `assets/js/data.js`; seller-submitted lots persist to `localStorage` (`cs_listings`) and merge via `getAllListings()`.

## Gotchas (learned the hard way)
- **Reading JSON in PowerShell:** always `Get-Content $path -Raw -Encoding UTF8` — without it, em/en dashes become `â€"` mojibake.
- **Keep `.ps1` source pure ASCII.** PowerShell 5.1 reads script files as ANSI (no BOM), so a literal `—`/smart-quote in the *script* breaks parsing. Non-ASCII is fine *inside generated output strings* (here-strings) — just not in the PS source itself. Use HTML entities (`&mdash;` `&ndash;` `&copy;`) in templates.
- **serve.ps1:** do NOT set `Response.KeepAlive = $false` — it forces chunked encoding, conflicts with `ContentLength64`, and throws ProtocolViolationException (hangs the browser).
- `categories/`, `industries/`, and `assets/js/industries.js` are generated output — changes there are overwritten on the next build.
- Verify UI logic with `preview_eval` (DOM inspection) when the screenshot renderer is unavailable — it proves behavior, not just looks.

## Definition of done for SEO changes
JSON updated → `build-seo.ps1` run clean → spot-check one generated page for resolved template + correct encoding → `sitemap.xml` URL count matches page count.
