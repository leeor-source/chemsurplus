<#
  ChemSurplus — SEO build engine
  -------------------------------------------------------------
  Reads seo/keywords.json and generates:
    * one keyword-targeted landing page per entry in landingPages[]  -> /categories/<slug>.html
    * a fresh sitemap.xml covering core pages + every generated page
    * a build report to console

  USAGE:   powershell -ExecutionPolicy Bypass -File build-seo.ps1
  Re-run any time you update keywords.json (new keywords, refreshed copy).
#>

$ErrorActionPreference = "Stop"
$root   = $PSScriptRoot
$kwPath = Join-Path $root "seo\keywords.json"
$catDir = Join-Path $root "categories"

if (!(Test-Path $kwPath)) { throw "keywords.json not found at $kwPath" }
if (!(Test-Path $catDir)) { New-Item -ItemType Directory -Path $catDir | Out-Null }

$data    = Get-Content $kwPath -Raw -Encoding UTF8 | ConvertFrom-Json
$domain  = $data.meta.domain
$updated = $data.meta.lastUpdated
$pages   = $data.landingPages

Write-Host "ChemSurplus SEO build  ($($pages.Count) landing pages)  keywords updated $updated" -ForegroundColor Cyan
Write-Host ("-" * 64)

# ---- shared header / footer fragments (relative to /categories/) ----
function Get-Header {
@"
<header class="site-header">
  <div class="container nav">
    <a href="../index.html" class="brand">
      <svg class="brand__mark" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="#0e6b5c"/><path d="M16 9h8M17 9v7l-6 11a2 2 0 0 0 1.7 3h14.6a2 2 0 0 0 1.7-3l-6-11V9" stroke="#16c79a" stroke-width="2" stroke-linejoin="round"/></svg>
      ChemSurplus</a>
    <ul class="nav__links">
      <li><a href="../buy.html">Buy chemicals</a></li><li><a href="../sell.html">Sell surplus</a></li>
      <li><a href="../how-it-works.html">How it works</a></li><li><a href="../index.html#categories">Categories</a></li>
    </ul>
    <div class="nav__cta">
      <a href="../sell.html" class="btn btn--ghost">List surplus</a>
      <a href="../buy.html" class="btn btn--primary">Browse marketplace</a>
      <button class="nav__toggle" data-nav-toggle aria-label="Menu"><svg width="26" height="26" viewBox="0 0 24 24" stroke="#0a1f1b" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
    </div>
  </div>
</header>
"@
}

function Get-Footer {
@"
<footer class="site-footer">
  <div class="container">
    <div class="footer-bottom" style="border:0;margin:0;padding:0">
      <span>&copy; 2026 ChemSurplus &mdash; surplus &amp; excess chemicals marketplace.</span>
      <span><a href="../index.html" style="color:#9fb3ad">Home</a> &middot; <a href="../buy.html" style="color:#9fb3ad">Buy</a> &middot; <a href="../sell.html" style="color:#9fb3ad">Sell</a></span>
    </div>
  </div>
</footer>
<script src="../assets/js/app.js"></script>
"@
}

$generated = @()

foreach ($p in $pages) {

  # ---- FAQ blocks (HTML + JSON-LD) ----
  $faqHtml = ""
  $faqJson = @()
  foreach ($f in $p.faqs) {
    $faqHtml += "      <details><summary>$($f.q)</summary><p class=""muted"">$($f.a)</p></details>`n"
    $faqJson += "{""@type"":""Question"",""name"":""$($f.q -replace '"','\"')"",""acceptedAnswer"":{""@type"":""Answer"",""text"":""$($f.a -replace '"','\"')""}}"
  }
  $faqJsonStr = $faqJson -join ","

  # ---- secondary keyword chips ----
  $secChips = ($p.secondaryKeywords | ForEach-Object { "<span class=""tag tag--gray"">$_</span>" }) -join " "

  # ---- internal links to sibling landing pages (topical clustering) ----
  $siblings = $pages | Where-Object { $_.slug -ne $p.slug } | Select-Object -First 6
  $internal = ($siblings | ForEach-Object { "<a class=""pill"" href=""$($_.slug).html"">$($_.primaryKeyword)</a>" }) -join " "

  $ctaBuy  = '<a href="../buy.html?cat=' + $p.relatedCat + '" class="btn btn--accent btn--lg">Browse ' + $p.primaryKeyword + ' &rarr;</a>'
  $ctaSell = '<a href="../sell.html" class="btn btn--primary btn--lg">List your surplus &rarr;</a>'
  $primaryCta = if ($p.cta -eq "sell") { $ctaSell + " " + $ctaBuy } else { $ctaBuy + " " + $ctaSell }
  $audienceTag = if ($p.audience -eq "seller") { '<span class="tag tag--green">For sellers</span>' }
                 elseif ($p.audience -eq "buyer") { '<span class="tag tag--amber">For buyers</span>' }
                 else { '<span class="tag tag--green">Sellers &amp; buyers</span>' }

  $url = "$domain/categories/$($p.slug).html"

  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>$($p.title)</title>
<meta name="description" content="$($p.metaDescription)">
<meta name="keywords" content="$($p.primaryKeyword), $($p.secondaryKeywords -join ', ')">
<link rel="canonical" href="$url">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:title" content="$($p.title)">
<meta property="og:description" content="$($p.metaDescription)">
<meta property="og:url" content="$url">
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
{"@type":"ListItem","position":2,"name":"$($p.primaryKeyword)","item":"$url"}]},
{"@type":"FAQPage","mainEntity":[$faqJsonStr]}]}
</script>
</head>
<body>
$(Get-Header)

