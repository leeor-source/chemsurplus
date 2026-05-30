/* ChemSurplus — RFQ "list" (the B2B equivalent of a cart). Shared across pages.
   Stored in localStorage as an array of lot IDs (cs_rfq). */
(function () {
  function getRFQ() { try { return JSON.parse(localStorage.getItem("cs_rfq") || "[]"); } catch (e) { return []; } }
  function saveRFQ(a) { localStorage.setItem("cs_rfq", JSON.stringify(a)); updateBadge(); }
  function inRFQ(id) { return getRFQ().includes(id); }
  function addRFQ(id) { const a = getRFQ(); if (!a.includes(id)) { a.push(id); saveRFQ(a); } }
  function removeRFQ(id) { saveRFQ(getRFQ().filter(x => x !== id)); }
  function toggleRFQ(id) { inRFQ(id) ? removeRFQ(id) : addRFQ(id); return inRFQ(id); }

  function updateBadge() {
    const n = getRFQ().length;
    document.querySelectorAll("[data-rfq-count]").forEach(el => {
      el.textContent = n;
      el.classList.toggle("hidden", n === 0);
    });
  }

  function toast(msg) {
    let t = document.getElementById("cs-toast");
    if (!t) { t = document.createElement("div"); t.id = "cs-toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("toast--show");
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("toast--show"), 2200);
  }

  /* expose */
  window.RFQ = { get: getRFQ, add: addRFQ, remove: removeRFQ, toggle: toggleRFQ, has: inRFQ, count: () => getRFQ().length, badge: updateBadge, toast: toast };

  /* delegate add-to-RFQ buttons anywhere */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add-rfq]");
    if (!b) return;
    e.preventDefault();
    const id = b.dataset.addRfq;
    const nowIn = toggleRFQ(id);
    b.classList.toggle("is-in", nowIn);
    b.setAttribute("aria-pressed", nowIn);
    const label = b.querySelector("[data-rfq-label]");
    if (label) label.textContent = nowIn ? "In RFQ" : "Add to RFQ";
    toast(nowIn ? "Added to your RFQ list" : "Removed from RFQ list");
  });

  document.addEventListener("DOMContentLoaded", updateBadge);
  updateBadge();
})();
