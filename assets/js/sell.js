/* ChemSurplus — SELLER flow: value-recovery calculator, multi-step listing form, dashboard */
(function () {

  /* ---------- Value recovery calculator ---------- */
  const calc = document.getElementById("calcForm");
  if (calc) {
    function recompute() {
      const qty   = parseFloat(document.getElementById("cQty").value) || 0;
      const cost  = parseFloat(document.getElementById("cCost").value) || 0;
      const disp  = parseFloat(document.getElementById("cDisposal").value) || 0;
      // Surplus typically recovers 25–55% of book value vs. paying to dispose.
      const recoveryRate = 0.40;
      const recovered = qty * cost * recoveryRate;
      const avoided   = qty * disp;          // disposal cost avoided
      const total     = recovered + avoided;
      document.getElementById("cRecovered").textContent = "$" + Math.round(recovered).toLocaleString();
      document.getElementById("cAvoided").textContent   = "$" + Math.round(avoided).toLocaleString();
      document.getElementById("cTotal").textContent     = "$" + Math.round(total).toLocaleString();
    }
    calc.addEventListener("input", recompute);
    recompute();
  }

  /* ---------- Multi-step listing form ---------- */
  const form = document.getElementById("listForm");
  if (form) {
    const steps = Array.from(form.querySelectorAll("[data-step]"));
    const stepperItems = Array.from(document.querySelectorAll(".stepper__item"));
    let cur = 0;

    /* populate selects from data layer */
    const set = (id, opts, ph) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = `<option value="">${ph}</option>` + opts.map(o =>
        typeof o === "string" ? `<option>${o}</option>` : `<option value="${o.slug}">${o.name}</option>`).join("");
    };
    set("fCat", CATEGORIES, "Select category…");
    set("fPkg", PACKAGING, "Select packaging…");
    set("fCond", CONDITIONS, "Select condition…");
    set("fRegion", REGIONS, "Select region…");

    function show(i) {
      cur = Math.max(0, Math.min(i, steps.length - 1));
      steps.forEach((s, n) => s.classList.toggle("hidden", n !== cur));
      stepperItems.forEach((s, n) => {
        s.classList.toggle("active", n === cur);
        s.classList.toggle("done", n < cur);
      });
      window.scrollTo({ top: form.offsetTop - 90, behavior: "smooth" });
    }
    function validateStep() {
      const fields = steps[cur].querySelectorAll("[required]");
      for (const f of fields) { if (!f.value) { f.focus(); f.style.borderColor = "var(--danger)"; return false; } }
      return true;
    }

    form.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) { e.preventDefault(); if (validateStep()) show(cur + 1); }
      if (e.target.closest("[data-prev]")) { e.preventDefault(); show(cur - 1); }
    });
    form.addEventListener("input", (e) => { if (e.target.value) e.target.style.borderColor = ""; });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateStep()) return;
      const fd = new FormData(form);
      const listing = {
        id: "L-" + Math.floor(2000 + (getAllListings().length * 7 % 900)),
        name: fd.get("name"),
        cat: fd.get("cat"),
        cas: fd.get("cas") || "—",
        grade: fd.get("grade") || "Industrial",
        qty: fd.get("qty"),
        pkg: fd.get("pkg"),
        condition: fd.get("cond"),
        region: fd.get("region"),
        price: parseFloat(fd.get("price")) || 0,
        list: (parseFloat(fd.get("price")) || 0) * 1.8,
        unit: "/ " + (fd.get("unit") || "kg"),
        docs: ["SDS", fd.get("coa") ? "COA" : null].filter(Boolean),
        dated: fd.get("dated") || "No expiry",
        status: "Pending review"
      };
      const arr = JSON.parse(localStorage.getItem("cs_listings") || "[]");
      arr.unshift(listing);
      localStorage.setItem("cs_listings", JSON.stringify(arr));
      form.classList.add("hidden");
      document.getElementById("listSuccess").classList.remove("hidden");
      window.scrollTo({ top: form.offsetTop - 120, behavior: "smooth" });
      renderDashboard();
    });

    show(0);
  }

  /* ---------- Seller dashboard (reads localStorage listings) ---------- */
  function renderDashboard() {
    const body = document.getElementById("dashBody");
    if (!body) return;
    let arr = [];
    try { arr = JSON.parse(localStorage.getItem("cs_listings") || "[]"); } catch (e) {}
    document.getElementById("dsCount") && (document.getElementById("dsCount").textContent = arr.length);
    const val = arr.reduce((s, l) => s + (l.price || 0) * 1000, 0);
    document.getElementById("dsValue") && (document.getElementById("dsValue").textContent = "$" + Math.round(val).toLocaleString());

    if (!arr.length) {
      body.innerHTML = `<tr><td colspan="5" class="muted" style="text-align:center;padding:2rem">
        No listings yet. Use the form above to list your first surplus lot.</td></tr>`;
      return;
    }
    body.innerHTML = arr.map(l => `<tr>
      <td><strong>${l.name}</strong><br><span class="muted" style="font-size:.8rem">${catName(l.cat)} · ${l.qty}</span></td>
      <td>${l.pkg}</td>
      <td>$${(l.price||0).toFixed(2)} ${l.unit}</td>
      <td><span class="tag ${l.status==="Pending review"?"tag--amber":"tag--green"}">${l.status||"Live"}</span></td>
      <td><button class="btn btn--ghost" style="padding:.4rem .8rem;font-size:.8rem" data-del="${l.id}">Remove</button></td>
    </tr>`).join("");
  }
  document.addEventListener("click", (e) => {
    const d = e.target.closest("[data-del]");
    if (!d) return;
    let arr = JSON.parse(localStorage.getItem("cs_listings") || "[]");
    arr = arr.filter(l => l.id !== d.dataset.del);
    localStorage.setItem("cs_listings", JSON.stringify(arr));
    renderDashboard();
  });
  renderDashboard();
})();
