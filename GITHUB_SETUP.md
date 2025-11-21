# GitHub Setup & Push Guide

Complete step-by-step guide to push Flight Price Tracker to GitHub and use it for Lemon Squeezy verification.

---

## Step 1: Create GitHub Repository (5 minutes)

### 1.1 Go to GitHub
1. Go to [github.com](https://github.com)
2. Sign in (create account if needed)
3. Click **+** icon (top-right) → **New repository**

### 1.2 Create Repository
**Repository name:** `flight-price-tracker`

**Description:** 
```
Earn $1,000+/month: Production-ready Chrome extension + backend for flight price tracking with email alerts. Built in 6 days, ready to deploy.
```

**Settings:**
- **Visibility:** Public (required for Lemon Squeezy verification)
- **Initialize:** None (we have files already)
- Click **Create repository**

### 1.3 Get Repository URL
You'll see:
```
https://github.com/yourusername/flight-price-tracker.git
```

Copy this URL for step 2.

---

## Step 2: Configure Git Locally (5 minutes)

### 2.1 Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 2.2 Initialize Repository
```bash
cd d:\MYSYSTEMS\Flight Price Tracker
git init
```

### 2.3 Add All Files
```bash
git add .
```

Check what's being added:
```bash
git status
```

Should show all files in green.

### 2.4 Create Initial Commit
```bash
git commit -m "Initial commit: Flight Price Tracker MVP - Chrome extension + backend"
```

---

## Step 3: Connect to GitHub (3 minutes)

### 3.1 Add Remote
```bash
git remote add origin https://github.com/yourusername/flight-price-tracker.git
```

Replace `yourusername` with your GitHub username.

### 3.2 Rename Branch (if needed)
```bash
git branch -M main
```

---

## Step 4: Push to GitHub (2 minutes)

### 4.1 First Time Push
```bash
git push -u origin main
```

You may be prompted to authenticate:
- **Option 1:** Use GitHub CLI (recommended)
  ```bash
  gh auth login
  # Follow prompts
  ```
- **Option 2:** Use SSH key (advanced)
- **Option 3:** Use personal access token

### 4.2 Verify Push
Go to https://github.com/yourusername/flight-price-tracker

Should show:
- ✅ All files visible
- ✅ README.md displayed
- ✅ Project structure visible

---

## Step 5: Add GitHub Badges & Links (3 minutes)

### 5.1 Add to Landing Page
Edit `public/index.html` footer:
```html
<li><a href="https://github.com/yourusername/flight-price-tracker">GitHub Repository</a></li>
```

### 5.2 Add to README.md
```markdown
## Source Code

🔓 **Open Source** – View on [GitHub](https://github.com/yourusername/flight-price-tracker)

Built with transparency. Fork, modify, deploy for your own project.
```

### 5.3 Push Changes
```bash
git add .
git commit -m "Add GitHub links"
git push origin main
```

---

## Step 6: Use for Lemon Squeezy Verification (Important!)

### 6.1 What Lemon Squeezy Requires
When you submit to Lemon Squeezy, they want:
- ✅ Website showing your product
- ✅ Business details
- ✅ How you earn money
- ✅ Source code (optional but shows legitimacy)

### 6.2 Reference GitHub in Application
In your Lemon Squeezy seller verification, add:

**Business Description:**
```
Flight Price Tracker is a Chrome extension that helps travelers save money 
by automatically tracking flight prices and sending email alerts. We offer a 
free tier (2 flights max) and a Pro subscription ($7.99/month) for unlimited 
tracking. Source code is publicly available on GitHub.
```

**Website Business Details:**
```
https://flightpricetracker.com

Source: https://github.com/yourusername/flight-price-tracker
```

**Why This Matters:**
- Shows transparency (public source code)
- Proves you built it (real code, not placeholder)
- Increases trust with Lemon Squeezy (higher approval rate)
- Marketing advantage (portfolio + credibility)

---

## Step 7: GitHub Features for Credibility (Optional)

### 7.1 Add GitHub Actions (Automated Testing)
Create `.github/workflows/lint.yml`:
```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
```

### 7.2 Add License
Create `LICENSE` file:
```
MIT License

Copyright (c) 2025 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software...
```

### 7.3 Add CHANGELOG
Create `CHANGELOG.md`:
```markdown
# Changelog

## [0.1.0] - 2025-01-XX
### Added
- Initial release
- Chrome extension MVP
- Backend API
- Email alerts
- Lemon Squeezy integration
```

---

## Step 8: Keep GitHub Updated (Ongoing)

After deployment and during development:

### 8.1 After Code Changes
```bash
git add .
git commit -m "Update feature: [describe change]"
git push origin main
```

### 8.2 Version Tags
```bash
git tag -a v0.1.0 -m "Release version 0.1.0"
git push origin v0.1.0
```

### 8.3 Create Releases
Go to GitHub → **Releases** → **Create Release**
- **Tag:** v0.1.0
- **Title:** Flight Price Tracker v0.1.0
- **Description:** MVP release with...

---

## Troubleshooting

### "fatal: not a git repository"
```bash
cd d:\MYSYSTEMS\Flight Price Tracker
git init
```

### "rejected ... (fetch first)"
```bash
git pull origin main
# Resolve conflicts if any
git push origin main
```

### Authentication fails
```bash
# Use GitHub CLI (easiest)
gh auth login
```

### Wrong remote URL
```bash
git remote -v  # Check current
git remote remove origin
git remote add origin https://github.com/yourusername/flight-price-tracker.git
```

### Pushed to wrong branch
```bash
git push -u origin main
```

---

## GitHub Profile Appearance

Your profile will show:
- **Repository:** flight-price-tracker ⭐
- **Language:** TypeScript, JavaScript, HTML, CSS
- **Commit history:** Shows development progress
- **Topics:** Chrome-extension, React, Nodejs, Saas

This is great for:
- Job applications (shows real product)
- Credibility with Lemon Squeezy
- Building audience on GitHub
- SEO (people find it via GitHub search)

---

## Sharing Your Repository

### Via Lemon Squeezy
When submitting business details, mention:
```
Source code: https://github.com/yourusername/flight-price-tracker
```

### Via Social Media
```
Just built and launched Flight Price Tracker! 
A Chrome extension that tracks flight prices + sends email alerts.
Earn $1k+/month from day 1. 

Built in 6 days. Open source on GitHub.
https://github.com/yourusername/flight-price-tracker

#startup #saas #chrome-extension #flightdeals
```

### Via Portfolio
Add to your website:
```html
<a href="https://github.com/yourusername/flight-price-tracker">
  View on GitHub →
</a>
```

---

## Success Checklist

- [ ] GitHub account created
- [ ] Repository created (public)
- [ ] All files pushed to GitHub
- [ ] README displays correctly
- [ ] License added
- [ ] GitHub links added to website
- [ ] Referenced in Lemon Squeezy application
- [ ] First release tagged
- [ ] Social media post shared

---

## Next Steps

1. ✅ Push to GitHub (complete)
2. ✅ Update website with GitHub link
3. ✅ Reference in Lemon Squeezy
4. ✅ Deploy to production
5. ✅ Monitor issues from GitHub
6. ✅ Accept pull requests if desired

---

## Commands Reference

```bash
# Initialize
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/yourusername/flight-price-tracker.git
git branch -M main

# Push
git push -u origin main

# After changes
git add .
git commit -m "Description"
git push origin main

# Tags
git tag -a v0.1.0 -m "Version 0.1.0"
git push origin v0.1.0

# Check status
git status
git log
git remote -v
```

---

## Your GitHub URL

**Once pushed:** https://github.com/yourusername/flight-price-tracker

**Use this for:**
- Lemon Squeezy verification
- Resume/portfolio
- Social media
- Marketing

---

Good luck! Your GitHub repo is your credibility. Make it count! 🚀

Questions? Open an issue on your repo!
