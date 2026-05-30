# Deploying the ChemSurplus backend

The frontend works fully static (GitHub Pages) using `localStorage`. To make **RFQs actually send** and **persist listings/RFQs**, deploy the serverless API in `api/` to **Vercel** (free tier). The frontend auto-detects the API: on a Vercel host it calls same-origin `/api`; on GitHub Pages it stays static.

## What's in `api/`
| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | liveness + shows whether email/store are configured |
| `/api/rfq` | POST | submit a quote request → persists + emails your inbox; returns `{ ref }` |
| `/api/rfq` | GET | list recent RFQs (demo/admin) |
| `/api/listings` | GET/POST | seller listings (merged into the marketplace) |

Storage: **Vercel KV** if configured, else in-memory (ephemeral). Email: **Resend** if `RESEND_API_KEY` set, else no-ops.

## Deploy (≈3 minutes)
1. Go to **vercel.com → Add New → Project → Import** `leeor-source/chemsurplus`.
   - Framework preset: **Other**. Root: repo root. No build command. Output: leave default (Vercel serves the static files and the `api/` functions together).
2. **Environment Variables** (Project → Settings → Environment Variables), all optional:
   - `RESEND_API_KEY` — free key from [resend.com] (makes RFQs email).
   - `RFQ_INBOX` — where RFQ notifications land (your email).
   - `RFQ_FROM` — sender; default `ChemSurplus <onboarding@resend.dev>` works before you verify a domain.
   - To persist data: **Storage → Create KV**, link it to the project (Vercel injects `KV_REST_API_URL`/`KV_REST_API_TOKEN`).
3. **Deploy.** You get `https://chemsurplus-<hash>.vercel.app`.
4. Verify: open `https://<your-vercel-url>/api/health` → should return `{ ok: true, ... }`.

That Vercel URL serves the **whole site** (frontend + API), and `assets/js/config.js` auto-points the RFQ form at `/api`, so submitting a quote there will persist and email. (GitHub Pages keeps running as the static mirror.)

## Local API testing
```bash
npm i -g vercel
vercel dev        # serves the static site + api/ on http://localhost:3000
```

## Notes
- `.env.example` lists every variable. Never commit a real `.env` (it's gitignored).
- The frontend degrades gracefully: if the API is down or absent, RFQ submission saves locally and still confirms — no broken UX.
- Next steps to make it a full backend: move the marketplace's listing reads to `GET /api/listings` (async), add auth for sellers, and swap KV for Postgres if you need relational queries.
