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

  const card = (l) => listingCardHTML(l);   // shared renderer (assets/js/card.js)

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
