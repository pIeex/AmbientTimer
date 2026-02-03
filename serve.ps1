$ErrorActionPreference = "Stop"
Write-Host "Starting local server at http://localhost:5173"
python -m http.server 5173
