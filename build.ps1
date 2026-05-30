<#
  ChemSurplus — master build.
  Runs the category SEO generator then the industry generator (which also
  writes the complete sitemap covering core + categories + industries).
  USAGE: powershell -ExecutionPolicy Bypass -File build.ps1
#>
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
& (Join-Path $root "build-seo.ps1")
Write-Host ""
& (Join-Path $root "build-industries.ps1")
Write-Host ""
& (Join-Path $root "build-chemicals.ps1")
