# Set execution policy for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Navigate to project directory
$projectDir = "d:\MYSYSTEMS\Flight Price Tracker"
Set-Location $projectDir

Write-Host "Project directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host "`n=== Git Status ===" -ForegroundColor Yellow
git status

Write-Host "`n=== Adding Files ===" -ForegroundColor Yellow
git add .

Write-Host "`n=== Committing ===" -ForegroundColor Yellow
git commit -m "Initial commit: Flight Price Tracker SaaS"

Write-Host "`n=== Setting Main Branch ===" -ForegroundColor Yellow
git branch -M main

Write-Host "`n=== Setting Up Remote ===" -ForegroundColor Yellow
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin https://github.com/expertluma/flightpricetracker.git

Write-Host "`n=== Remote Configuration ===" -ForegroundColor Yellow
git remote -v

Write-Host "`n=== Latest Commit ===" -ForegroundColor Yellow
git log --oneline -1

Write-Host "`n=== Pushing to GitHub ===" -ForegroundColor Yellow
git push -u origin main

Write-Host "`n=== Complete ===" -ForegroundColor Green
