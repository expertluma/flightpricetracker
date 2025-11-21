# Deployment Checklist – Launch in 6 Days

Complete this checklist to go live with your Flight Price Tracker.

---

## **Day 1: Infrastructure Setup**

### Supabase (30 min)
- [ ] Create Supabase project
- [ ] Run schema.sql in SQL editor
- [ ] Verify tables created (users, tracked_flights, price_history)
- [ ] Copy SUPABASE_URL and SUPABASE_ANON_KEY
- [ ] Enable Row Level Security on all tables
- [ ] Create test user account

### Resend Email (15 min)
- [ ] Create Resend account
- [ ] Get API key
- [ ] (Optional) Add verified domain for custom sender email
- [ ] Test email sending with sample template

### Lemon Squeezy (30 min)
- [ ] Create store
- [ ] Create "Flight Price Tracker Pro" product ($7.99/month)
- [ ] Get Product ID and Variant ID
- [ ] Create webhook for order completion
- [ ] Get Store URL
- [ ] Copy Webhook Secret

**Time: ~1.5 hours**

---

## **Day 2: Local Development**

### Setup (1 hour)
- [ ] Clone/download project
- [ ] Install Node.js 20+
- [ ] `npm install` (root + backend)
- [ ] Create `.env` with all credentials
- [ ] Test backend: `npm run dev:backend` → `curl localhost:3000/api/health`
- [ ] Build extension: `npm run build:extension`

