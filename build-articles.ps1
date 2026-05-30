<#
  ChemSurplus - article/blog engine.
  Reads seo/articles.json and generates:
    * articles/<slug>.html   niche articles (Article + FAQ + Breadcrumb schema, featured chemical imagery)
    * articles.html          index
    * sitemap-articles.xml
  USAGE: powershell -ExecutionPolicy Bypass -File build-articles.ps1
  Keep this source pure ASCII.
#>
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$artDir = Join-Path $root "articles"
if (!(Test-Path $artDir)) { New-Item -ItemType Directory -Path $artDir | Out-Null }
$domain = "https://www.chemsurplus.com"
$data = Get-Content (Join-Path $root "seo\articles.json") -Raw -Encoding UTF8 | ConvertFrom-Json
$arts = $data.articles
$updated = $data.meta.lastUpdated

Write-Host "ChemSurplus article build ($($arts.Count) articles)" -ForegroundColor Cyan
Write-Host ("-" * 50)

function Header { param($base)
@"
<header class="site-header">
  <div class="container nav">
    <a href="$base`index.html" class="brand">
      <svg class="brand__mark" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#0e6b5c"/><path d="M16 9h8M17 9v7l-6 11a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3l-6-11V9" stroke="#16c79a" stroke-width="2" stroke-linejoin="round"/></svg>
      ChemSurplus</a>
    <ul class="nav__links">
      <li><a href="$base`buy.html">Buy chemicals</a></li><li><a href="$base`sell.html">Sell surplus</a></li>
      <li><a href="$base`articles.html">Insights</a></li><li><a href="$base`chemicals.html">Chemicals</a></li>
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

foreach ($a in $arts) {
  $url = "$domain/articles/$($a.slug).html"
  $body = ""
  foreach ($s in $a.sections) {
    $body += "<h2>$($s.h2)</h2>`n"
    foreach ($p in $s.body) { $body += "<p>$p</p>`n" }
  }
  $faqHtml = ""; $faqJson = @()
  foreach ($f in $a.faqs) {
    $faqHtml += "<details><summary>$($f.q)</summary><p class=""muted"">$($f.a)</p></details>`n"
    $faqJson += "{""@type"":""Question"",""name"":""$($f.q -replace '"','\"')"",""acceptedAnswer"":{""@type"":""Answer"",""text"":""$($f.a -replace '"','\"')""}}"
  }
  $faqBlock = ""
  if ($faqHtml) { $faqBlock = "<section class=""section--tight""><div class=""container"" style=""max-width:760px""><h2 class=""center"">FAQ</h2><div class=""faq mt-3"">$faqHtml</div></div></section>" }
  $faqSchema = ""
  if ($faqJson.Count -gt 0) { $faqSchema = ",{""@type"":""FAQPage"",""mainEntity"":[" + ($faqJson -join ",") + "]}" }

  $chemJs = "[" + (($a.chemicals | ForEach-Object { "{slug:`"$($_.slug)`",name:`"$($_.name)`",cas:`"$($_.cas)`"}" }) -join ",") + "]"
  $relLink = ""
  if ($a.related -and $a.related -ne "guide") { $relLink = "<a class=""btn btn--ghost"" href=""../industries/$($a.related).html"">More for $($a.nicheLabel) &rarr;</a>" }

  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$($a.title) | ChemSurplus</title>
<meta name="description" content="$($a.dek)">
<link rel="canonical" href="$url">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="article">
<meta property="og:title" content="$($a.title)">
<meta property="og:description" content="$($a.dek)">
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
{"@type":"ListItem","position":2,"name":"Insights","item":"$domain/articles.html"},
{"@type":"ListItem","position":3,"name":"$($a.title)","item":"$url"}]},
{"@type":"Article","headline":"$($a.title)","description":"$($a.dek)","datePublished":"$($a.date)","image":"$domain/assets/img/og-cover.svg","author":{"@type":"Organization","name":"ChemSurplus"},"publisher":{"@type":"Organization","name":"ChemSurplus","logo":{"@type":"ImageObject","url":"$domain/assets/img/favicon.svg"}}}$faqSchema]}
</script>
</head>
<body>
$(Header "../")

<article>
<section class="section--tight">
  <div class="container" style="max-width:820px">
    <nav class="crumbs"><a href="../index.html">Home</a> &rsaquo; <a href="../articles.html">Insights</a> &rsaquo; <span>$($a.nicheLabel)</span></nav>
    <div class="art-hero mt-2">
      <div class="art-hero__ic" id="artIcon"></div>
      <div>
        <p class="eyebrow" style="margin:0">$($a.nicheLabel)</p>
        <h1 style="margin:.2rem 0">$($a.title)</h1>
        <p class="muted" style="margin:0;font-size:.9rem">$($a.date) &middot; $($a.readTime) read</p>
      </div>
    </div>
    <p class="lead mt-3">$($a.dek)</p>
  </div>
