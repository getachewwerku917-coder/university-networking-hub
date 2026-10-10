# ==============================================================================
# CampusLink - One-Click ZIP Packager Script
# ==============================================================================

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$downloadsFolder = [System.IO.Path]::Combine($env:USERPROFILE, "Downloads")
$zipPath = Join-Path $downloadsFolder "campuslink.zip"

Write-Host "📦 Packaging CampusLink project into ZIP..." -ForegroundColor Cyan
Write-Host "Source: $projectDir"
Write-Host "Destination: $zipPath"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$projectDir\*" -DestinationPath $zipPath -Force

Write-Host ""
Write-Host "✅ CampusLink project has been successfully zipped!" -ForegroundColor Green
Write-Host "📁 File location: $zipPath" -ForegroundColor Yellow
Write-Host ""
Start-Process explorer.exe "/select,$zipPath"
