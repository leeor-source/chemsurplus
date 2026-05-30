<#
  ChemSurplus - chemical/CAS page engine + segmented sitemap index.
  Reads seo/chemicals.json (+ keywords.json, industries.json) and generates:
    * chemical/<slug>.html        per-chemical / per-CAS SEO pages (ChemicalSubstance + AggregateOffer + Breadcrumb)
    * chemicals.html              A-Z index hub
    * sitemap.xml (INDEX) + sitemap-core/industries/categories/chemicals.xml
  USAGE: powershell -ExecutionPolicy Bypass -File build-chemicals.ps1
  Keep this source pure ASCII (PowerShell 5.1 reads scripts as ANSI).
#>
$ErrorActionPreference = "Stop"
$root   = $PSScriptRoot
$chemDir= Join-Path $root "chemical"
if (!(Test-Path $chemDir)) { New-Item -ItemType Directory -Path $chemDir | Out-Null }

$domain = "https://www.chemsurplus.com"
$data   = Get-Content (Join-Path $root "seo\chemicals.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$chems  = $data.chemicals
$updated= $data.meta.lastUpdated
$cats   = (Get-Content (Join-Path $root "seo\keywords.json")   -Raw -Encoding UTF8 | ConvertFrom-Json).landingPages
$inds   = (Get-Content (Join-Path $root "seo\industries.json") -Raw -Encoding UTF8 | ConvertFrom-Json).industries

Write-Host "ChemSurplus chemical build ($($chems.Count) chemicals)" -ForegroundColor Cyan
Write-Host ("-" * 56)

function Header { param($base)
@"
<header class="site-header">
  <div class="container nav">
    <a href="$base`index.html" class="brand">
      <svg class="brand__mark" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#0e6b5c"/><path d="M16 9h8M17 9v7l-6 11a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3l-6-11V9" stroke="#16c79a" stroke-width="2" stroke-linejoin="round"/></svg>
      ChemSurplus</a>
    <ul class="nav__links">
      <li><a href="$base`buy.html">Buy chemicals</a></li><li><a href="$base`sell.html">Sell surplus</a></li>
      <li><a href="$base`chemicals.html">Chemicals</a></li><li><a href="$base`index.html#industries">Industries</a></li>
    </ul>
    <div class="nav__cta">
      <a href="$base`rfq.html" class="btn btn--ghost">RFQ list <span class="rfq-badge hidden" data-rfq-count>0</span></a>
      <a href="$base`buy.html" class="btn btn--primary">Browse marketplace</a>
      <button class="nav__toggle" data-nav-toggle aria-label="Menu"><svg width="26" height="26" viewBox="0 0 24 24" stroke="#0a1f1b" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
    </div>
  </div>
</header>
"@
}

$generated = @()
foreach ($c in $chems) {
  $url = "$domain/chemical/$($c.slug).html"
  $syn = ($c.synonyms -join ", ")
  $apps = ($c.applications | ForEach-Object { "<li>$_</li>" }) -join ""
  $indLinks = ($c.industries | ForEach-Object { $s=$_; $n=($inds | Where-Object { $_.slug -eq $s }).name; "<a class=""pill"" href=""../industries/$s.html"">$n</a>" }) -join " "

  # ChemicalSubstance schema only for real single substances
  $chemSchema = ""
  if ($c.cas -and $c.cas -ne "Mixture") {
    $formulaProp = if ($c.formula) { ",`"molecularFormula`":`"$($c.formula)`"" } else { "" }
    $mwProp = if ($c.mw) { ",`"molecularWeight`":`"$($c.mw)`"" } else { "" }
    $chemSchema = ",{`"@type`":`"ChemicalSubstance`",`"name`":`"$($c.name)`",`"identifier`":`"CAS $($c.cas)`"$formulaProp$mwProp}"
  }
  $factRows = ""
  $factRows += "<tr><th>CAS number</th><td>$($c.cas)</td></tr>"
  if ($c.formula) { $factRows += "<tr><th>Formula</th><td>$($c.formula)</td></tr>" }
  if ($c.mw) { $factRows += "<tr><th>Molecular weight</th><td>$($c.mw)</td></tr>" }
  if ($syn) { $factRows += "<tr><th>Synonyms</th><td>$syn</td></tr>" }
  $factRows += "<tr><th>Category</th><td>$($c.cat)</td></tr>"

  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Surplus $($c.name) for Sale - CAS $($c.cas) | ChemSurplus</title>
<meta name="description" content="Buy surplus $($c.name) (CAS $($c.cas)) below market - verified lots with SDS/COA. $($c.desc)">
<meta name="keywords" content="surplus $($c.name), buy surplus $($c.name), $($c.name) for sale, $($c.cas), off-spec $($c.name)">
<link rel="canonical" href="$url">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="product">
<meta property="og:title" content="Surplus $($c.name) for Sale - CAS $($c.cas)">
<meta property="og:description" content="$($c.desc)">
<meta property="og:url" content="$url">
<meta property="og:image" content="$domain/assets/img/og-cover.svg">
<meta name="theme-color" content="#0e6b5c">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"></noscript>
<link rel="stylesheet" href="../assets/css/styles.css">
<link rel="icon" href="../assets/img/favicon.svg" type="image/svg+xml">
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"BreadcrumbList","itemListElement":[
{"@type":"ListItem","position":1,"name":"Home","item":"$domain/"},
{"@type":"ListItem","position":2,"name":"Chemicals","item":"$domain/chemicals.html"},
{"@type":"ListItem","position":3,"name":"$($c.name)","item":"$url"}]},
{"@type":"Product","name":"Surplus $($c.name)","sku":"$($c.slug)","category":"$($c.cat)",
"offers":{"@type":"AggregateOffer","priceCurrency":"USD","lowPrice":"$($c.priceLow)","highPrice":"$($c.priceHigh)","offerCount":"$($c.offerCount)","availability":"https://schema.org/InStock"}}$chemSchema]}
</script>
</head>
<body>
$(Header "../")

<section class="section--tight">
  <div class="container prose">
    <nav class="crumbs"><a href="../index.html">Home</a> &rsaquo; <a href="../chemicals.html">Chemicals</a> &rsaquo; <span>$($c.name)</span></nav>
    <span class="tag tag--green">CAS $($c.cas)</span>
    <h1 style="margin-top:.5rem">Surplus $($c.name) for sale</h1>
    <p class="lead">$($c.desc)</p>
    <div class="flex gap wrap mt-2">
      <a href="#lots" class="btn btn--primary btn--lg">See live lots</a>
      <a href="../sell.html" class="btn btn--ghost btn--lg">Sell your $($c.name)</a>
    </div>
  </div>
</section>

<section class="section--tight" style="background:#fff;border-top:1px solid var(--line)">
  <div class="container grid grid--2" style="align-items:start">
    <div>
      <h2>Key facts</h2>
      <table class="table spec-table">$factRows</table>
    </div>
    <div>
      <h2>Typical applications</h2>
      <ul class="prose">$apps</ul>
      <h2 class="mt-3">Industries that buy it</h2>
      <div class="internal-links">$indLinks</div>
    </div>
  </div>
</section>

<section class="section--tight" id="lots">
  <div class="container">
    <h2>Live surplus $($c.name) lots</h2>
    <p class="muted">Verified lots from our broker network - SDS/COA included. Prices shown are indicative; request a quote for your quantity.</p>
    <div class="listings mt-3" id="chemLots"></div>
  </div>
</section>

<section class="section--tight">
  <div class="container">
    <div class="cta-band flex between items-center wrap gap">
      <div style="max-width:38ch"><h2>Need $($c.name) in your quantity?</h2><p>Add lots to an RFQ and we'll source it across verified brokers.</p></div>
      <div class="flex gap wrap"><a href="../buy.html" class="btn btn--accent btn--lg">Browse marketplace</a><a href="../chemicals.html" class="btn btn--light btn--lg">All chemicals</a></div>
    </div>
  </div>
</section>

<footer class="site-footer">
  <div class="container"><div class="footer-bottom" style="border:0;margin:0;padding:0">
    <span>&copy; 2026 ChemSurplus &mdash; surplus $($c.name) and more.</span>
    <span><a href="../index.html" style="color:#9fb3ad">Home</a> &middot; <a href="../buy.html" style="color:#9fb3ad">Buy</a> &middot; <a href="../sell.html" style="color:#9fb3ad">Sell</a></span>
  </div></div>
</footer>

<script src="../assets/js/app.js"></script>
<script src="../assets/js/suppliers.js"></script>
<script src="../assets/js/industries.js"></script>
<script src="../assets/js/data.js"></script>
<script src="../assets/js/productart.js"></script>
<script src="../assets/js/card.js"></script>
<script src="../assets/js/rfq.js"></script>
<script>
  (function(){
    var cas = "$($c.cas)", nm = "$($c.name)";
    var lots = getAllListings().filter(function(l){ return l.cas === cas || (l.name && l.name.indexOf(nm) === 0); });
    var el = document.getElementById("chemLots");
    el.innerHTML = lots.length ? lots.map(listingCardHTML).join("")
      : '<div class="card" style="grid-column:1/-1;text-align:center;padding:2.5rem"><h3>No live lots right now</h3><p class="muted">Set a sourcing alert and we will notify you when surplus ' + nm + ' is listed.</p><a href="../buy.html" class="btn btn--primary">Browse all surplus</a></div>';
    if (window.RFQ) RFQ.badge();
  })();
</script>
</body>
</html>
"@
  $html | Out-File -FilePath (Join-Path $chemDir "$($c.slug).html") -Encoding utf8
  $generated += $c.slug
  Write-Host ("  [+] chemical/{0,-34} CAS {1}" -f "$($c.slug).html", $c.cas) -ForegroundColor Green
}

