@echo off  
cd /d \"d:\MYSYSTEMS\Flight Price Tracker\"  
git add .  
git commit -m \"Initial commit\"  
git branch -M main  
git remote add origin https://github.com/expertluma/flightpricetracker.git  
git push -u origin main  
