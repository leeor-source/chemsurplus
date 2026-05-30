<#  Minimal static file server for local preview of ChemSurplus.
    Usage: powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 8099]  #>
param([int]$Port = 8099)

$root = $PSScriptRoot
$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="application/javascript; charset=utf-8"; ".json"="application/json";
  ".svg"="image/svg+xml"; ".xml"="application/xml"; ".txt"="text/plain; charset=utf-8";
  ".png"="image/png"; ".jpg"="image/jpeg"; ".ico"="image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "ChemSurplus preview server -> http://localhost:$Port/"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath.TrimStart("/"))
  if ([string]::IsNullOrEmpty($path)) { $path = "index.html" }
  $full = Join-Path $root $path
  if (Test-Path $full -PathType Container) { $full = Join-Path $full "index.html" }

  try {
    if (Test-Path $full -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ct  = $mime[$ext]; if (-not $ct) { $ct = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ctx.Response.ContentType = $ct
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $ctx.Response.ContentLength64 = $msg.Length
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
  } catch { } finally { try { $ctx.Response.OutputStream.Close() } catch { } }
}
