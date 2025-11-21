# Quick Deploy to Production – 1 Hour Setup

Deploy Flight Price Tracker to live production environment in under 1 hour.

---

## Prerequisites (5 minutes)

### Get Accounts
1. **Supabase** (free) → [supabase.com](https://supabase.com)
2. **Resend** (free) → [resend.com](https://resend.com) 
3. **Lemon Squeezy** → [lemonsqueezy.com](https://lemonsqueezy.com)
4. **Fly.io** (free tier) → [fly.io](https://fly.io)

Sign up for all (takes ~10 minutes total)

---

## Step 1: Supabase Setup (10 minutes)

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name: `flight-price-tracker`
3. Region: Choose nearest to you
4. Password: Save securely
5. Wait for project to initialize (~2 min)

### 1.2 Run Database Schema
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy entire contents of `backend/supabase/schema.sql`
4. Paste into editor
5. Click **Run**
6. Wait for success message

### 1.3 Get Credentials
1. Click **Settings** → **API**
2. Copy these:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - Scroll down → `service_role` key → `SUPABASE_SERVICE_KEY`

Save all 3 values in a text file temporarily

---

## Step 2: Resend Setup (2 minutes)

### 2.1 Get API Key
1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Click **Create API Key**
3. Copy it → `RESEND_API_KEY`

That's it! (You can add verified domain later if needed)

---

## Step 3: Lemon Squeezy Setup (10 minutes)

### 3.1 Create Product
1. Go to [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com)
2. **Products** → **Add Product**
3. Fill in:
   - **Product Name:** `Flight Price Tracker Pro`
   - **Description:** `Unlimited flight tracking + 4-hour price checks`
   - **Price:** `7.99`
   - **Billing Interval:** `Monthly`
4. Click **Create Product**
5. Copy **Product ID** and **Variant ID** (in product details)

### 3.2 Get Store URL
1. **Settings** → **Stores**
2. Copy your store URL → `LEMON_SQUEEZY_STORE_URL`

### 3.3 Create Webhook
1. **Settings** → **Webhooks** → **Create Webhook**
2. **Endpoint URL:** `https://YOUR-FLY-APP.fly.dev/api/payment/webhook` (you'll get this URL soon)
3. **Events:** Select `order:finished`
4. Click **Create**
5. Copy **Signing Secret** → `LEMON_SQUEEZY_WEBHOOK_SECRET`

---

## Step 4: Fly.io Setup & Deploy (15 minutes)

### 4.1 Install Fly CLI

**Windows:**
```bash
# Using Scoop
scoop install flyctl

# OR download from https://fly.io/docs/getting-started/installing-flyctl/
```

**macOS:**
```bash
brew install flyctl
```

**Verify installation:**
```bash
flyctl --version
```

### 4.2 Login to Fly
```bash
flyctl auth login
```

Opens browser → sign in with your Fly.io account

### 4.3 Create & Deploy App
```bash
cd d:\MYSYSTEMS\Flight Price Tracker
flyctl launch --no-deploy
```

When prompted:
- **App name:** `flight-price-tracker` (or your choice)
- **Region:** `ams` (Amsterdam) or nearest to you
- **Database:** `n` (skip - using Supabase)
- **Copy config:** `n`

### 4.4 Get Your Fly App URL

```bash
flyctl info
```

Look for **App URL:** `https://flight-price-tracker.fly.dev`

Save this URL - you'll need it twice.

### 4.5 Update Lemon Squeezy Webhook URL

Go back to Lemon Squeezy and update the webhook:
- Change URL to: `https://flight-price-tracker.fly.dev/api/payment/webhook`

### 4.6 Set Environment Variables

```bash
flyctl secrets set \
  SUPABASE_URL="https://your-project.supabase.co" \
  SUPABASE_ANON_KEY="eyJ..." \
  SUPABASE_SERVICE_KEY="eyJ..." \
  RESEND_API_KEY="re_..." \
  LEMON_SQUEEZY_API_KEY="test-key" \
  LEMON_SQUEEZY_STORE_URL="https://your-store.lemonsqueezy.com" \
  LEMON_SQUEEZY_WEBHOOK_SECRET="ws_..." \
  LEMON_SQUEEZY_PRODUCT_ID="12345" \
  LEMON_SQUEEZY_VARIANT_ID="67890" \
  NODE_ENV="production"
```

Replace with actual values from Step 1-3.

### 4.7 Deploy Backend

```bash
flyctl deploy
```

Wait for deployment to complete (~2-3 minutes)

### 4.8 Test Backend is Live

```bash
curl https://flight-price-tracker.fly.dev/api/health
```

Expected response:
```json
{"status":"ok"}
```

✅ **Backend is live!**

---

## Step 5: Build Extension (5 minutes)

### 5.1 Update Backend URL in Extension

Edit `src/background.ts`:

Find this line:
```typescript
const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000'
```

Change to:
```typescript
const BACKEND_URL = 'https://flight-price-tracker.fly.dev'
```

### 5.2 Build Extension

```bash
npm install
npm run build:extension
```

Output: `dist/` folder (ready to load)

---

## Step 6: Load Extension in Chrome (3 minutes)

### 6.1 Load in Chrome
1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select `d:\MYSYSTEMS\Flight Price Tracker\dist` folder
5. ✅ Extension loaded!

### 6.2 Test It Works
1. Go to [Google Flights](https://www.google.com/travel/flights)
2. Search for any flight
3. **See green "✈️ Track Price" button** (bottom-right)
4. Click it → Should say "✓ Tracked!"
5. Click extension icon → See popup with tracked flight

---

## Step 7: Verify Production Setup (5 minutes)

### 7.1 Test Backend Endpoints

**Check health:**
```bash
curl https://flight-price-tracker.fly.dev/api/health
```

**Create test user:**
```bash
curl -X POST https://flight-price-tracker.fly.dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

Should return user object with ID

**Test price check endpoint:**
```bash
curl -X POST https://flight-price-tracker.fly.dev/api/check-prices \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","flightIds":["test"]}'
```

### 7.2 Check Fly.io Logs

```bash
flyctl logs
```

Should show:
```
Server running on port 3000
```

No errors.

### 7.3 Test Extension Tracking

1. Go to Google Flights
2. Track a flight
3. Check browser console (right-click extension → Inspect popup)
4. Should see confirmation message

Check Supabase:
1. Go to Supabase dashboard
2. **Table editor** → `tracked_flights`
3. Should see your tracked flight

---

## Step 8: Test Full Production Flow (5 minutes)

### 8.1 Track a Flight
✅ Go to Google Flights → Click "Track Price" button → See in popup

### 8.2 View in Popup
✅ Click extension → See tracked flight with price

### 8.3 Check Database
✅ Open Supabase → `tracked_flights` table → See flight data

### 8.4 Test Email Alert (Manual)

```bash
curl -X POST https://flight-price-tracker.fly.dev/api/check-prices \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","flightIds":["test-flight"]}'
```

Check [Resend Dashboard](https://resend.com/emails) → Should see email sent

---

## 🎉 You're Live!

**Your app is now live in production:**

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Live | `https://flight-price-tracker.fly.dev` |
| Database | ✅ Live | Supabase cloud |
| Extension | ✅ Loaded | Chrome |
| Email | ✅ Ready | Resend |
| Payments | ✅ Ready | Lemon Squeezy |

---

## Monitoring Production

### View Logs (Real-time)
```bash
flyctl logs
```

### View Metrics
```bash
flyctl metrics
```

### Check App Status
```bash
flyctl status
```

### View Database
Supabase dashboard → Tables → `tracked_flights`, `users`, `price_history`

---

## Next Steps for Continued Development

### Continue Building
Your backend is now running 24/7. You can:
- ✅ Test features in production
- ✅ Monitor real usage
- ✅ Fix bugs immediately
- ✅ Add new features without downtime

### Make Code Changes
1. Edit code locally
2. Rebuild extension: `npm run build:extension`
3. Reload in Chrome
4. For backend changes:
   ```bash
   flyctl deploy
   ```

### Add More Features
1. Update code
2. Test locally with `npm run dev:backend`
3. Deploy to Fly.io when ready

---

## Troubleshooting

### Extension not connecting to backend?
Update `VITE_BACKEND_URL` in `src/background.ts` to production URL

### Email not sending?
Check Resend API key in Fly.io secrets

### Database not updating?
Check Supabase credentials in Fly.io secrets

### Webhook signature error?
Verify `LEMON_SQUEEZY_WEBHOOK_SECRET` matches in both Lemon Squeezy and Fly.io

### Port in use locally?
```bash
# Find what's using port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

---

## Cost Breakdown (Monthly)

| Service | Cost |
|---------|------|
| Supabase (free tier) | $0 |
| Resend (first 3k emails) | $0 |
| Lemon Squeezy (8.5% commission) | Covered by revenue |
| Fly.io (free tier) | $0 |
| **Total** | **$0** |

You're earning from day 1 with zero infrastructure costs!

---

## What's Running 24/7

✅ Backend server (on Fly.io) - responds to API calls  
✅ Cron job - checks prices every 60 minutes  
✅ Database - stores all user data  
✅ Email service - sends alerts on demand  
✅ Payment webhooks - processes upgrades instantly  

All automatic. You're done! 🚀

---

## Summary

**Time to Production: ~45 minutes**

1. ✅ Supabase setup (10 min)
2. ✅ Resend setup (2 min)
3. ✅ Lemon Squeezy setup (10 min)
4. ✅ Fly.io deploy (15 min)
5. ✅ Extension build & load (5 min)
6. ✅ Testing (5 min)

**You're live and ready to build!**

---

## Continue Building on Production

All your testing and development now happens in production:

- Real Supabase database
- Real Resend emails
- Real Fly.io backend
- Real Chrome extension

Make changes, deploy, test, iterate. That's it!

🚀 **Happy shipping!**
