# Flight Price Tracker – Email Alerts – Setup Guide

## Project Overview

Complete Chrome extension + backend for tracking flight prices and sending email alerts when prices drop ≥5%.

**Stack:**
- Extension: Vite + React 18 + TypeScript + Tailwind + crxjs (Manifest V3)
- Backend: Node.js 20 + Express
- Scraping: Playwright (chromium)
- Database: Supabase (PostgreSQL + Auth)
- Email: Resend.com
- Hosting: Fly.io
- Payments: Lemon Squeezy

---

## Prerequisites

1. **Node.js 20+** – [Download](https://nodejs.org)
2. **Supabase Project** – [Create free project](https://supabase.com)
3. **Resend Account** – [Sign up](https://resend.com) (3k emails/month free)
4. **Lemon Squeezy Account** – [Sign up](https://lemonsqueezy.com)
5. **Fly.io Account** – [Sign up](https://fly.io) (free tier available)

---

## Step 1: Supabase Setup

### 1.1 Create Database Tables

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `backend/supabase/schema.sql`
5. Paste into the query editor
6. Click **Run**

### 1.2 Get Credentials

In Supabase dashboard:
1. **Settings → API** → Copy:
   - `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

---

## Step 2: Resend Email Setup

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key
3. Copy the key → `RESEND_API_KEY`
4. Add a verified domain or use the default `alerts@flightpricetracker.com`

---

## Step 3: Lemon Squeezy Payment Setup

### 3.1 Create Product

1. Go to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com)
2. **Products** → **Add Product**
   - Name: "Flight Price Tracker Pro"
   - Price: $7.99/month
   - Billing interval: Monthly
3. Note the **Product ID** and **Variant ID**

### 3.2 Create Webhook

1. **Settings → Webhooks** → **Create Webhook**
2. URL: `https://your-backend-domain.fly.dev/api/payment/webhook`
3. Select events: **Order completed**
4. Copy the **Signing Secret** → `LEMON_SQUEEZY_WEBHOOK_SECRET`

### 3.3 Get Store URL

1. **Settings → Stores**
2. Copy your store URL → `LEMON_SQUEEZY_STORE_URL`

---

## Step 4: Local Development Setup

### 4.1 Install Dependencies

```bash
npm install
cd backend && npm install && cd ..
```

### 4.2 Create `.env` File

```bash
cp .env.example .env
```

**Edit `.env` with your credentials:**

```env
VITE_BACKEND_URL=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

RESEND_API_KEY=re_your-key

LEMON_SQUEEZY_API_KEY=your-api-key
LEMON_SQUEEZY_STORE_URL=https://your-store.lemonsqueezy.com
LEMON_SQUEEZY_WEBHOOK_SECRET=your-webhook-secret
LEMON_SQUEEZY_PRODUCT_ID=12345
LEMON_SQUEEZY_VARIANT_ID=67890

PORT=3000
NODE_ENV=development
```

### 4.3 Run Backend

```bash
npm run dev:backend
```

Backend will run on `http://localhost:3000`

### 4.4 Build Extension

```bash
npm run build:extension
```

Or watch mode:

```bash
npm run watch:extension
```

Output: `dist/`

---

## Step 5: Load Extension in Chrome

1. Open **Chrome** → `chrome://extensions/`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select the `dist/` folder from this project
5. Extension appears in your extensions bar

### Test the Extension

1. Go to [Google Flights](https://www.google.com/travel/flights)
2. Search for any flight
3. Look for green **"✈️ Track Price"** button (bottom-right)
4. Click to track the flight
5. Click extension icon → see tracked flights popup

---

## Step 6: Deploy to Fly.io

### 6.1 Install Fly CLI

```bash
# macOS
brew install flyctl

# Windows (via Scoop)
scoop install flyctl

# Or download: https://fly.io/docs/getting-started/installing-flyctl/
```

### 6.2 Create Fly App

```bash
flyctl auth login
flyctl launch --no-deploy
```

Choose:
- **App name**: `flight-price-tracker`
- **Region**: `ams` (Amsterdam) or your preferred region
- **Database**: Skip (using Supabase)

### 6.3 Set Environment Variables

```bash
flyctl secrets set \
  SUPABASE_URL=your-url \
  SUPABASE_ANON_KEY=your-key \
  SUPABASE_SERVICE_KEY=your-service-key \
  RESEND_API_KEY=your-key \
  LEMON_SQUEEZY_API_KEY=your-api-key \
  LEMON_SQUEEZY_STORE_URL=your-store-url \
  LEMON_SQUEEZY_WEBHOOK_SECRET=your-secret \
  LEMON_SQUEEZY_PRODUCT_ID=your-id \
  LEMON_SQUEEZY_VARIANT_ID=your-id \
  NODE_ENV=production
```

### 6.4 Deploy

```bash
flyctl deploy
```

Get your backend URL:

```bash
flyctl info
```

URL will be: `https://flight-price-tracker.fly.dev`

### 6.5 Update Extension Backend URL

1. Edit `src/background.ts`
2. Change `BACKEND_URL`:

```typescript
const BACKEND_URL = 'https://flight-price-tracker.fly.dev'
```

3. Rebuild and reload extension in Chrome

### 6.6 Update Lemon Squeezy Webhook URL

1. Go to Lemon Squeezy **Settings → Webhooks**
2. Edit your webhook URL:

```
https://flight-price-tracker.fly.dev/api/payment/webhook
```

---

## Step 7: Frontend (Optional – For Web Dashboard)

If you want to add a web dashboard later:

1. Create React app in `frontend/`
2. Connect to Supabase Auth
3. Display user's tracked flights & payment status
4. Add upgrade button linking to Lemon Squeezy checkout

---

## Testing Checklist

- [ ] Extension loads in Chrome without errors
- [ ] Green "Track Price" button appears on Google Flights
- [ ] Can click button and track flight (check Chrome storage)
- [ ] Popup shows tracked flights
- [ ] Backend `/api/health` returns `{ status: 'ok' }`
- [ ] Price history chart displays (if > 1 price point)
- [ ] Test email sending with manual API call:

```bash
curl -X POST http://localhost:3000/api/check-prices \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user-id","flightIds":["flight-id"]}'
```

- [ ] Test payment webhook (use Lemon Squeezy test mode)

---

## Monitoring & Logs

### View Fly.io Logs

```bash
flyctl logs
```

### Monitor Background Jobs

The cron job runs **every 60 minutes** (set in `backend/server.js`).

To test manually:

```bash
curl http://localhost:3000/api/health
```

---

## Troubleshooting

### Extension Not Loading?

- Clear cache: `chrome://extensions/` → Refresh
- Check console: Right-click extension → "Inspect popup"
- Rebuild: `npm run build:extension`

### Prices Not Updating?

- Check Fly.io logs: `flyctl logs`
- Verify Supabase connection
- Check Google Flights URL format in tracked flights

### Emails Not Sending?

- Verify Resend API key is valid
- Check Resend dashboard for errors
- Ensure email address is correct in database

### Payment Webhook Issues?

- Verify webhook secret matches in Lemon Squeezy
- Check request signature verification in logs
- Use Lemon Squeezy's webhook test feature

---

## Production Checklist

- [ ] All environment variables set on Fly.io
- [ ] Supabase has Row-Level Security enabled
- [ ] Lemon Squeezy webhook pointing to live backend
- [ ] Extension built and loaded in Chrome
- [ ] Test full flow: Track → Price drop → Email received
- [ ] Monitor Fly.io for errors (first 24 hours)
- [ ] Set up uptime monitoring (UptimeRobot)

---

## File Structure

```
flight-price-tracker/
├── src/
│   ├── content.ts              # Content script (injected button)
│   ├── background.ts           # Service worker (alarms, messaging)
│   ├── popup.tsx               # Popup UI component
│   ├── popup.css               # Popup styling
│   ├── popup.html              # Popup HTML
│   └── utils/
│       └── storage.ts          # Chrome storage utilities
├── backend/
│   ├── server.js               # Express server
│   ├── package.json
│   ├── utils/
│   │   ├── scraper.js          # Playwright scraping
│   │   ├── email.js            # Resend integration
│   │   ├── database.js         # Supabase queries
│   │   └── payments.js         # Lemon Squeezy integration
│   └── supabase/
│       └── schema.sql          # Database schema
├── manifest.json               # Extension manifest (v3)
├── vite.config.ts             # Vite config
├── package.json
├── fly.toml                   # Fly.io config
├── Dockerfile                 # Container image
├── .env.example              # Environment template
└── SETUP.md                  # This file
```

---

## Support & Next Steps

### MVP Features Complete ✅
- ✅ Extension on Google Flights
- ✅ Track price + extract data
- ✅ Popup with flight list & history
- ✅ Auto price checks every 6 hours
- ✅ Email alerts on price drop ≥5%
- ✅ Free tier (2 flights) + Pro ($7.99/mo)
- ✅ Deployed to Fly.io

### Future Enhancements (v2+)
- Add more flight sites (Kayak, Expedia, Skyscanner)
- Web dashboard + user account
- Price prediction using ML
- Telegram/Slack notifications
- Affiliate links to booking sites
- Advanced filtering & alerts

---

## Questions?

Check logs: `flyctl logs`
Debug extension: Chrome DevTools in extension popup
Test API: Use Postman or curl commands

Good luck! 🚀
