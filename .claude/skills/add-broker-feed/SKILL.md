---
name: add-broker-feed
description: Add or update a broker's surplus inventory feed in the ChemSurplus aggregation flow. Use when onboarding a new broker, syncing a broker's lots, or adding inventory to the marketplace catalog. Edits data/broker-feeds.json and runs build-catalog.ps1.
---

# add-broker-feed

ChemSurplus aggregates inventory from many brokers. Each broker is a feed in `data/broker-feeds.json`; `build-catalog.ps1` merges all feeds into `assets/js/catalog.js` (the live catalog).

## Steps
1. If the broker is new, add it to `seo/suppliers.json` (slug, name, url, since, specialty, packaging, regions, industries) and run `build-industries.ps1` so `supplierName()`/`supplierInfo()` resolve. Confirm the slug.
2. Add (or update) the broker's object in `data/broker-feeds.json`:
   ```json
   { "broker":"<slug>", "name":"<Name>", "synced":"YYYY-MM-DD",
     "lots":[ { "id":"L-####", "name":"...", "cat":"<category-slug>", "cas":"...",
       "grade":"...", "qty":"...", "pkg":"<Packaging>", "condition":"<Condition>",
       "region":"...", "price":0.00, "list":0.00, "unit":"/ kg",
       "docs":["SDS","COA"], "dated":"...", "industries":["..."] } ] }
   ```
   - `cat` from CATEGORIES (assets/js/data.js); `pkg`/`condition` from PACKAGING/CONDITIONS; `industries` from the industry slugs. `price`/`list` are internal (never shown publicly — pricing is quote-only).
3. Run `powershell -ExecutionPolicy Bypass -File build-catalog.ps1`.
4. Verify: the broker appears on `aggregation.html` and `sources.html` with the right lot count; new lots show in `buy.html`; `catalog.js` lot/broker totals updated.
5. Deploy (see `/deploy`). For a live broker pushing data, the same shape posts to `POST /api/ingest`.

## Rules
- Unique lot ids. Keep prices internal only (UI shows "pricing on request").
- Don't hand-edit `assets/js/catalog.js` — it's generated.
- If a lot's chemical should get a per-CAS page, also see `/add-chemical`.
