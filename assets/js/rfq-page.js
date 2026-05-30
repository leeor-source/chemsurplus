/* ChemSurplus — RFQ page: review list, submit one minimal request across suppliers. */
(function () {
  const listEl = document.getElementById("rfqList");
  if (!listEl) return;

  function render() {
    const ids = RFQ.get();
    const all = getAllListings();
    const items = ids.map(id => all.find(l => l.id === id)).filter(Boolean);
    document.getElementById("rfqCountTop").textContent = items.length;

    if (!items.length) {
      listEl.innerHTML = `<div class="card center" style="padding:3rem">
        <h3>Your RFQ list is empty</h3>
        <p class="muted">Add surplus lots to your RFQ from the marketplace, then request one quote across all of them.</p>
        <a href="buy.html" class="btn btn--primary">Browse the marketplace</a></div>`;
      document.getElementById("rfqFormWrap").classList.add("hidden");
      return;
    }
    document.getElementById("rfqFormWrap").classList.remove("hidden");

    /* group by supplier to show the multi-supplier nature */
    listEl.innerHTML = items.map(l => {
      const info = supplierInfo(l.supplier);
      return `<div class="rfq-item">
        <div class="rfq-item__ic">${icon((CATEGORIES.find(c=>c.slug===l.cat)||{}).icon||"flask")}</div>
        <div class="rfq-item__body">
          <a href="lot.html?id=${l.id}" class="rfq-item__name">${l.name}</a>
          <div class="muted" style="font-size:.84rem">${l.qty} · ${l.pkg} · CAS ${l.cas}</div>
          <div class="muted" style="font-size:.82rem">${icon("shield")} via ${info.name} · ${info.tier}</div>
        </div>
        <div class="rfq-item__price"><b>$${l.price.toFixed(2)}</b><span class="muted">${l.unit}</span></div>
        <button class="btn btn--ghost" style="padding:.4rem .7rem;font-size:.8rem" data-rfq-remove="${l.id}">Remove</button>
      </div>`;
    }).join("");

    const suppliers = [...new Set(items.map(l => supplierName(l.supplier)))];
    document.getElementById("rfqSuppliers").textContent =
      `${items.length} lot${items.length>1?"s":""} across ${suppliers.length} verified broker${suppliers.length>1?"s":""}`;
  }

  document.addEventListener("click", (e) => {
    const r = e.target.closest("[data-rfq-remove]");
    if (r) { RFQ.remove(r.dataset.rfqRemove); render(); }
  });

  /* submit — uses the live API when configured (CS_CONFIG.apiBase), else localStorage */
  const form = document.getElementById("rfqForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    for (const f of form.querySelectorAll("[required]")) { if (!f.value) { f.focus(); f.style.borderColor = "var(--danger)"; return; } }
    const fd = new FormData(form);
    const payload = {
      company: fd.get("company"), email: fd.get("email"),
      location: fd.get("location"), timeline: fd.get("timeline"), notes: fd.get("notes"),
      lots: RFQ.get()
    };

    const submitBtn = form.querySelector("[type=submit]");
    submitBtn.disabled = true; submitBtn.textContent = "Sending…";

    let ref = "RFQ-" + (1000 + (RFQ.get().length * 13 % 9000));
    try {
      if (window.CS_API && CS_API.enabled()) {
        const r = await CS_API.post("/rfq", payload);   // real backend: persists + emails brokers
        if (r && r.ref) ref = r.ref;
      }
    } catch (err) {
      console.warn("API submit failed, saved locally instead", err);
    }

    try {
      const hist = JSON.parse(localStorage.getItem("cs_rfq_requests") || "[]");
      hist.unshift({ ref, ...payload }); localStorage.setItem("cs_rfq_requests", JSON.stringify(hist));
    } catch (err) {}

    RFQ.get().slice().forEach(id => RFQ.remove(id));   // clear list
    document.getElementById("rfqMain").classList.add("hidden");
    const ok = document.getElementById("rfqSuccess");
    ok.querySelector("[data-ref]").textContent = ref;
    ok.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  form.addEventListener("input", (e) => { if (e.target.value) e.target.style.borderColor = ""; });

  render();
})();
