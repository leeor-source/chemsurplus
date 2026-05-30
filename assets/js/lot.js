/* ChemSurplus — lot detail page (lot.html?id=L-1001). The conversion centerpiece. */
(function () {
  const root = document.getElementById("lotRoot");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");
  const l = getAllListings().find(x => x.id === id);

  if (!l) {
    root.innerHTML = `<div class="container section center">
      <h1>Lot not found</h1><p class="muted">This lot may have been claimed or removed.</p>
      <a href="buy.html" class="btn btn--primary">Back to marketplace</a></div>`;
    return;
  }

  document.title = `${l.name} — surplus ${catName(l.cat)} | ChemSurplus`;
  const off = pctOff(l.price, l.list);
  const info = supplierInfo(l.supplier);
  const iconKey = (CATEGORIES.find(c => c.slug === l.cat) || {}).icon || "flask";
  const docStrip = l.docs.map(d =>
    `<a class="doc-chip" href="#" onclick="return false" title="${d} (demo)">${icon("doc")}<span>${d}</span><em>Preview</em></a>`).join("");
  const compliance = complianceBadges(l).map(c => `<span class="tag tag--green">${c}</span>`).join(" ");
  const condClass = /Short-dated|Off-spec/.test(l.condition) ? "tag--amber" : "tag--green";

  const spec = [
    ["CAS number", l.cas], ["Grade", l.grade], ["Category", catName(l.cat)],
    ["Quantity available", l.qty], ["Packaging", l.pkg], ["Condition", l.condition],
    ["Location", l.region], ["Shelf life", l.dated], ["Lot ID", l.id]
  ];
  const specRows = spec.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("");

  /* related: same category or shared industry, excluding self */
  const related = getAllListings().filter(x => x.id !== l.id &&
    (x.cat === l.cat || (x.industries || []).some(i => (l.industries || []).includes(i)))).slice(0, 3);
  const relCards = related.map(r => `
    <a class="card card--hover" href="lot.html?id=${r.id}" style="text-decoration:none">
      <span class="listing__cat">${catName(r.cat)}</span>
      <h3 class="listing__name" style="margin:.2rem 0">${r.name}</h3>
      <p class="muted" style="font-size:.85rem;margin:0">${r.qty} · ${r.pkg}</p>
      <div class="mt-1"><b style="font-family:var(--font-head)">Quote</b> <span class="muted" style="font-size:.8rem">pricing on request</span></div>
    </a>`).join("");

  root.innerHTML = `
  <section class="section--tight">
    <div class="container">
      <nav class="crumbs"><a href="index.html">Home</a> › <a href="buy.html">Marketplace</a> › <a href="buy.html?cat=${l.cat}">${catName(l.cat)}</a> › <span>${l.name}</span></nav>

      <div class="lot">
        <!-- media -->
        <div class="lot__media">
          <div class="lot__art">${typeof productArt === "function" ? productArt(l) : icon(iconKey)}</div>
          <span class="listing__discount listing__discount--surplus">Below market</span>
          <div class="lot__docs">${docStrip}</div>
        </div>

        <!-- identity + buy box -->
        <div class="lot__main">
          <span class="listing__cat">${catName(l.cat)}</span>
          <h1>${l.name}</h1>
          <div class="badge-row mt-1">
            <span class="tag ${condClass}">${l.condition}</span>
            <span class="tag tag--gray">${l.pkg}</span>
            ${compliance}
          </div>

          <div class="verify-strip mt-2">
            ${icon("shield")}
            <div><strong>${info.name}</strong> · ${info.tier}
              <div class="muted" style="font-size:.82rem">${info.specialty || "Surplus chemical broker"}${info.since ? " · since " + info.since : ""}${info.regions ? " · " + info.regions : ""}</div>
            </div>
          </div>

          <div class="buybox mt-3">
            <div class="buybox__price">
              <b>Pricing on request</b>
              <span class="tag tag--amber">Below market</span>
            </div>
            <p class="muted" style="font-size:.85rem;margin:.4rem 0 0">Surplus pricing isn't listed publicly — it depends on quantity, terms and timing. Submit an RFQ and the verified broker returns a quote for your exact requirement.</p>
            <div class="flex gap wrap mt-2">
              <button class="btn btn--primary btn--lg" data-request-quote="${l.id}">Request a quote</button>
              <button class="btn btn--ghost btn--lg ${RFQ.has(l.id) ? "is-in" : ""}" data-add-rfq="${l.id}" aria-pressed="${RFQ.has(l.id)}">
                <span data-rfq-label>${RFQ.has(l.id) ? "In RFQ" : "Add to RFQ"}</span>
              </button>
            </div>
            <div class="trust-row mt-2">
              <span>${icon("doc")} SDS/COA included</span>
              <span>${icon("truck")} Hazmat-ready freight</span>
              <span>${icon("shield")} Verified broker</span>
            </div>
          </div>
        </div>
      </div>

      <!-- specs -->
      <div class="grid grid--2 mt-4" style="align-items:start">
        <div>
          <h2>Lot details</h2>
          <table class="table spec-table">${specRows}</table>
        </div>
        <div>
          <h2>Documentation &amp; compliance</h2>
          <p class="muted">Every ChemSurplus lot is published with documentation so you can verify exactly what you're buying before you commit.</p>
          <div class="doc-grid">${docStrip}</div>
          ${compliance ? `<p class="mt-2">Certifications: ${compliance}</p>` : ""}
          <div class="verify-strip mt-3">
            ${icon("shield")}
            <div><strong>Sourced via ${info.name}</strong>
              <div class="muted" style="font-size:.82rem">ChemSurplus is the interface; ${info.name} is the verified broker holding this lot. Your RFQ opens a secure thread with them.</div>
            </div>
          </div>
        </div>
      </div>

      ${related.length ? `<div class="mt-4"><h2>Related surplus</h2><div class="grid grid--3 mt-2">${relCards}</div></div>` : ""}
    </div>
  </section>

  <!-- sticky request bar -->
  <div class="lot-sticky" id="lotSticky">
    <div class="container flex between items-center">
      <div class="flex items-center gap"><strong>${l.name}</strong><span class="muted">Pricing on request</span></div>
      <div class="flex gap">
        <button class="btn btn--ghost ${RFQ.has(l.id) ? "is-in" : ""}" data-add-rfq="${l.id}"><span data-rfq-label>${RFQ.has(l.id) ? "In RFQ" : "Add to RFQ"}</span></button>
        <button class="btn btn--primary" data-request-quote="${l.id}">Request a quote</button>
      </div>
    </div>
  </div>`;

  /* Request quote -> add to RFQ + go to RFQ page */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-request-quote]");
    if (!b) return;
    RFQ.add(b.dataset.requestQuote);
    location.href = "rfq.html";
  });

  /* reveal sticky bar after scrolling past the buy box */
  const sticky = document.getElementById("lotSticky");
  window.addEventListener("scroll", () => {
    sticky.classList.toggle("lot-sticky--show", window.scrollY > 420);
  });
})();
