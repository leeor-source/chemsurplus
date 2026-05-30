# ChemSurplus — Organic Search Growth Playbook

*How to win traffic via organic search. Grounded in competitor analysis + chemical-niche SEO research (sources at bottom). Companion to [SEO-STRATEGY.md](SEO-STRATEGY.md) (the keyword engine we built) and [LAUNCH-PLAN.md](LAUNCH-PLAN.md) (go-to-market).*

---

## Why organic search is *the* channel here
- **Knowde — the largest chemical marketplace — draws ~69% of its visits from organic search.** In this niche SEO, not paid, is the growth engine. That validates the investment.
- **We own a position competitors don't:** a clean, **industry-personalized *surplus* marketplace**. Rivals serve either generic sourcing (Knowde, Camachem, Thomasnet) *or* surplus-buying brokers (Altiras, Stobec, wasteOptima). The **"surplus"-modified keyword space is far less competitive** than raw commodity-chemical terms — that's the whitespace.

## What we already have vs. what to add
| Built (see SEO-STRATEGY.md) | Gap to close (this playbook) |
|---|---|
| Keyword engine → 13 keyword pages | **Per-CAS pages**, per-chemical pages |
| 9 industry hubs | A **"Sell Surplus Chemicals" seller hub** |
| Product + FAQ + Breadcrumb + Org JSON-LD | **AggregateOffer** + **ChemicalSubstance** schema |
| Single sitemap.xml | **Segmented sitemaps** + crawl-budget triage |
| Lot detail pages | **"Sell instead of dispose" guide cluster** (link bait) |

---

## 1. Keyword landscape

**Transactional (lot & landing pages should own these):**
`buy surplus solvents` · `surplus solvents for sale` · `surplus titanium dioxide for sale` · `surplus caustic soda for sale` · `off-spec acetone for sale` · `surplus chemicals for sale`

**Commercial (homepage + industry hubs):**
`surplus chemical marketplace` · `excess chemical inventory marketplace` · `surplus chemical brokers` · `where to buy surplus chemicals` · `buy excess chemicals online`

**Informational (guide cluster — top-of-funnel + link bait):**
`how to dispose of off-spec chemicals` *(currently owned by waste-disposal firms — win it by reframing "sell instead of dispose")* · `how to sell excess chemical inventory` · `who buys surplus chemicals` · `alternatives to chemical disposal`

**Seller-side (the under-served supply side):**
`sell my surplus chemicals` · `sell off-spec chemicals` · `chemical inventory liquidation` · `distressed chemical inventory`. *(Lab Alley, wasteOptima, Altiras already run pages here — we need a dedicated hub to compete.)*

**Long-tail programmatic patterns (our scale advantage):**
- **Per-chemical:** `surplus [chemical] for sale` / `buy surplus [chemical]` (thousands of variants)
- **Per-CAS:** `[CAS number] for sale` / `[chemical] CAS [number] supplier` — **high-intent, bottom-of-funnel, under-served by broad competitors.** A formulator searching by CAS is ready to buy. **One of our best low-competition plays.**
- **Per-industry:** `surplus chemicals for water treatment` / `…for paint and coatings` / `…for food processing` — maps onto our 9 industry pages.
- **Per-region:** `surplus chemicals [state/country]`.

**Competitor gaps to exploit:** Knowde/Camachem aren't surplus-focused; ChemDeals has thin public guide content; the broker sites (Altiras/Stobec/wasteOptima) list "chemicals we buy" but have **no clean searchable marketplace of available lots** — our indexable lot pages beat them. **Lowest-competition / highest-ROI clusters:** (1) per-CAS surplus pages, (2) seller "sell/liquidate" hub, (3) "sell instead of dispose" content, (4) industry surplus pages.

## 2. Content / programmatic SEO

