# Decisions

- **Static site, no framework.** Host has no Node; static HTML is also the fastest, most crawlable base for an SEO-led product. Trade-off: live listings are client-side/demo (localStorage). Future: server-render listings into category pages.
- **Inline SVG only, no binary images.** Zero image weight → faster LCP → better SEO; design stays in-repo and themeable via CSS tokens. Never add .png/.jpg assets.
- **Data-driven SEO over hand-written pages.** Adding a keyword page = ~12 lines of JSON, not a new HTML file. Keeps the content surface consistent and regenerable.
- **Non-render-blocking Google Fonts.** `media="print" onload` swap + system-font fallbacks (Segoe UI). Protects Core Web Vitals.
- **Brand: "ChemSurplus."** Keyword-aligned ("surplus chemicals"), brandable, .com-style. Palette: teal (trust/substance) + mint (circular) + amber (hazmat/discount only).
- **Two interfaces, one market:** sellers = first users (supply), buyers = secondary (demand). All copy traces to `SOUL.md` personas Dana (seller) and Sam (buyer).
