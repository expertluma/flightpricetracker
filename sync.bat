@echo off
cd /d "d:\MYSYSTEMS\Flight Price Tracker"
echo Pulling latest changes from GitHub...
git pull origin main --no-edit
echo.
echo Pushing local changes to GitHub...
git add .
git commit -m "Update Azure workflow configuration" --allow-empty
git push origin main
echo.
echo Done! Azure will now redeploy with the updated workflow.
pause