**Pillar → cluster (hub-and-spoke)** so thousands of programmatic pages funnel equity to a few authoritative hubs and stay crawl-efficient:
- **Pillars:** the 9 **industry hubs**; a **"Sell Surplus Chemicals"** seller hub; a **"Surplus vs. Disposal"** knowledge hub.
- **Spokes (scale layer):** per-chemical pages (name, synonyms, CAS, formula, MW, grades, applications + *live lots*), **per-CAS pages** (CAS in title/H1/URL), lot detail pages (money pages), and industry×chemical intersections for top combos.

**Guardrail — the #1 programmatic killer:** templated pages need *unique, valuable* content (real lot availability, quantities, application notes, FAQ answers), not just swapped variables. **Where there's no inventory for a chemical/CAS, keep the page lean and `noindex` until it has real listings** — thin/duplicate pages suppress the whole domain.

**Content that earns rankings *and* links:** "alternatives to disposal / sell instead of dispose" guides (reframe high-volume disposal queries; earn EHS/sustainability/procurement links); buyer guides (sourcing safely, SDS/COA checklists); seller guides ("what's my off-spec batch worth"); **HTML spec pages over PDFs** (publish crawlable HTML, offer SDS/COA as download); original price/availability data (linkable PR).

## 3. Backlinks & authority

**Chemical directories to list on (fast foundational authority + referral traffic):**
Thomasnet (pursue ThomasVerified) · Kompass · **ChemEurope** · Europages · **ChemicalRegister** · **ChemExper** (good for per-chemical/CAS entity association) · BuyersGuideChem · ChemicalsFinder · **Chemagility "Digital Chemical Platforms" directory** · w2bchemicals. *(Skip CheMondis — discontinued May 2026.)*

**Associations:** NACD / Alliance for Chemical Distribution (Responsible Distribution), FECC (Europe) — high-trust member-directory links.

**Trade media for digital PR:** ICIS · C&EN (cen.acs.org) · CHEManager · ICIS Chemical Business.

