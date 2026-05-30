/* ChemSurplus - savings estimator. Shows savings as a BAND vs a public market
   reference (or the buyer's own private baseline) - never an exact lot price. */
(function () {
  if (!document.getElementById("svBuyer")) return;
  var $ = function (id) { return document.getElementById(id); };
  function money(n) { return "$" + Math.round(n).toLocaleString(); }

  /* populate chemical selects */
  var opts = CS_MARKET.chemicals.map(function (c) { return '<option value="' + c.slug + '">' + c.name + '</option>'; }).join("");
  $("svChem").innerHTML = opts;
  $("seChem").innerHTML = opts;

  /* ---------- BUYER ---------- */
  function buyer() {
    var c = marketChem($("svChem").value); if (!c) return;
    var qty = parseFloat($("svQty").value) || 0;
    var tier = CS_MARKET.tiers[$("svTier").value];
    var base = parseFloat($("svBaseline").value) || 0;
    var refLow = base > 0 ? base * 0.98 : c.refLow;
    var refHigh = base > 0 ? base * 1.02 : c.refHigh;
    var mktLow = qty * refLow, mktHigh = qty * refHigh;
    var saveLow = mktLow * tier.low, saveHigh = mktHigh * tier.high;
    var costLow = mktHigh * (1 - tier.high), costHigh = mktLow * (1 - tier.low);
    $("svMarket").textContent = money(mktLow) + " – " + money(mktHigh);
    $("svPct").textContent = Math.round(tier.low * 100) + "–" + Math.round(tier.high * 100) + "%";
    $("svSave").textContent = money(saveLow) + " – " + money(saveHigh);
    $("svCost").textContent = money(costLow) + " – " + money(costHigh);
    $("svRefNote").textContent = base > 0
      ? "vs your baseline of $" + base.toFixed(2) + "/kg"
      : "market reference $" + c.refLow.toFixed(2) + "–" + c.refHigh.toFixed(2) + "/kg (indicative, 2025)";
  }

  /* ---------- SELLER ---------- */
  function seller() {
    var c = marketChem($("seChem").value); if (!c) return;
    var qty = parseFloat($("seQty").value) || 0;
    var tons = qty / 1000;
    var recLow = qty * c.refLow * (1 - 0.70);   // recover ~30-80% of market value
    var recHigh = qty * c.refHigh * (1 - 0.20);
    var dispLow = tons * CS_MARKET.disposal.tonLow;
    var dispHigh = tons * CS_MARKET.disposal.tonHigh;
    $("seRecover").textContent = money(recLow) + " – " + money(recHigh);
    $("seDisposal").textContent = money(dispLow) + " – " + money(dispHigh);
    $("seTotal").textContent = money(recLow + dispLow) + " – " + money(recHigh + dispHigh);
  }

  /* tabs */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-sv-tab]");
    if (!t) return;
    var mode = t.dataset.svTab;
    document.querySelectorAll("[data-sv-tab]").forEach(function (b) { b.classList.toggle("is-active", b === t); });
    $("svBuyer").classList.toggle("hidden", mode !== "buyer");
    $("svSeller").classList.toggle("hidden", mode !== "seller");
  });

  $("svBuyer").addEventListener("input", buyer);
  $("svSeller").addEventListener("input", seller);
  buyer(); seller();
})();