### Test Extension Locally (1 hour)
- [ ] Load extension in Chrome (chrome://extensions)
- [ ] Go to Google Flights
- [ ] Verify green button appears
- [ ] Track a flight
- [ ] Open popup → see tracked flight
- [ ] Check Chrome DevTools console (no errors)

### Backend Testing (1 hour)
- [ ] Test `/api/auth/signup`
- [ ] Test `/api/track-flight`
- [ ] Test `/api/flights/:userId`
- [ ] Verify Supabase data inserted
- [ ] Test price history storage

**Time: ~3 hours**

---

## **Day 3: Payment & Email Integration**

### Payment Webhook (1 hour)
- [ ] Update Lemon Squeezy webhook URL to `localhost:3000` (use ngrok for testing)
- [ ] Test webhook signature verification
- [ ] Simulate payment → verify user marked as Pro in Supabase
- [ ] Test checkout URL generation endpoint

### Email Integration (1 hour)
- [ ] Test `sendPriceDropEmail()` with sample flight data
- [ ] Verify email format and "Book Now" link works
- [ ] Test with multiple recipients
- [ ] Check Resend dashboard for sent emails
- [ ] Verify unsubscribe link format

### Backend Cron (1 hour)
- [ ] Verify cron job runs every hour
- [ ] Test price scraping with real Google Flights URL
- [ ] Trigger manual price check via API
- [ ] Monitor logs for errors

**Time: ~3 hours**

---

## **Day 4: Fly.io Deployment**

### Prepare Fly.io (30 min)
- [ ] Create Fly.io account
- [ ] Install flyctl CLI
- [ ] Login: `flyctl auth login`

### Deploy Backend (1 hour)
- [ ] Run `flyctl launch --no-deploy`
- [ ] Set all secrets: `flyctl secrets set KEY=value ...`
- [ ] Deploy: `flyctl deploy`
- [ ] Get backend URL: `flyctl info`
- [ ] Test health endpoint: `curl https://your-app.fly.dev/api/health`

### Configure Integrations (30 min)
- [ ] Update Lemon Squeezy webhook URL to production URL
- [ ] Update extension BACKEND_URL to production URL
- [ ] Rebuild extension: `npm run build:extension`
- [ ] Reload extension in Chrome

### Monitor Deployment (30 min)
- [ ] View logs: `flyctl logs`
- [ ] Check error rate (should be 0%)
- [ ] Monitor CPU/memory usage
- [ ] Test price checking in production

**Time: ~2.5 hours**

---

## **Day 5: Extension Build & Chrome Web Store**

### Finalize Extension (1 hour)
- [ ] Update version to 0.1.0 in manifest.json
- [ ] Create app icons (16px, 48px, 128px)
- [ ] Add icons to `public/icons/` folder
- [ ] Build final: `npm run build:extension`
- [ ] Test in Chrome one more time

### Chrome Web Store Submission (2 hours)
- [ ] Create Chrome Web Store developer account
- [ ] Upload zip of `dist/` folder
- [ ] Add screenshots (1280×800):
  - Screenshot 1: Green button on Google Flights
  - Screenshot 2: Popup with tracked flights
  - Screenshot 3: Price chart
  - Screenshot 4: Upgrade banner
- [ ] Write description:
  ```
  Track flight prices automatically and get email alerts when prices drop!
  
  ✨ Features:
  • One-click price tracking on Google Flights
  • Automatic price checks every 6 hours
  • Beautiful price history charts
  • Email alerts on 5%+ price drops
  • Free tier (2 flights) + Pro ($7.99/mo)
  
  💰 Monetization: Free tier is limited to 2 flights. Upgrade to Pro for unlimited tracking.
  ```
- [ ] Set category: Productivity
- [ ] Upload promotional images (440x280, 920x680)
- [ ] Submit for review (24-72 hours)

### While Waiting for Approval (1 hour)
- [ ] Create landing page (optional): https://flightpricetracker.com
- [ ] Set up support email: support@flightpricetracker.com
- [ ] Create privacy policy & terms
- [ ] Set up monitoring dashboard

**Time: ~3-4 hours (pending review)**

---

## **Day 6: Go Live & Marketing**

### Post-Approval (30 min)
- [ ] Extension published on Chrome Web Store
- [ ] Update extension store link in all docs
- [ ] Test download & install from store

### Soft Launch (1 hour)
- [ ] Email to 10-20 beta testers
- [ ] Get feedback on:
  - Price accuracy
  - Email delivery
  - UI/UX
  - Payment flow
- [ ] Monitor for errors in Fly.io logs
- [ ] Fix any bugs immediately

### Marketing (1 hour)
- [ ] Post on Product Hunt (if ready)
- [ ] Share on Twitter/X with link
- [ ] Share in relevant subreddits:
  - r/LifeHacks
  - r/ProductHunt
  - r/Frugal
- [ ] Create simple demo video (30 sec)

### Monitor & Scale (ongoing)
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Monitor Fly.io metrics
- [ ] Watch Supabase database size
- [ ] Track user sign-ups and Pro conversions
- [ ] Respond to support emails

**Time: ~2 hours**

---

## **Revenue Projections**

### Assumptions
- **Conversion Rate:** 5% of installs → paid users
- **Price:** $7.99/month
- **Churn:** 10%/month

### By Month
| Month | Installs | Pro Users | MRR | Notes |
|-------|----------|-----------|-----|-------|
| M1 | 500 | 25 | $199 | Launch |
| M2 | 2,000 | 150 | $1,194 | Growing |
| M3 | 5,000 | 400 | $3,184 | Word of mouth |
| M4 | 10,000 | 900 | $7,191 | Marketing |
| M6 | 50,000 | 4,500 | $35,955 | Exponential |

**Goal: Hit $1,000/mo by end of Month 2** ✈️

---

## **Post-Launch Roadmap (Optional)**

### Week 1-2 Post-Launch
- [ ] Add more flight sites (Kayak, Expedia, Skyscanner)
- [ ] Add Telegram/Slack notifications
- [ ] Create web dashboard

### Week 3-4
- [ ] Implement price prediction
- [ ] Add currency conversion
- [ ] Create affiliate program

### Month 2+
- [ ] Mobile app (iOS/Android)
- [ ] AI-powered insights
- [ ] Partner with travel bloggers
- [ ] Premium features ($19.99/mo)

---

## **Critical Success Factors**

1. **Price Accuracy** – Use Playwright headless browser for reliable scraping
2. **Email Delivery** – Monitor Resend bounce rates; keep list clean
3. **Fast Checks** – Keep Playwright warm; minimize latency
4. **User Experience** – Fast, intuitive UI; no friction
5. **Support** – Respond to emails within 24h; fix bugs immediately

---

## **Crisis Management**

### If price scraper breaks
- [ ] Add fallback method (API if available)
- [ ] Send email to affected users
- [ ] Revert to stable version

### If payment webhook fails
- [ ] Manual verification in Supabase
- [ ] Resend failed payment notifications
- [ ] Add retry logic

### If too many users
- [ ] Scale Fly.io machine size
- [ ] Add database replicas in Supabase
- [ ] Implement rate limiting

---

## **Final Checklist Before Launch**

- [ ] All 3 tables created in Supabase
- [ ] All env vars set in .env and Fly.io
- [ ] Backend health check returns 200
- [ ] Extension loads without errors
- [ ] Can track a flight and see it in popup
- [ ] Price scraper returns valid prices
- [ ] Email sends and arrives in inbox
- [ ] Payment webhook signature verification works
- [ ] User can upgrade to Pro and be marked as Pro
- [ ] Cron job runs on schedule
- [ ] Logs show no critical errors
- [ ] Extension submitted to Chrome Web Store

---

## **Day 6 Evening: Celebrate! 🎉**

You've built and launched a production-ready SaaS product in 6 days. Time to watch those installs come in!

Monitor:
- `flyctl logs` – Backend activity
- Supabase dashboard – User growth
- Resend dashboard – Email stats
- Lemon Squeezy – Revenue

Good luck! 🚀
