# Gotchas

- **PowerShell JSON read:** always `Get-Content $path -Raw -Encoding UTF8` before `ConvertFrom-Json`. Without `-Encoding UTF8`, PS 5.1 decodes UTF-8 as ANSI and em/en dashes (— –) become `â€"` / `â€"` mojibake in every generated page.
- **serve.ps1:** never set `$ctx.Response.KeepAlive = $false`. It flips HttpListener to chunked transfer, which conflicts with `ContentLength64` → ProtocolViolationException mid-write → the browser hangs and preview screenshots time out.
- **`categories/` is generated** — never hand-edit; `build-seo.ps1` overwrites it. Change `seo/keywords.json` instead.
- **`Out-File -Encoding utf8`** in PS 5.1 writes a BOM. Harmless for HTML/XML; leave as-is.
- **No Node, no real Python** on this host (Python is the Store stub, exit 49). Don't reach for npm/pip-based tooling — use PowerShell.
- Preview screenshot harness can wedge after a server error; verify via direct HTTP (`Invoke-WebRequest http://localhost:8099/...`) as a fallback.
