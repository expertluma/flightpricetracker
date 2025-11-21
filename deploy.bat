@echo off
REM Deploy to GitHub
cd /d "d:\MYSYSTEMS\Flight Price Tracker"
echo Current directory: %cd%

REM Check git status
echo.
echo === GIT STATUS ===
git status

REM Add all files
echo.
echo === ADDING FILES ===
git add .

REM Commit
echo.
echo === COMMITTING ===
git commit -m "Initial commit: Flight Price Tracker SaaS"

REM Ensure main branch
echo.
echo === SETTING MAIN BRANCH ===
git branch -M main

REM Setup remote (remove if exists, add fresh)
echo.
echo === SETTING UP REMOTE ===
git remote remove origin 2>nul
git remote add origin https://github.com/expertluma/flightpricetracker.git

REM Verify setup
echo.
echo === REMOTE CONFIG ===
git remote -v

REM Show latest commit
echo.
echo === LATEST COMMIT ===
git log --oneline -1

REM Push to GitHub
echo.
echo === PUSHING TO GITHUB ===
git push -u origin main

echo.
echo === COMPLETE ===
pause