# ---------- chemicals.html index hub ----------
$rows = ($chems | Sort-Object name | ForEach-Object {
  "<a class=""matrix-row"" href=""chemical/$($_.slug).html""><div class=""matrix-row__ind""><strong>$($_.name)</strong></div><div class=""matrix-row__cats""><span class=""tag tag--gray"">CAS $($_.cas)</span><span class=""tag tag--gray"">$($_.cat)</span></div><div class=""matrix-row__tol""><span class=""muted"" style=""font-size:.82rem"">from `$$($_.priceLow)/$($_.unit)</span></div></a>"
}) -join "`n"

$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Surplus Chemicals A-Z | Buy Below Market by Name & CAS - ChemSurplus</title>
<meta name="description" content="Browse surplus chemicals by name and CAS number - solvents, specialty chemicals, surfactants, acids, resins and more, verified and below market with SDS/COA.">
<link rel="canonical" href="$domain/chemicals.html">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Surplus Chemicals A-Z - ChemSurplus">
<meta property="og:description" content="Buy surplus chemicals by name and CAS, verified and below market.">
<meta property="og:type" content="website">
<meta property="og:image" content="$domain/assets/img/og-cover.svg">
<meta name="theme-color" content="#0e6b5c">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"></noscript>
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
</head>
<body>
$(Header "")
<section class="section--tight">
  <div class="container">
    <p class="eyebrow">Surplus chemicals A-Z</p>
    <h1>Browse surplus chemicals by name &amp; CAS</h1>
    <p class="lead">Every chemical below has verified surplus lots with SDS/COA. Search by name or CAS number to find what you need below market.</p>
    <div class="matrix mt-4">
