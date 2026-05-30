/* ChemSurplus — shared listing card markup (used by marketplace.js and chemical pages). */
function listingCardHTML(l) {
  const docs = (l.docs || []).map(d => `<span class="tag tag--gray">${d}</span>`).join("");
  const condClass = /Short-dated|Off-spec/.test(l.condition) ? "tag--amber" : "tag--green";
  const inRfq = (typeof RFQ !== "undefined") && RFQ.has(l.id);
  const art = (typeof productArt === "function") ? productArt(l) : icon((CATEGORIES.find(c => c.slug === l.cat) || {}).icon || "flask");
  return `<article class="listing">
    <a class="listing__media" href="lot.html?id=${l.id}">${art}
      <span class="listing__discount listing__discount--surplus">Below market</span></a>
    <div class="listing__body">
      <span class="listing__cat">${catName(l.cat)}</span>
      <h3 class="listing__name"><a href="lot.html?id=${l.id}" style="color:inherit">${l.name}</a></h3>
      <div class="listing__meta">
        <span class="tag ${condClass}">${l.condition}</span>
        <span class="tag tag--gray">${l.pkg}</span>
      </div>
      <p class="muted" style="font-size:.85rem;margin:.1rem 0">CAS ${l.cas} · ${l.grade} · ${l.qty}</p>
      <div class="badge-row">${docs}</div>
      <div class="listing__supplier">${icon("shield")}<span>via <strong>${supplierName(l.supplier)}</strong> · verified</span></div>
      <div class="listing__foot">
        <div class="listing__price"><b>Quote</b><div class="listing__unit">Pricing on request · ${l.region}</div></div>
        <div class="flex gap" style="gap:.4rem">
          <button class="btn btn--ghost ${inRfq ? "is-in" : ""}" data-add-rfq="${l.id}" style="padding:.5rem .7rem;font-size:.82rem"><span data-rfq-label>${inRfq ? "In RFQ" : "+ RFQ"}</span></button>
          <a class="btn btn--accent" href="lot.html?id=${l.id}" style="padding:.5rem .9rem;font-size:.82rem">View lot</a>
        </div>
      </div>
    </div>
  </article>`;
}
