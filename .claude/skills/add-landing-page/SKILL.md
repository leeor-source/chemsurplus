---
name: add-landing-page
description: Add a new keyword-targeted SEO landing page to ChemSurplus. Use when the user wants to target a new search term, create a new SEO/content page, or expand keyword coverage. Appends to seo/keywords.json landingPages[] and runs build-seo.ps1 — no HTML is hand-written.
---

# add-landing-page

Spin up a new indexable landing page by adding data, not HTML.

## Inputs to gather (ask only what's missing)
- The **primary keyword** to target (e.g. "surplus methanol").
- The **audience**: `seller`, `buyer`, or `both`.
- Which existing **category** it relates to (`relatedCat`, a slug from `assets/js/data.js` CATEGORIES: solvents, specialty-chemicals, resins-coatings, lab-reagents, surfactants, acids-bases, polymers-additives, intermediates).

## Steps

1. Read `seo/keywords.json` and `SOUL.md` (for voice).

2. Append a new object to **`landingPages[]`** with all fields:
   ```json
   {
     "slug": "kebab-case-from-keyword",
     "primaryKeyword": "...",
     "secondaryKeywords": ["...", "...", "..."],
     "audience": "seller|buyer|both",
     "relatedCat": "<category-slug>",
     "title": "<≤60 chars, keyword first> | ChemSurplus",
     "metaDescription": "<≤158 chars, benefit + keyword>",
     "h1": "<punchy, on-voice>",
     "intro": "<2–3 sentences, numbers over adjectives, per SOUL.md>",
     "cta": "buy|sell",
     "faqs": [ {"q":"...","a":"..."}, {"q":"...","a":"..."} ]
   }
   ```
   Also add a matching row to `keywordBank[]` (volume/difficulty/intent estimate, `target` = `categories/<slug>.html`).

3. Bump `meta.lastUpdated`.

4. Regenerate: `powershell -ExecutionPolicy Bypass -File build-seo.ps1`

5. Verify the new `categories/<slug>.html` exists, template resolved, encoding clean, and it appears in `sitemap.xml`. The generator auto-wires hub + sibling internal links.

## Rules
- Unique slug; keyword-front-loaded title; exactly one `<h1>` (the generator handles this).
- Voice per `SOUL.md`: concrete, commercial, no hype/greenwash.
- Never create the HTML by hand — only the JSON entry.
