---
name: deploy
description: Build, commit, push, and deploy ChemSurplus to both hosts (GitHub Pages + Vercel), then verify live. Use after content/code changes when the user wants the live site updated.
---

# deploy

ChemSurplus runs on two hosts: GitHub Pages (static mirror, auto-deploys on push) and Vercel (full-stack with the `/api` backend; needs a manual redeploy).

## Steps
1. **Rebuild generated output** (if data/generators changed):
   `powershell -ExecutionPolicy Bypass -File build.ps1`
   (runs catalog → seo → industries → chemicals → articles; writes the segmented sitemap index).
2. **Commit & push** (auto-deploys Pages):
   ```bash
   git add -A
   git commit -m "<concise summary>\n\nCo-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
   git push origin main
   ```
3. **Redeploy Vercel** (PATH needs node + npm global on Windows):
   ```powershell
   $env:PATH = "C:\Program Files\nodejs;$env:APPDATA\npm;" + $env:PATH
   vercel --prod --yes --scope leeor-7254s-projects
   ```
   (alias: https://chemsurplus.vercel.app)
4. **Verify both hosts** with curl: homepage + any changed pages return 200; on Vercel check `/api/health`. Poll the Pages build commit via `gh api repos/leeor-source/chemsurplus/pages/builds/latest --jq .commit` until it matches HEAD.

## Notes
- Generated files (catalog.js, industries.js, suppliers.js, categories/, industries/, chemical/, articles/, sitemaps) are committed so neither host needs PowerShell.
- Don't skip the Vercel step — Pages won't have the live API. To make Vercel auto-deploy on push, connect GitHub in Vercel account settings (one-time, user action).
- Secrets (`RESEND_API_KEY` for RFQ email, Upstash Redis for storage) are set in Vercel env, never committed.
