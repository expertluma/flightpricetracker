# Push changes to Azure via GitHub
Set-Location 'd:\MYSYSTEMS\Flight Price Tracker'

Write-Host "=== Pushing to Azure (via GitHub) ===" -ForegroundColor Cyan
Write-Host ""

# Check current status
Write-Host "Current status:" -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "Adding all changes..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "Trigger Azure deployment" --allow-empty

Write-Host ""
Write-Host "Pushing to GitHub (triggers Azure deployment)..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
Write-Host "Azure will automatically deploy from the updated main branch" -ForegroundColor Green
