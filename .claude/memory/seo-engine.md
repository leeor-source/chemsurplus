# SEO engine

Content is data-driven and regenerable — the project's core differentiator.

```
seo/keywords.json  ──>  build-seo.ps1  ──>  categories/*.html  +  sitemap.xml
```

- `seo/keywords.json`:
  - `keywordBank[]` — tracked keywords (volume, difficulty, intent, audience, cluster, target). For strategy/reporting.
  - `landingPages[]` — page definitions; **each object generates one `categories/<slug>.html`**. Fields: slug, primaryKeyword, secondaryKeywords[], audience (seller|buyer|both), relatedCat, title, metaDescription, h1, intro, cta, faqs[].
  - `meta.lastUpdated` → feeds `<lastmod>` in sitemap. Bump it on every change.
- `build-seo.ps1` rewrites all category pages + sitemap from a template. Generated pages get: title/meta/canonical/OG + BreadcrumbList & FAQPage JSON-LD, hub/sibling internal links, FAQ accordion.

**To update SEO:** edit JSON → `powershell -ExecutionPolicy Bypass -File build-seo.ps1` → spot-check one page. 13 pages currently (3 seller, 9 buyer, 1 both). Strategy doc: `SEO-STRATEGY.md`.

Skills automate this: `/seo-refresh`, `/add-landing-page`, `/new-category`.
