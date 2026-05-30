# Project overview

**ChemSurplus** — SEO-led B2B marketplace for surplus, excess & obsolete chemicals.

- **Sellers (first users):** manufacturers, distributors, labs with dead/excess stock → recover value, avoid disposal cost. Interface: `sell.html` (value calculator, 3-step listing form, dashboard; persists to localStorage `cs_listings`).
- **Buyers (secondary):** procurement, formulators, labs → source 30–70% below market. Interface: `buy.html` (search/filter/sort over `assets/js/data.js` seed lots + seller submissions).
- Core pages: `index.html` (dual-audience SEO home), `how-it-works.html`. 13 generated keyword pages in `categories/`.

**Stack:** 100% static HTML/CSS/vanilla JS. No Node/npm. Windows + PowerShell 5.1. Inline SVG only.

Created 2026-05-30. See `SOUL.md` for identity/voice, `CLAUDE.md` for working rules.
