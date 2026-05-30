---
name: seo-refresh
description: Refresh the ChemSurplus keyword research and regenerate all SEO landing pages + sitemap. Use when keyword data is stale, the user asks to "update the SEO", check rankings/keywords, or refresh content freshness. Re-runs research, updates seo/keywords.json, and runs build-seo.ps1.
---

# seo-refresh

Keep ChemSurplus's SEO current. The keyword bank drives every generated page, so "updating SEO" = updating data + regenerating.

## Steps

1. **Read context:** `seo/keywords.json` (current `keywordBank` + `landingPages`), `SEO-STRATEGY.md`, and `SOUL.md` (voice).

2. **Refresh keyword data.** For each cluster (core, sell, buy, category, guide) run web searches to re-check intent and competition. Useful queries:
   - "surplus chemicals marketplace", "sell excess chemical inventory", "buy surplus chemicals"
   - per-category: "surplus solvents", "surplus specialty chemicals", etc.
   - Scan competitors (ChemDeals, Jaxon Chemical Exchange, SUR+ International, Waste Optima, LabX, Chem-Outlet) for new terms/gaps.
   Update `volume` / `difficulty` / `intent` estimates in `keywordBank`, and add any strong new keywords (with a `target`). Flag any keyword with rising intent but no landing page — consider `/add-landing-page`.

3. **Refresh copy freshness** (optional but good): lightly update `intro`/`faqs` on a few `landingPages` so content isn't stale. Keep voice per `SOUL.md` (numbers over adjectives, no hype).

4. **Bump** `meta.lastUpdated` to today's date (it feeds `<lastmod>` in the sitemap).

5. **Regenerate:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File build-seo.ps1
   ```

6. **Verify:** spot-check one generated `categories/*.html` for resolved template + correct dash encoding (no `â€"`); confirm the sitemap URL count = core (4) + landingPages count. Report what changed (keywords added/repriced, pages touched).

## Notes
- Read `seo/keywords.json` with care; when scripting any read in PowerShell use `-Encoding UTF8`.
- Don't hand-edit `categories/*.html` — they're regenerated.
- Cadence suggestion: monthly. Can be wired to `/schedule` for automation.
