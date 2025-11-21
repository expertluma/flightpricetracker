@echo off  
cd /d \"d:\MYSYSTEMS\Flight Price Tracker\"  
git init  
git config user.name \"expertluma\"  
git config user.email \"expert@luma.com\"  
git add .  
git commit -m \"Initial commit: Complete Flight Price Tracker SaaS product\"  
git branch -M main  
git remote add origin https://github.com/expertluma/flightpricetracker.git  
git push -u origin main  
