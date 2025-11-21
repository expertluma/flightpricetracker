Set-Location 'd:\MYSYSTEMS\Flight Price Tracker'
Write-Host "Current directory: $(Get-Location)"
Write-Host "Git status before:"
git status
Write-Host "Adding files..."
git add .
Write-Host "Committing..."
git commit -m "Initial commit"
Write-Host "Creating main branch..."
git branch -M main
Write-Host "Removing origin if exists..."
git remote remove origin -ErrorAction SilentlyContinue
Write-Host "Adding origin..."
git remote add origin https://github.com/expertluma/flightpricetracker.git
Write-Host "Remote status:"
git remote -v
Write-Host "Pushing to GitHub..."
git push -u origin main
Write-Host "Done!"