<section class="section--tight">
  <div class="container prose">
    <div class="badge-row mb-0">$audienceTag</div>
    <h1 style="margin-top:.6rem">$($p.h1)</h1>
    <p class="lead">$($p.intro)</p>
    <div class="flex gap wrap mt-3">$primaryCta</div>
  </div>
</section>

<section class="section--tight" style="background:#fff;border-top:1px solid var(--line)">
  <div class="container prose">
    <h2>Why use ChemSurplus for $($p.primaryKeyword)?</h2>
    <ul>
      <li><strong>Verified counterparties</strong> &mdash; every seller and buyer is vetted before transacting.</li>
      <li><strong>SDS &amp; COA on every lot</strong> &mdash; full documentation and traceability.</li>
      <li><strong>30&ndash;70% below market</strong> &mdash; surplus pricing that beats prime supply.</li>
      <li><strong>Hazmat-ready logistics</strong> &mdash; drums, IBC totes, supersacks and bulk handled.</li>
    </ul>
    <p class="muted">Related searches we cover: $secChips</p>

    <h2>Browse related surplus</h2>
    <div class="internal-links">$internal</div>
  </div>
</section>

<section class="section--tight">
  <div class="container" style="max-width:820px">
    <h2 class="center">$($p.primaryKeyword) &mdash; FAQ</h2>
    <div class="faq mt-3">
$faqHtml    </div>
  </div>
</section>

<section class="section--tight">
  <div class="container">
    <div class="cta-band flex between items-center wrap gap">
      <div style="max-width:36ch"><h2>Ready to move on $($p.primaryKeyword)?</h2><p>List surplus or source it &mdash; documented, verified, below market.</p></div>
      <div class="flex gap wrap">$primaryCta</div>
    </div>
  </div>
</section>

$(Get-Footer)
</body>
</html>
"@

  $outFile = Join-Path $catDir "$($p.slug).html"
  $html | Out-File -FilePath $outFile -Encoding utf8
  $generated += [pscustomobject]@{ slug = $p.slug; keyword = $p.primaryKeyword; audience = $p.audience }
  Write-Host ("  [+] categories/{0,-32} -> '{1}'" -f "$($p.slug).html", $p.primaryKeyword) -ForegroundColor Green
}

# ---------- sitemap.xml ----------
$today = $updated
$core = @(
  @{ loc = "$domain/";                  pri = "1.0"; freq = "daily"  },
  @{ loc = "$domain/buy.html";          pri = "0.9"; freq = "daily"  },
  @{ loc = "$domain/sell.html";         pri = "0.9"; freq = "weekly" },
  @{ loc = "$domain/how-it-works.html"; pri = "0.6"; freq = "monthly"}
)
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sb.AppendLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
foreach ($c in $core) {
  [void]$sb.AppendLine("  <url><loc>$($c.loc)</loc><lastmod>$today</lastmod><changefreq>$($c.freq)</changefreq><priority>$($c.pri)</priority></url>")
}
foreach ($g in $generated) {
  [void]$sb.AppendLine("  <url><loc>$domain/categories/$($g.slug).html</loc><lastmod>$today</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>")
}
[void]$sb.AppendLine('</urlset>')
$sb.ToString() | Out-File -FilePath (Join-Path $root "sitemap.xml") -Encoding utf8

# ---------- report ----------
Write-Host ("-" * 64)
Write-Host ("Generated {0} landing pages + sitemap.xml ({1} URLs total)" -f $generated.Count, ($core.Count + $generated.Count)) -ForegroundColor Cyan
$byAud = $generated | Group-Object audience | ForEach-Object { "$($_.Name): $($_.Count)" }
Write-Host ("By audience -> " + ($byAud -join "  |  "))
Write-Host "Done. Submit sitemap.xml in Google Search Console after deploy." -ForegroundColor Yellow