**Realistic link-earning sequence (don't expect cold editorial links):**
1. **Directories + associations first** (foundation).
2. **Data-driven PR** — publish a quarterly **"Surplus Chemical Price/Availability Index"** or "State of Excess Chemical Inventory" report. Original data is the most reliable link magnet for ICIS/C&EN/CHEManager.
3. **The disposal-cost angle** — "how much usable chemistry the industry landfills annually" pitches to sustainability/EHS press.
4. **Broker co-marketing** — partner brokers link to our lot pages.

## 4. Technical SEO (static / programmatic stack)

**Schema (JSON-LD):**
- **Product + Offer** on lot pages *(have)* — keep price/currency/availability.
- **AggregateOffer** on per-chemical pages with multiple lots (`lowPrice`/`highPrice`/`offerCount`) — *not* for mere variants.
- **ChemicalSubstance** on per-chemical/CAS pages (CAS, formula, MW) — semantic/LLM value (not a Google rich result, but strengthens entity identity).
- **FAQPage** *(have)*, **BreadcrumbList** on every programmatic page, **Organization** sitewide (E-E-A-T), **CollectionPage + ItemList** on indexable hubs only.

**Sitemaps:** move to **segmented, dynamic sitemaps** under an index — `sitemap-lots.xml`, `sitemap-chemicals.xml`, `sitemap-industries.xml`, `sitemap-guides.xml`. Only include indexable, canonical, content-rich URLs; keep `lastmod` accurate so Google re-crawls changed availability/price.

**Indexation & crawl budget — four-bucket triage for every filter/param:**
1. **INDEX** — real demand + converts (`/industry/water-treatment`, `/chemical/caustic-soda`): self-canonical, in sitemap, internally linked.
2. **CANONICAL** — useful but no unique demand → canonical to parent.
3. **BLOCK in robots.txt** — sort/view/session/tracking params (the only lever that truly saves crawl budget): `Disallow: /*?sort=`, `/*?view=`, `/search?`.
4. **AJAX** — low-value filter combos shouldn't generate URLs at all.
Never stack robots.txt + noindex + canonical on one URL. **Noindex per-chemical/CAS pages with no live lots / <~300 words.** Pages 2+ self-canonical; real `<a href>` pagination; true 404 on empty pages. **AI crawlers** (now ~4–22% of bot traffic, brutal crawl-to-referral ratios): allow on product pages, block from param/filter/search URLs.

**Internal linking & CWV:** stitch spokes→pillars→homepage; cross-link related chemicals and "lots in this industry." Our static generation is a Core Web Vitals advantage — protect it (server-rendered first paint, real anchor pagination, fast LCP; don't regress with heavy client JS).

## 5. Measurement & roadmap

**KPIs (priority order):** indexation velocity & time-to-index (the #1 leading indicator for a programmatic site) → impressions by page-type → clicks + CTR by query cluster → rankings for transactional + per-CAS terms → conversions (buyer inquiries / seller listings) by cluster → referring domains → crawl-budget health (param URLs <30% of crawl).
**Tools:** Google Search Console (core, incl. Crawl Stats), GA4, Bing Webmaster, a rank/backlink tool (Ahrefs/Semrush), Looker Studio dashboards.

**Roadmap:**
- **Days 0–30 — technical foundation:** GSC crawl audit; segmented sitemaps; four-bucket robots/canonical/noindex; noindex thin pages; full Product/Offer/Breadcrumb/Org schema on lots; fix CWV.
- **Days 30–60 — content scale:** expand the 9 industry hubs; launch per-chemical + per-CAS templates *only for chemicals with live lots* (AggregateOffer + ChemicalSubstance); ship the **"Sell Surplus Chemicals"** hub + seller guides; publish 2–3 "sell instead of dispose"/buyer guides.
- **Days 60–90 — authority:** submit to the directories above; apply for NACD/FECC; weekly GSC review; refresh losers, expand winners. *(Expect rankings to move ~week 8, clicks ~week 10, first conversions ~week 12; page-one for head terms is a 6–12 month horizon.)*
- **Months 4–6 — programmatic + PR:** scale per-chemical/CAS pages as inventory grows; per-region pages; ship the first **Surplus Chemical Price/Availability Index** and pitch ICIS/C&EN/CHEManager.
- **Months 6–12 — compounding:** quarterly data reports; deepen industry×chemical intersections; optimize toward conversions on proven clusters.

## The three highest-leverage moves to start now
1. **Per-CAS surplus pages** — high-intent, low-competition, perfect for our programmatic stack + broker inventory.
2. **A "Sell Surplus Chemicals" seller hub** — captures the under-served supply side and feeds the two-sided marketplace.
3. **Crawl-budget discipline from day one** — segmented sitemaps + four-bucket param triage + noindex empty pages, so Google spends budget on lots that convert, not thin template pages.

> **How to build these fast:** all three slot into the existing data-driven engine. Per-CAS/per-chemical pages are a new generator (like `build-seo.ps1`) fed from listing CAS numbers; the seller hub is one landing page; crawl-budget rules are edits to `robots.txt` + the sitemap generator. Say the word and I'll implement them.

---
*Sources: Similarweb (Knowde organic share); ChemDeals, Lab Alley, Altiras, wasteOptima, Stobec, Sandrine (competitor pages); EMSL, Clean Management (disposal intent); 95Projects, Kerkar Media, LATT (chemical SEO); SEOmatic, CXL, Siteimprove, Conductor, Practical Ecommerce (programmatic/pillar); ChemicalRegister, ChemExper, BuyersGuideChem, ChemEurope, Europages, Kompass, Thomasnet, Chemagility (directories); ICIS, C&EN, CHEManager (PR); schema.org, Google Search Central (schema); SEO Engico, journeyh.io, resignal (crawl/marketplace SEO); Morningscore, Luca Tagliaferro (timelines).*
