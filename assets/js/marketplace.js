/* ChemSurplus — BUYER marketplace: industry-personalized render, search, filter, sort */
(function () {
  const grid    = document.getElementById("listingGrid");
  const countEl = document.getElementById("resultCount");
  const sortEl  = document.getElementById("sortBy");
  const searchEl= document.getElementById("searchInput");
  if (!grid) return;

  const params = new URLSearchParams(location.search);

  /* industry: URL param wins, else persisted choice */
  let industry = params.get("industry") || getIndustry();
  if (params.get("industry")) setIndustry(industry);   // persist deep-link choice

  const state = { q: "", cats: new Set(), conds: new Set(), pkgs: new Set(), sort: "discount" };
  if (params.get("cat")) state.cats.add(params.get("cat"));
  if (params.get("q")) { state.q = params.get("q"); if (searchEl) searchEl.value = state.q; }

  /* ---- personalization banner + industry switcher ---- */
  function renderIndustryUI() {
    const banner = document.getElementById("industryBanner");
    const meta = getIndustryMeta(industry);
    if (banner) {
      if (meta) {
        banner.innerHTML =
          `<div class="ind-banner">
             <div class="ind-banner__ic">${icon(meta.icon)}</div>
             <div class="ind-banner__txt">
               <strong>Personalized for ${meta.name}</strong>
               <span class="muted">You're seeing surplus relevant to ${meta.name}. ${meta.tagline}</span>
             </div>
             <button class="btn btn--ghost" data-clear-industry>Show all industries</button>
           </div>`;
        banner.classList.remove("hidden");
      } else {
        banner.innerHTML =
          `<div class="ind-banner ind-banner--pick">
             <div class="ind-banner__txt"><strong>See only what's relevant to you.</strong>
               <span class="muted">Pick your industry and the marketplace personalizes instantly.</span></div>
             <div class="ind-pills" id="bannerPills"></div>
           </div>`;
        const bp = banner.querySelector("#bannerPills");
        if (bp && typeof INDUSTRIES !== "undefined")
          bp.innerHTML = INDUSTRIES.map(i => `<button class="pill" data-pick-industry="${i.slug}">${icon(i.icon)} ${i.name}</button>`).join("");
        banner.classList.remove("hidden");
      }
    }
    /* switcher dropdown in toolbar */
    const sw = document.getElementById("industrySwitch");
    if (sw && typeof INDUSTRIES !== "undefined") {
      sw.innerHTML = `<option value="">All industries</option>` +
        INDUSTRIES.map(i => `<option value="${i.slug}" ${i.slug===industry?"selected":""}>${i.name}</option>`).join("");
    }
  }

  function buildFilters() {
    const catBox = document.getElementById("fltCat");
    const condBox = document.getElementById("fltCond");
    const pkgBox = document.getElementById("fltPkg");
    /* when an industry is active, only show its relevant categories as filters */
    const meta = getIndustryMeta(industry);
    const cats = meta ? CATEGORIES.filter(c => meta.categories.includes(c.slug)) : CATEGORIES;
    if (catBox) catBox.innerHTML = cats.map(c =>
      `<label class="filter-opt"><input type="checkbox" data-flt="cat" value="${c.slug}" ${state.cats.has(c.slug)?"checked":""}>${c.name}</label>`).join("");
    if (condBox) condBox.innerHTML = CONDITIONS.map(c =>
      `<label class="filter-opt"><input type="checkbox" data-flt="cond" value="${c}">${c}</label>`).join("");
    if (pkgBox) pkgBox.innerHTML = PACKAGING.map(p =>
      `<label class="filter-opt"><input type="checkbox" data-flt="pkg" value="${p}">${p}</label>`).join("");
  }

  function matches(l) {
    if (state.cats.size && !state.cats.has(l.cat)) return false;
    if (state.conds.size && !state.conds.has(l.condition)) return false;
    if (state.pkgs.size && !state.pkgs.has(l.pkg)) return false;
    if (state.q) {
      const hay = (l.name + " " + l.cas + " " + catName(l.cat) + " " + l.grade).toLowerCase();
      if (!hay.includes(state.q.toLowerCase())) return false;
    }
    return true;
  }

  function sortList(list) {
    const s = state.sort;
    return list.sort((a, b) => {
      if (s === "discount") return pctOff(b.price, b.list) - pctOff(a.price, a.list);
      if (s === "price-low") return a.price - b.price;
      if (s === "price-high") return b.price - a.price;
      return 0;
    });
  }

  function card(l) {
    const off = pctOff(l.price, l.list);
    const docs = l.docs.map(d => `<span class="tag tag--gray">${d}</span>`).join("");
    const condClass = /Short-dated|Off-spec/.test(l.condition) ? "tag--amber" : "tag--green";
    const inRfq = (typeof RFQ !== "undefined") && RFQ.has(l.id);
    return `<article class="listing">
      <a class="listing__media" href="lot.html?id=${l.id}">${icon((CATEGORIES.find(c=>c.slug===l.cat)||{}).icon||"flask")}
        ${off>0?`<span class="listing__discount">−${off}%</span>`:""}</a>
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
          <div class="listing__price"><b>$${l.price.toFixed(2)}</b> <s>$${l.list.toFixed(2)}</s><div class="listing__unit">${l.unit} · ${l.region}</div></div>
          <div class="flex gap" style="gap:.4rem">
            <button class="btn btn--ghost ${inRfq?"is-in":""}" data-add-rfq="${l.id}" style="padding:.5rem .7rem;font-size:.82rem"><span data-rfq-label>${inRfq?"In RFQ":"+ RFQ"}</span></button>
            <a class="btn btn--accent" href="lot.html?id=${l.id}" style="padding:.5rem .9rem;font-size:.82rem">View lot</a>
          </div>
        </div>
      </div>
    </article>`;
  }

  function render() {
    let list = listingsForIndustry(industry);   // industry scope first
    list = sortList(list.filter(matches));
    countEl.textContent = list.length;
    const meta = getIndustryMeta(industry);
    grid.innerHTML = list.length
      ? list.map(card).join("")
      : `<div class="card" style="grid-column:1/-1;text-align:center;padding:3rem">
           <h3>No lots match those filters${meta?` for ${meta.name}`:""}</h3>
           <p class="muted">Try widening filters${meta?", switching industry,":""} or set a sourcing alert and we'll notify you when matching surplus is listed.</p>
           <button class="btn btn--primary" data-alert>Create sourcing alert</button></div>`;
  }

  function applyIndustry(slug) {
    industry = slug; setIndustry(slug);
    state.cats.clear();                 // reset category filters when industry changes
    /* reflect in URL without reload */
    const u = new URL(location.href);
    slug ? u.searchParams.set("industry", slug) : u.searchParams.delete("industry");
    history.replaceState({}, "", u);
    renderIndustryUI(); buildFilters(); render();
  }

  /* ---- events ---- */
  document.addEventListener("change", (e) => {
    const f = e.target.closest("[data-flt]");
    if (f) {
      const set = { cat: state.cats, cond: state.conds, pkg: state.pkgs }[f.dataset.flt];
      f.checked ? set.add(f.value) : set.delete(f.value);
      render(); return;
    }
    if (e.target.id === "industrySwitch") applyIndustry(e.target.value);
  });
  if (searchEl) searchEl.addEventListener("input", (e) => { state.q = e.target.value; render(); });
  if (sortEl) sortEl.addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  document.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-pick-industry]");
    if (pick) { applyIndustry(pick.dataset.pickIndustry); return; }
    if (e.target.closest("[data-clear-industry]")) { applyIndustry(""); return; }
    if (e.target.closest("[data-clear]")) {
      state.cats.clear(); state.conds.clear(); state.pkgs.clear(); state.q = "";
      if (searchEl) searchEl.value = "";
      buildFilters(); render();
    }
    if (e.target.closest("[data-alert]")) {
      alert("Sourcing alert created. We'll email you when matching surplus lots are listed. (Demo)");
    }
  });

  renderIndustryUI();
  buildFilters();
  render();
})();
