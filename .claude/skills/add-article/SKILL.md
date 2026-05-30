---
name: add-article
description: Write and publish a niche article/guide on ChemSurplus (the Insights section). Use when creating buyer/seller guides or industry content for SEO. Edits seo/articles.json and runs build-articles.ps1.
---

# add-article

Articles drive informational/seller-intent SEO and are data-driven: `seo/articles.json` → `build-articles.ps1` → `articles/<slug>.html` (Article + FAQ schema, featured-chemical imagery) + `articles.html` index + `sitemap-articles.xml`.

## Steps
1. Read `seo/articles.json` and `SOUL.md` (voice). Pick the niche (an industry slug, or "guide" for cross-cutting buyer/seller content).
2. Append an article object:
   ```json
   { "slug":"<kebab>", "title":"<SEO title>", "niche":"<industry-slug|guide>",
     "nicheLabel":"<label>", "icon":"<icon key from app.js>",
     "date":"YYYY-MM-DD", "readTime":"N min",
     "dek":"<1-2 sentence summary>",
     "sections":[ { "h2":"...", "body":["para","para"] } ],
     "chemicals":[ { "slug":"<chemical-slug>", "name":"...", "cas":"..." } ],
     "faqs":[ { "q":"...", "a":"..." } ],
     "related":"<industry-slug|guide>" }
   ```
   - `chemicals[]` renders a gallery using product art (match an existing chemical slug + its CAS so a real lot illustration shows and links to `chemical/<slug>.html`).
   - Use plain hyphens/quotes in content (the generator and JSON handle text; keep it accurate and useful).
3. Run `powershell -ExecutionPolicy Bypass -File build-articles.ps1` (or `build.ps1`).
4. Verify: `articles/<slug>.html` renders (Article+FAQ schema, chemical gallery with art), appears in `articles.html` and `sitemap-articles.xml`. Deploy via `/deploy`.

## Rules
- Genuinely useful, accurate content; voice per `SOUL.md` (concrete, no hype). One `<h1>` (the generator handles it). Never hand-edit generated `articles/*.html`.
