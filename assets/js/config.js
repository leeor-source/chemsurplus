/* ChemSurplus runtime config.
   apiBase = "" → fully static (localStorage). This is the default so the site
   works on GitHub Pages with no backend.
   When the serverless API is deployed (Vercel), set apiBase to "/api" (same origin)
   or an absolute URL like "https://chemsurplus-api.vercel.app/api". */
window.CS_CONFIG = window.CS_CONFIG || {};
if (window.CS_CONFIG.apiBase === undefined) {
  // Default: use same-origin "/api" on real hosts (Vercel), stay fully static on
  // GitHub Pages or local file preview. RFQ submit falls back to localStorage if the
  // API is absent, so "/api" is safe even on static hosts.
  var staticHost = /github\.io$/.test(location.hostname) || location.protocol === "file:" ||
                   location.hostname === "localhost" || location.hostname === "127.0.0.1";
  window.CS_CONFIG.apiBase = staticHost ? "" : "/api";
}
window.CS_API = {
  base: function () { return window.CS_CONFIG.apiBase || ""; },
  enabled: function () { return !!(window.CS_CONFIG.apiBase); },
  async post(path, body) {
    const r = await fetch(this.base() + path, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error("api " + r.status);
    return r.json();
  },
  async get(path) {
    const r = await fetch(this.base() + path);
    if (!r.ok) throw new Error("api " + r.status);
    return r.json();
  }
};
