# Deploying ChemSurplus

ChemSurplus is a **static site** — plain HTML/CSS/JS with all generated pages committed. There is **no build step on the server**, so it deploys anywhere that serves files. Pick one host below; all four work today.

> The PowerShell scripts (`build*.ps1`) are local *authoring* tools that regenerate `categories/`, `industries/`, `assets/js/industries.js`, `assets/js/suppliers.js` and `sitemap.xml`. Their output is committed, so CI/hosts never need PowerShell.

---

## 0. One-time: push to GitHub

From the project root (`chemsurplus/`):

```bash
git init
git add .
git commit -m "ChemSurplus: initial site"
git branch -M main
# create an empty repo on github.com first (e.g. chemsurplus), then:
git remote add origin https://github.com/<you>/chemsurplus.git
git push -u origin main
```

---

## 1. Option A — GitHub Pages (already deployed ✅)

**This site is live at https://leeor-source.github.io/chemsurplus/**, served directly from the `main` branch (Settings → Pages → "Deploy from a branch", `main` / `/`). Every push to `main` re-publishes automatically — no build step, no extra config.

To reproduce on a fresh repo:
1. Push to GitHub (step 0).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `/root`.** Save.
3. Wait ~1 min; your URL is `https://<you>.github.io/<repo>/`.

Because all asset paths are **relative**, the site works under that sub-path unchanged. A `.nojekyll` file is included so GitHub serves files as-is.

> **Optional — Actions-based deploy:** a ready workflow is kept at `deploy/github-pages-workflow.yml`. To use it, move it to `.github/workflows/deploy.yml` and set Pages source to "GitHub Actions". Note: pushing files under `.github/workflows/` requires your GitHub token to have the `workflow` scope (`gh auth refresh -s workflow`), which is why the default branch-based deploy above is the simpler path.

## 2. Option B — Netlify

- **Easiest:** drag the `chemsurplus/` folder onto app.netlify.com → instant `*.netlify.app` URL.
- **Continuous:** "Add new site → Import from Git" → pick the repo. `netlify.toml` sets publish dir `.`, security headers, and the 404. No build command needed.

## 3. Option C — Vercel

- "Add New → Project" → import the repo. Framework preset: **Other** (static). `vercel.json` applies headers + caching. Deploy → `*.vercel.app` URL.

## 4. Option D — Your own VPS (nginx)

```bash
# on the server
sudo mkdir -p /var/www/chemsurplus
# copy the site up (from your machine):
#   scp -r ./* user@server:/var/www/chemsurplus
sudo cp deploy/nginx.conf /etc/nginx/sites-available/chemsurplus
sudo ln -s /etc/nginx/sites-available/chemsurplus /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d chemsurplus.com -d www.chemsurplus.com   # HTTPS
```

`deploy/nginx.conf` already sets security headers, gzip, asset caching and the 404 page.

---

## 5. Custom domain (chemsurplus.com)

The site's canonical URLs and sitemap point at `https://www.chemsurplus.com`. Point your domain at the host:

| Host | DNS records |
|---|---|
| **GitHub Pages** | apex `@` → A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `www` → CNAME `<you>.github.io`. Then add the domain under Settings → Pages and add a `CNAME` file containing `www.chemsurplus.com`. |
| **Netlify** | `www` → CNAME `<site>.netlify.app` (or use Netlify DNS nameservers). |
| **Vercel** | `www` → CNAME `cname.vercel-dns.com`; apex → A `76.76.21.21`. |
| **VPS** | `@` and `www` → A record to your server IP. |

DNS can take up to 24h to propagate. If you deploy under a **different** domain, update the canonical/sitemap host: edit `meta.domain` in `seo/keywords.json` and the `$domain` in `build-industries.ps1`, then re-run `build.ps1` (needs PowerShell / `pwsh`).

---

## 6. After it's live
- Submit `https://<your-domain>/sitemap.xml` in **Google Search Console**.
- (Optional, better social previews) Convert `assets/img/og-cover.svg` → `og-cover.png` (1200×630) — some scrapers prefer PNG. Any SVG→PNG tool works; then point `og:image` at the `.png`.
- (Optional) Regenerate content on Linux/CI with **PowerShell 7** (`pwsh`), which runs the same `build.ps1` cross-platform.

## 7. What's static vs. would need a backend later
- **Works fully static now:** browsing, industry personalization, lot detail, RFQ list, seller listing form, dashboards — all client-side (`localStorage`).
- **Needs a backend to go truly transactional:** persisting RFQs/listings server-side, emailing brokers, auth, and live supplier inventory feeds. The current data layer (`assets/js/data.js`, `seo/*.json`) is structured so these can be swapped for API calls without touching the UI.
