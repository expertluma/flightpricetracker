# Services Setup Guide

Complete guide for configuring Supabase, Resend, and Lemon Squeezy with your Flight Price Tracker backend.

## 1. Supabase Database Setup

### Create Supabase Project

1. Go to https://app.supabase.com
2. Click **New Project**
3. Fill in:
   - **Project name**: flightpricetracker
   - **Database password**: Strong password (save it)
   - **Region**: Choose closest to your users
4. Click **Create new project**
5. Wait for initialization (2-5 minutes)

### Deploy Database Schema

1. Go to **SQL Editor** in left sidebar
2. Click **New query**
3. Copy entire contents from `backend/supabase/schema.sql`
4. Paste into SQL editor
5. Click **Run**
6. Verify tables created: `users`, `tracked_flights`, `price_history`

### Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: (starts with `eyJ...`)
   - **service_role secret key**: (very long, keep private)

3. Save to `.env`:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Enable Row-Level Security (RLS)

1. Go to **Authentication** → **Policies**
2. For each table, set up policies (already in schema.sql)
3. Verify RLS is enabled on all tables
4. Test by querying as authenticated vs unauthenticated user

## 2. Resend Email Service Setup

### Create Resend Account

1. Go to https://resend.com
2. Sign up with email
3. Verify email
4. Create API key

### Get Resend API Key

1. Go to **API Keys** section
2. Click **Create API Key**
3. Name it `Flight Price Tracker - Production`
4. Copy the key (starts with `re_`)

5. Save to `.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

### Verify Email Domain (Optional but Recommended)

1. In Resend dashboard, go to **Domains**
2. Add your custom domain (e.g., `alerts@flightpricetracker.com`)
3. Add DNS records as shown
4. Wait for verification (can take 24 hours)

For now, you can use the default `onboarding@resend.dev` domain for testing.

### Test Email Sending

Use this curl command to test:

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "test@example.com",
    "subject": "Test Flight Price Alert",
    "html": "<p>This is a test email</p>"
  }'
```

## 3. Lemon Squeezy Payment Setup

### Create Lemon Squeezy Store

1. Go to https://lemonsqueezy.com
2. Sign up and complete profile
3. Create a new store
4. Name it "Flight Price Tracker"

### Create Product

1. In dashboard, go to **Products**
2. Click **New Product**
3. Fill in:
   - **Name**: Flight Price Tracker - Pro Subscription
   - **Description**: Unlimited flight tracking + 4-hour price checks
   - **Price**: $7.99 USD
   - **Billing interval**: Monthly
4. Enable recurring billing
5. Save and note the Product ID

### Get Lemon Squeezy API Credentials

1. Go to **Settings** → **API**
2. Create an API token
3. Copy your **Store ID** and **API token**

4. Save to `.env`:
   ```
   LEMON_SQUEEZY_API_KEY=your_api_token_here
   LEMON_SQUEEZY_STORE_ID=your_store_id_here
   LEMON_SQUEEZY_PRODUCT_ID=your_product_id_here
   LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
   ```

### Configure Webhook

1. Go to **Settings** → **Webhooks**
2. Click **Add webhook**
3. URL: `https://your-backend-url.com/api/webhooks/lemon-squeezy`
4. Select events:
   - `order.created`
   - `subscription.updated`
5. Copy the **Signing secret**
6. Add to `.env`:
   ```
   LEMON_SQUEEZY_WEBHOOK_SECRET=your_signing_secret
   ```

## 4. Backend Environment Configuration

### Update .env File

Create or update `backend/.env` with all credentials:

```
# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email
RESEND_API_KEY=re_...

# Payments
LEMON_SQUEEZY_API_KEY=...
LEMON_SQUEEZY_STORE_ID=...
LEMON_SQUEEZY_PRODUCT_ID=...
LEMON_SQUEEZY_WEBHOOK_SECRET=...

# Server
PORT=3000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Test Backend Connection

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Start backend:
   ```bash
   node server.js
   ```

3. Test health endpoint:
   ```bash
   curl http://localhost:3000/api/health
   ```

4. Response should be:
   ```json
   {"status": "ok"}
   ```

## 5. Integration Testing

### Test Database Connection

```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Test Email Sending

After user signup, the system should send welcome email via Resend.

### Test Payment Checkout URL

```bash
curl http://localhost:3000/api/payment/checkout-url/test@example.com
```

Response should include Lemon Squeezy checkout URL.

## 6. Deployment to Production

### Deploy to Fly.io

1. Install Fly CLI: https://fly.io/docs/hands-on/install-flyctl/

2. Set secrets:
   ```bash
   flyctl secrets set \
     SUPABASE_URL=... \
     SUPABASE_ANON_KEY=... \
     SUPABASE_SERVICE_ROLE_KEY=... \
     RESEND_API_KEY=... \
     LEMON_SQUEEZY_API_KEY=... \
     LEMON_SQUEEZY_STORE_ID=... \
     LEMON_SQUEEZY_PRODUCT_ID=... \
     LEMON_SQUEEZY_WEBHOOK_SECRET=...
   ```

3. Deploy:
   ```bash
   flyctl deploy
   ```

### Update Extension Configuration

1. Edit `.env`:
   ```
   VITE_BACKEND_URL=https://your-fly-app.fly.dev
   ```

2. Rebuild extension:
   ```bash
   npm run build:extension
   ```

3. Reload in Chrome

### Update Webhook URL

In Lemon Squeezy webhook settings, update to:
```
https://your-fly-app.fly.dev/api/webhooks/lemon-squeezy
```

## 7. Monitoring & Logs

### Supabase

- Monitor queries in **Database** → **Query Performance**
- Check RLS policy enforcements in logs
- Set up alerts for high query counts

### Resend

- Monitor email deliverability in **Emails** section
- Check bounce rates
- Review failed sends

### Lemon Squeezy

- Monitor transactions in **Orders**
- Track subscription status in **Subscriptions**
- Review webhook deliveries in **Webhooks** → **History**

### Fly.io

View logs:
```bash
flyctl logs
```

## Checklist

- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Supabase credentials in `.env`
- [ ] Resend account created
- [ ] Resend API key in `.env`
- [ ] Lemon Squeezy store created
- [ ] Lemon Squeezy product created
- [ ] Lemon Squeezy credentials in `.env`
- [ ] Webhook configured in Lemon Squeezy
- [ ] Backend `.env` configured with all secrets
- [ ] Local backend tested successfully
- [ ] Backend deployed to Fly.io
- [ ] Extension configured with production backend URL
- [ ] Extension rebuilt and tested on Chrome
- [ ] Full end-to-end flow tested (track flight → email → payment)