</section>

<section class="section--tight" style="padding-top:0">
  <div class="container prose">$body</div>
</section>

<section class="section--tight" style="background:#fff;border-top:1px solid var(--line)">
  <div class="container">
    <h2>Featured surplus chemicals</h2>
    <div class="grid grid--3 mt-3" id="chemGallery"></div>
  </div>
</section>
$faqBlock

<section class="section--tight">
  <div class="container">
    <div class="cta-band flex between items-center wrap gap">
      <div style="max-width:38ch"><h2>Source it below market.</h2><p>Personalized to your industry, documented, pricing on request.</p></div>
      <div class="flex gap wrap">$relLink<a href="../buy.html" class="btn btn--accent btn--lg">Browse marketplace</a></div>
    </div>
  </div>
</section>
</article>

<footer class="site-footer"><div class="container"><div class="footer-bottom" style="border:0;margin:0;padding:0">
  <span>&copy; 2026 ChemSurplus.</span>
  <span><a href="../index.html" style="color:#9fb3ad">Home</a> &middot; <a href="../articles.html" style="color:#9fb3ad">Insights</a> &middot; <a href="../buy.html" style="color:#9fb3ad">Buy</a></span>
</div></div></footer>

<script src="../assets/js/app.js"></script>
<script src="../assets/js/suppliers.js"></script>
<script src="../assets/js/industries.js"></script>
<script src="../assets/js/catalog.js"></script>
<script src="../assets/js/data.js"></script>
<script src="../assets/js/productart.js"></script>
<script>
  document.getElementById("artIcon").innerHTML = icon("$($a.icon)");
  (function(){
    var chems = $chemJs;
    var all = getAllListings();
    document.getElementById("chemGallery").innerHTML = chems.map(function(c){
      var lot = all.filter(function(l){ return l.cas === c.cas; })[0];
      var art = (lot && typeof productArt === "function") ? productArt(lot) : icon("flask");
      return '<a class="card card--hover" href="../chemical/'+c.slug+'.html" style="text-decoration:none;padding:0;overflow:hidden">'
        + '<div style="height:150px;background:#fff;border-bottom:1px solid var(--line)">'+art+'</div>'
        + '<div style="padding:1rem 1.1rem"><h3 style="margin:0">'+c.name+'</h3>'
        + '<span class="muted" style="font-size:.82rem">CAS '+c.cas+' &middot; surplus lots</span></div></a>';
    }).join("");
  })();
</script>
</body>
</html>
"@
  $html | Out-File -FilePath (Join-Path $artDir "$($a.slug).html") -Encoding utf8
  Write-Host ("  [+] articles/{0}" -f "$($a.slug).html") -ForegroundColor Green
}

# ---------- articles.html index ----------
$cards = ($arts | ForEach-Object {
  "<a class=""card card--hover"" href=""articles/$($_.slug).html"" style=""text-decoration:none""><span class=""tag tag--green"">$($_.nicheLabel)</span><h3 style=""margin:.5rem 0 .3rem"">$($_.title)</h3><p class=""muted"" style=""font-size:.9rem"">$($_.dek)</p><span class=""muted"" style=""font-size:.8rem"">$($_.date) &middot; $($_.readTime) read</span></a>"
}) -join "`n"
$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Insights: Surplus Chemical Buying & Selling Guides by Industry | ChemSurplus</title>
<meta name="description" content="Guides on buying and selling surplus chemicals by industry - water treatment, coatings, cleaning, plastics - plus how to recover value from off-spec and obsolete inventory.">
<link rel="canonical" href="$domain/articles.html">
<meta name="robots" content="index, follow">
<meta property="og:title" content="ChemSurplus Insights">
<meta property="og:description" content="Surplus chemical buying & selling guides by industry.">
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
    <p class="eyebrow">Insights</p>
    <h1>Surplus chemical guides, by industry</h1>
    <p class="lead">Practical guides on sourcing surplus chemistry in each niche - and on recovering value from inventory you'd otherwise dispose of.</p>
    <div class="grid grid--3 mt-4">
$cards
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
$indexHtml | Out-File -FilePath (Join-Path $root "articles.html") -Encoding utf8
Write-Host "  [+] articles.html (index)" -ForegroundColor Green

# sitemap-articles.xml
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sb.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
[void]$sb.AppendLine("  <url><loc>$domain/articles.html</loc><lastmod>$updated</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>")
foreach ($a in $arts) { [void]$sb.AppendLine("  <url><loc>$domain/articles/$($a.slug).html</loc><lastmod>$($a.date)</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>") }
[void]$sb.AppendLine('</urlset>')
$sb.ToString() | Out-File -FilePath (Join-Path $root "sitemap-articles.xml") -Encoding utf8

Write-Host ("-" * 50)
Write-Host ("Done. $($arts.Count) articles + articles.html + sitemap-articles.xml") -ForegroundColor Cyan
