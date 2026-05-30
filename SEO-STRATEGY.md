# ChemSurplus — SEO Strategy

> The site is **SEO-led**: every page targets a researched keyword cluster, ships server-rendered HTML (no JS required to read content), and is fed by a single keyword bank that regenerates landing pages + sitemap on demand.

_Last keyword refresh: **2026-05-30**. Source: live SERP analysis of ChemDeals, Jaxon Chemical Exchange, SUR+ International, Waste Optima, LabX, Chem-Outlet + search-intent modelling._

---

## 1. Market & competitive read

Surplus / excess chemical trading is an established but **fragmented, low-design** niche. Incumbents (ChemDeals, Jaxon Chemical Exchange, SUR+ International, Waste Optima, Chem-Outlet, LabX, Premium Surplus) compete mostly on inventory, not on UX or organic content. That's the opening: **win on structured, keyword-targeted content + a modern dual-sided UX.**

Two recurring proof points to lean on in copy (both improve E-E-A-T):
- **30–70% below wholesale** is the buyer-side value (Waste Optima, LabX pricing).
- **EPA recommends reuse before disposal** — reclaimed chemicals aren't classed as waste. This is the seller-side hook and a trust/authority signal.

## 2. Audience → intent → page

| Audience | Persona | Search intent | Primary landing page |
|---|---|---|---|
| **Sellers (first users)** | Manufacturers, distributors, contract labs, plants with dead stock | "sell / liquidate / dispose excess chemical inventory" | `sell.html`, `categories/excess-chemical-inventory`, `chemical-liquidation`, `obsolete-chemicals` |
| **Buyers (secondary)** | Procurement, formulators, smaller manufacturers, labs, brokers | "buy surplus / discount / spot chemicals" | `buy.html`, all `surplus-*` + `off-spec` / `overstock` / `short-dated` / `spot` pages |

## 3. Keyword architecture (hub & spoke)

```
index.html ............... CORE: "surplus chemicals", "surplus chemicals marketplace"
├── sell.html ............ "sell surplus chemicals", "sell excess chemical inventory"
│   ├── excess-chemical-inventory
│   ├── chemical-liquidation
│   └── obsolete-chemicals ("how to dispose of surplus chemicals")
├── buy.html ............. "buy surplus chemicals", "discounted industrial chemicals"
│   ├── off-spec-chemicals / overstock-chemicals / short-dated-chemicals / spot-chemicals
│   └── surplus-{solvents, specialty-chemicals, lab-reagents, surfactants,
│                  resins-coatings, acids-bases}   ← category spokes
```

Every spoke links **up** to its hub and **across** to 6 siblings (see `internal-links` block) — building topical authority around "surplus chemicals."

The full bank with volume / difficulty / intent lives in **`seo/keywords.json` → `keywordBank`**.

## 4. On-page SEO shipped on every page

- Unique, keyword-front-loaded `<title>` (≤ 60 chars) + `<meta description>` (≤ 158 chars).
- `rel="canonical"`, `robots`, Open Graph / Twitter cards.
- **Structured data (JSON-LD):** `Organization` + `WebSite` (Sitelinks search box) on home; `BreadcrumbList` + `FAQPage` on every landing page; `HowTo` on `sell.html`; `CollectionPage` on `buy.html`. → eligible for FAQ rich results & breadcrumb trails.
- Semantic HTML, one `<h1>`, descriptive `alt`/`aria` on SVGs.
- Fast by construction: static HTML, inline SVG (no image weight), system+Google fonts with `preconnect`, no framework/JS needed to render content.
- `sitemap.xml` (17 URLs) + `robots.txt`.

## 5. The SEO engine — build & update loop

The differentiator: **content is data-driven and regenerable.**

```
seo/keywords.json   ──>   build-seo.ps1   ──>   categories/*.html  +  sitemap.xml
   (the bank)              (the generator)        (the live pages)
```

**To update SEO (run on any cadence — see §6):**

1. Edit `seo/keywords.json`:
   - Add/adjust entries in `keywordBank` (volume, difficulty, intent) from fresh keyword data.
   - Add a new object to `landingPages[]` to spin up a brand-new keyword page (slug, title, meta, h1, intro, faqs, relatedCat).
   - Bump `meta.lastUpdated`.
2. Run the generator:
   ```powershell
   powershell -ExecutionPolicy Bypass -File build-seo.ps1
   ```
3. Deploy the static folder. Resubmit `sitemap.xml` in Google Search Console.

Adding a page = adding ~12 lines of JSON. No templates to touch.

## 6. Keeping it updated (the "smart, always-fresh" part)

- **Monthly:** re-pull keyword volumes/competitors, edit `keywordBank`, regenerate. (Can be automated with Claude Code `/schedule` or a cron job that re-runs research + `build-seo.ps1`.)
- **Per new inventory category:** add a `landingPages` entry → instant indexable page.
- **Quarterly content refresh:** update intros/FAQs (freshness is a ranking factor) and bump `lastUpdated` (feeds `<lastmod>` in the sitemap).
- **Track:** impressions/clicks per landing page in Search Console; promote winners, rewrite losers.

## 6b. Industry layer (personalization + SEO)

A second content engine runs in parallel: **industry verticals**. `seo/industries.json` → `build-industries.ps1` generates both the per-industry SEO pages (`industries/*.html`, e.g. "Surplus Chemicals for the Pharmaceutical Industry") **and** the runtime taxonomy (`assets/js/industries.js`) that personalizes the marketplace. One source of truth, so the SEO page and the on-site experience never diverge.

- **SEO value:** each `industries/<slug>.html` targets "surplus chemicals for <industry>" + CollectionPage/Breadcrumb JSON-LD, and funnels to `buy.html?industry=<slug>`.
- **Conversion value:** a buyer arriving from an industry query lands in a marketplace pre-filtered to their world (no irrelevant chemistry), with each lot attributed to the verified broker (`seo/suppliers.json`) that holds it.
- **Positioning:** we are the clean interface over fragmented brokerages — the industry layer is how that promise is felt.

Add a vertical with `/add-industry` (data-only; rebuild with `build.ps1`).

## 7. Off-page / next steps (not code)

- Programmatic per-CAS / per-chemical pages (e.g. `/chemical/isopropyl-alcohol`) generated from live listings — huge long-tail surface.
- Supplier directory + buyer guides (informational top-of-funnel).
- Backlinks from chemical-industry directories, sustainability/circular-economy press (the reuse angle), and trade associations.
- Server-side rendering of live listings into each category page for fresh, indexable inventory.

---

### File map
| File | Role |
|---|---|
| `seo/keywords.json` | Keyword bank + page definitions (**edit this**) |
| `build-seo.ps1` | Generator → landing pages + sitemap (**run this**) |
| `sitemap.xml` / `robots.txt` | Crawl directives (generated / static) |
| `index/buy/sell/how-it-works.html` | Core hand-built pages |
| `categories/*.html` | Generated keyword landing pages |