$rows
    </div>
  </div>
</section>
<footer class="site-footer"><div class="container"><div class="footer-bottom" style="border:0;margin:0;padding:0">
  <span>&copy; 2026 ChemSurplus.</span>
  <span><a href="index.html" style="color:#9fb3ad">Home</a> &middot; <a href="buy.html" style="color:#9fb3ad">Buy</a> &middot; <a href="sell.html" style="color:#9fb3ad">Sell</a></span>
</div></div></footer>
<script src="assets/js/app.js"></script>
</body>
</html>
"@
$indexHtml | Out-File -FilePath (Join-Path $root "chemicals.html") -Encoding utf8
Write-Host "  [+] chemicals.html (A-Z index)" -ForegroundColor Green

# ---------- segmented sitemaps + index ----------
function Write-Sitemap { param($file, $urls)
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
  [void]$sb.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
  foreach ($u in $urls) { [void]$sb.AppendLine("  <url><loc>$($u.loc)</loc><lastmod>$updated</lastmod><changefreq>$($u.f)</changefreq><priority>$($u.p)</priority></url>") }
  [void]$sb.AppendLine('</urlset>')
  $sb.ToString() | Out-File -FilePath (Join-Path $root $file) -Encoding utf8
}
Write-Sitemap "sitemap-core.xml" @(
  @{loc="$domain/";f="daily";p="1.0"}, @{loc="$domain/buy.html";f="daily";p="0.9"},
  @{loc="$domain/sell.html";f="weekly";p="0.9"}, @{loc="$domain/how-it-works.html";f="monthly";p="0.6"},
  @{loc="$domain/ecosystem.html";f="monthly";p="0.7"}, @{loc="$domain/chemicals.html";f="weekly";p="0.8"}
)
Write-Sitemap "sitemap-industries.xml" ($inds | ForEach-Object { @{loc="$domain/industries/$($_.slug).html";f="weekly";p="0.85"} })
Write-Sitemap "sitemap-categories.xml" ($cats | ForEach-Object { @{loc="$domain/categories/$($_.slug).html";f="weekly";p="0.8"} })
Write-Sitemap "sitemap-chemicals.xml" ($chems | ForEach-Object { @{loc="$domain/chemical/$($_.slug).html";f="weekly";p="0.8"} })

$idx = New-Object System.Text.StringBuilder
[void]$idx.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$idx.AppendLine('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
foreach ($s in @("core","industries","categories","chemicals")) {
  [void]$idx.AppendLine("  <sitemap><loc>$domain/sitemap-$s.xml</loc><lastmod>$updated</lastmod></sitemap>")
}
[void]$idx.AppendLine('</sitemapindex>')
$idx.ToString() | Out-File -FilePath (Join-Path $root "sitemap.xml") -Encoding utf8

Write-Host ("-" * 56)
$total = 6 + $inds.Count + $cats.Count + $chems.Count
Write-Host ("Done. $($chems.Count) chemical pages + chemicals.html + sitemap index ($total URLs across 4 segments).") -ForegroundColor Cyan
