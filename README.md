# ChemSurplus

**The B2B marketplace for surplus, excess & obsolete chemicals.**
Sellers recover value from dead stock; buyers source verified chemicals 30–70% below market — SDS/COA on every lot.

A static, **SEO-led** site (no build tooling required) with two distinct interfaces — a seller flow and a buyer marketplace — plus a data-driven SEO engine that regenerates keyword landing pages and the sitemap on demand.

---

## Run it locally

No Node/Python needed — a small PowerShell static server is included:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8099
# then open http://localhost:8099/
```

(Or just open `index.html` directly in a browser — everything is relative-path and works over `file://` too.)

## The interfaces & journeys

| Interface | File | What it does |
|---|---|---|
| **Buyer — discover** | `buy.html` | Industry-personalized marketplace: pick an industry → see only relevant surplus. Search by name/CAS/grade, faceted filters, sort, supplier attribution on every card. |
| **Buyer — evaluate** | `lot.html?id=` | Lot detail page (the conversion centerpiece): identity + CAS/grade, lot specifics, SDS/COA/TDS doc strip, compliance badges, verified-broker profile, pricing with volume hint, sticky **Request a quote** + **Add to RFQ**. |
| **Buyer — convert** | `rfq.html` | RFQ "list" (the B2B cart): review lots across multiple brokers, submit one ≤5-field quote request, confirmation + saved request. |
| **Seller (first users)** | `sell.html` | Value-recovery calculator, 3-step listing form, live dashboard. New listings persist to `localStorage` and appear in the buyer marketplace. |

Full buyer journey: **industry pick → browse → lot detail → RFQ list → quote request → confirmation.**

Supporting pages: `index.html` (SEO home + industry picker), `how-it-works.html`, 13 generated keyword pages in `categories/`, 9 generated industry pages in `industries/`.

## Deploy it (make it live)

Static site, all generated files committed → no server build. See **[DEPLOY.md](DEPLOY.md)** for GitHub Pages (workflow included), Netlify, Vercel, or VPS/nginx, plus custom-domain DNS. Quick start: push to GitHub, then Settings → Pages → Source: GitHub Actions.

## The SEO engine

```
seo/keywords.json   ──>   build-seo.ps1   ──>   categories/*.html  +  sitemap.xml
```

- **`seo/keywords.json`** — researched keyword bank (volume / difficulty / intent / audience) + page definitions. **Edit this** to add keywords or pages.
- **`build-seo.ps1`** — regenerates one landing page per keyword + a fresh sitemap.

```powershell
powershell -ExecutionPolicy Bypass -File build-seo.ps1
```

Adding a new SEO page = adding ~12 lines of JSON, then re-running. See **`SEO-STRATEGY.md`** for the full strategy, keyword architecture, and update cadence.

## Tech & SEO notes

- 100% static HTML/CSS/vanilla JS — fast, fully crawlable, no framework.
- Design system in `assets/css/styles.css`; all imagery is inline SVG (zero image weight).
- Per-page `<title>`/meta, canonical, Open Graph; JSON-LD: `Organization` + `WebSite` (home), `FAQPage` + `BreadcrumbList` (landing pages), `HowTo` (sell), `CollectionPage` (buy).
- Non-render-blocking fonts; `robots.txt` + `sitemap.xml` ready for Search Console.

## File map

```
chemsurplus/
├── index.html  buy.html  lot.html  rfq.html  sell.html  how-it-works.html  404.html
├── categories/            13 generated keyword landing pages
├── industries/            9 generated industry landing pages
├── assets/
│   ├── css/styles.css     design system
│   ├── js/  data.js · app.js · marketplace.js · sell.js · lot.js · rfq.js · rfq-page.js
│   │        industries.js · suppliers.js   (generated)
│   └── img/  favicon.svg · og-cover.svg
├── seo/  keywords.json · industries.json · suppliers.json   (sources of truth — edit)
├── build.ps1             master generator (run)  ├── build-seo.ps1  build-industries.ps1
├── serve.ps1             local preview server
├── netlify.toml  vercel.json  _headers  .nojekyll  site.webmanifest   deploy configs
├── .github/workflows/deploy.yml   deploy/nginx.conf
├── sitemap.xml  robots.txt
└── DEPLOY.md  SEO-STRATEGY.md  SOUL.md  CLAUDE.md  README.md
```
