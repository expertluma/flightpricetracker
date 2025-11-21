# Testing Guide – Flight Price Tracker

Complete testing checklist for local development and pre-deployment verification.

---

## Phase 1: Setup & Prerequisites

### 1.1 Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
```

### 1.2 Create .env File
```bash
cp .env.example .env
```

**Fill in .env with test values:**
```env
VITE_BACKEND_URL=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-key-here

RESEND_API_KEY=re_test_your-key-here

LEMON_SQUEEZY_API_KEY=test-key
LEMON_SQUEEZY_STORE_URL=https://test-store.lemonsqueezy.com
LEMON_SQUEEZY_WEBHOOK_SECRET=test-secret-123
LEMON_SQUEEZY_PRODUCT_ID=12345
LEMON_SQUEEZY_VARIANT_ID=67890

PORT=3000
NODE_ENV=development
```

### 1.3 Verify Supabase Connection
```bash
# Test in Node.js
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
console.log('Supabase connected:', supabase.auth ? '✓' : '✗');
"
```

---

## Phase 2: Backend Testing

### 2.1 Start Backend
```bash
npm run dev:backend
```

Expected output:
```
Server running on port 3000
```

### 2.2 Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok"}
```

### 2.3 Test Auth Endpoints

**Create a test user:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!@#"
  }'
```

Expected response:
```json
{"success":true,"user":{"id":"uuid-here","email":"test@example.com",...}}
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Test123!@#"
  }'
```

Expected response:
```json
{"success":true,"session":{"access_token":"...","user":{...}}}
```

### 2.4 Test Flight Tracking

**Add a tracked flight:**
```bash
curl -X POST http://localhost:3000/api/track-flight \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"YOUR-USER-ID-FROM-SIGNUP",
    "flightData":{
      "origin":"JFK",
      "destination":"LAX",
      "departDate":"2025-12-20",
      "returnDate":"2025-12-27",
      "adults":2,
      "cabin":"ECONOMY",
      "stops":"any",
      "price":450,
      "url":"https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI1LTEyLTIwKgsKCUpGSwoDTEFYEgoyMDI1LTEyLTI3cAGCAkoB"
    }
  }'
```

**Get user's flights:**
```bash
curl http://localhost:3000/api/flights/YOUR-USER-ID
```

### 2.5 Test Logs

Check backend console for:
- ✅ No errors during startup
- ✅ "Server running on port 3000"
- ✅ No TypeScript compilation errors

---

## Phase 3: Extension Testing

### 3.1 Build Extension
```bash
npm run build:extension
```

Expected output:
```
Built dist/ folder
```

Check output:
```bash
ls -la dist/
# Should show: manifest.json, popup.html, popup.js, content.js, background.js
```

### 3.2 Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select `d:\MYSYSTEMS\Flight Price Tracker\dist` folder
5. Extension appears in your extensions list

### 3.3 Verify Extension Loaded

**Check console:**
- Right-click extension icon → **Inspect popup**
- Open **Console** tab
- Should be clean (no red errors)

### 3.4 Test Content Script on Google Flights

1. Go to [Google Flights](https://www.google.com/travel/flights)
2. Search for any flight (e.g., NYC → LAX, Dec 20 - 27, 2 adults)
3. **Look for green "✈️ Track Price" button** in bottom-right corner
4. Verify button has:
   - ✅ Green background (gradient)
   - ✅ White text
   - ✅ Fixed position (stays visible when scrolling)
   - ✅ Hover effect (darker on mouseover)

### 3.5 Test Track Button Click

1. Click green "Track Price" button
2. Button should change to "✓ Tracked!" (blue) for 2 seconds
3. Then revert to green

**Check Chrome DevTools:**
```bash
Right-click → Inspect → Console
# Should show message confirming flight data extracted
```

### 3.6 Test Popup

1. Click extension icon
2. See Flight Price Tracker popup
3. Verify:
   - ✅ Header with logo
   - ✅ "No flights tracked yet" message (if first time)
   - ✅ Settings button (⚙️) in top-right
   - ✅ Popup width ~500px, height adjusts to content

---

## Phase 4: Chrome Storage Testing

### 4.1 Check Stored Data

In Chrome DevTools console (extension popup):
```javascript
chrome.storage.local.get(null, (data) => {
  console.log(JSON.stringify(data, null, 2));
});
```

Expected output:
```json
{
  "trackedFlights": [
    {
      "id": "flight_1234567890_abc123def",
      "origin": "JFK",
      "destination": "LAX",
      "departDate": "2025-12-20",
      "returnDate": "2025-12-27",
      "adults": 2,
      "cabin": "ECONOMY",
      "stops": "any",
      "currentPrice": 450,
      "lowestPrice": 450,
      "url": "https://...",
      "createdAt": 1700000000000
    }
  ],
  "priceHistory": [
    {
      "id": "history_1700000000000",
      "flightId": "flight_1234567890_abc123def",
      "price": 450,
      "date": 1700000000000
    }
  ],
  "isPro": false,
  "userEmail": ""
}
```

### 4.2 Update Tracked Flight (Simulate Price Change)

In Chrome DevTools console:
```javascript
chrome.storage.local.get('trackedFlights', (data) => {
  const flights = data.trackedFlights;
  flights[0].currentPrice = 420; // Simulate price drop
  flights[0].lowestPrice = 420;
  chrome.storage.local.set({ trackedFlights: flights }, () => {
    console.log('Flight price updated to $420');
  });
});
```

Then refresh popup → should see price changed and "down" indicator

### 4.3 View Popup with Tracked Flight

Refresh popup → should show:
- ✅ Flight card with route (JFK → LAX)
- ✅ Departure date
- ✅ Current price ($420)
- ✅ Price change (down indicator)

Click flight card → should show:
- ✅ Full flight details
- ✅ Current/Lowest/Savings prices
- ✅ "Book Now" button
- ✅ Remove button (×)

---

## Phase 5: Settings Page Testing

### 5.1 Open Settings

1. Click extension icon
2. Click settings button (⚙️)
3. Opens `options.html` in new tab

Verify:
- ✅ Header with gradient background
- ✅ Account email input field
- ✅ Subscription status (FREE or PRO)
- ✅ Upgrade button ($7.99/mo)
- ✅ Help section

### 5.2 Save Email

1. Enter email: `test@example.com`
2. Click "Save Email" button
3. Green message appears: "Email saved!"
4. Close and reopen settings → email still there

Check storage:
```javascript
chrome.storage.local.get('userEmail', console.log);
// {userEmail: 'test@example.com'}
```

### 5.3 Test Pro Status

Manually set Pro in DevTools:
```javascript
chrome.storage.local.set({ isPro: true }, () => {
  console.log('User set as Pro');
  location.reload(); // Refresh page
});
```

Settings should show:
- ✅ Badge: "PRO" (green background)
- ✅ "Unlimited flights • 4-hour price checks"
- ✅ Button says "Already Pro"

---

## Phase 6: Price History Chart Testing

### 6.1 Add Multiple Price Points

In Chrome DevTools console:
```javascript
const flightId = 'flight_test_123';
const prices = [450, 440, 435, 430, 425, 420];
const now = Date.now();

const history = prices.map((price, i) => ({
  id: `history_${now}_${i}`,
  flightId: flightId,
  price: price,
  date: now - (prices.length - i) * 3600000 // 1 hour apart
}));

chrome.storage.local.set({ priceHistory: history }, () => {
  console.log('Price history added');
});
```

### 6.2 Verify Chart Displays

In popup:
1. Click on tracked flight
2. Should see **line chart** showing:
   - ✅ Price on Y-axis
   - ✅ Dates on X-axis
   - ✅ Green line connecting points
   - ✅ Trend going down (prices dropping)

---

## Phase 7: Email Testing

### 7.1 Manual Email Test

```bash
curl -X POST http://localhost:3000/api/check-prices \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"test-user-123",
    "flightIds":["test-flight-id"]
  }'
```

**Check Resend Dashboard:**
1. Go to [Resend.com](https://resend.com/emails)
2. Look for email sent to your test address
3. Verify:
   - ✅ Subject: `✈️ Price Drop! JFK→LAX just fell $30`
   - ✅ Beautiful HTML template
   - ✅ Old price, new price, savings visible
   - ✅ "Book Now" button works
   - ✅ Unsubscribe link works

### 7.2 Test Email Template

The email should have:
- ✅ Green gradient header
- ✅ Flight route prominently displayed
- ✅ Price comparison table (3 columns: Old, New, Savings)
- ✅ Percentage discount highlighted
- ✅ Green "Book Now" button
- ✅ Mobile-responsive design
- ✅ Unsubscribe link at bottom

---

## Phase 8: Price Scraping Testing

### 8.1 Test Playwright Scraper

```bash
node -e "
import('./backend/utils/scraper.js').then(async (mod) => {
  const url = 'https://www.google.com/travel/flights/search?tfs=CBwQAhoeEgoyMDI1LTEyLTIwKgsKCUpGSwoDTEFY...';
  const price = await mod.checkFlightPrices(url);
  console.log('Scraped price:', price);
  await mod.closeBrowser();
});
"
```

Expected output:
```
Scraped price: 450
```

Or with error logging if selector not found:
```
Could not find price on page
```

### 8.2 Test with Real Google Flights URL

1. Go to [Google Flights](https://www.google.com/travel/flights)
2. Search for a flight
3. Copy the URL from address bar
4. Run scraper with that URL (see 8.1)
5. Should successfully extract a price

---

## Phase 9: Cron Job Testing

### 9.1 Verify Cron Runs

Backend logs should show:
```
Running price check...
```

Every 60 minutes (or every 1 hour you set in `server.js`)

### 9.2 Force Price Check

In backend code, add a manual endpoint for testing:

Add to `backend/server.js`:
```javascript
app.get('/api/test/trigger-price-check', async (req, res) => {
  schedulePriceCheck()
  res.json({ triggered: true })
})
```

Then run:
```bash
curl http://localhost:3000/api/test/trigger-price-check
```

Check logs for price check activity.

---

## Phase 10: Payment Webhook Testing

### 10.1 Test Webhook Verification

```bash
node -e "
const crypto = require('crypto');
const secret = 'test-secret-123';
const body = JSON.stringify({ type: 'order:finished', data: {} });
const hmac = crypto.createHmac('sha256', secret);
hmac.update(body);
const signature = hmac.digest('hex');
console.log('Valid signature:', signature);
"
```

### 10.2 Send Test Webhook

```bash
curl -X POST http://localhost:3000/api/payment/webhook \
  -H "Content-Type: application/json" \
  -H "x-signature: SIGNATURE_FROM_ABOVE" \
  -d '{
    "type":"order:finished",
    "data":{
      "id":"12345",
      "attributes":{
        "customer_email":"test@example.com",
        "customer_id":"cus_123",
        "status":"paid"
      }
    }
  }'
```

Expected response:
```json
{"success":true}
```

### 10.3 Verify User Upgraded

Check Supabase:
```sql
SELECT id, email, is_pro FROM users WHERE email = 'test@example.com';
```

Should show `is_pro = true`

---

## Phase 11: End-to-End Flow Test

Complete workflow from start to finish:

### Step 1: Track Flight
- [ ] Go to Google Flights
- [ ] Search for flight
- [ ] Click green "Track Price" button
- [ ] Button changes to "✓ Tracked!"

### Step 2: View Popup
- [ ] Click extension icon
- [ ] See flight in tracked flights list
- [ ] Click on flight card
- [ ] See detailed view with "Book Now" button

### Step 3: Simulate Price Drop
- [ ] In DevTools, change flight price to 420 (was 450)
- [ ] Add new price history entry
- [ ] Refresh popup
- [ ] See price changed and "down" indicator

### Step 4: Test Email Alert
- [ ] Call `/api/check-prices` endpoint
- [ ] Check Resend dashboard
- [ ] Verify email arrived
- [ ] Click "Book Now" in email
- [ ] Should open original Google Flights URL

### Step 5: Test Upgrade
- [ ] In settings, click "Upgrade to Pro"
- [ ] Verify checkout URL appears (or navigates to Lemon Squeezy)
- [ ] Simulate payment webhook
- [ ] Check `isPro` updated in storage
- [ ] Settings should show "PRO" badge

---

## Phase 12: Performance Testing

### 12.1 Measure Build Time
```bash
time npm run build:extension
```

Target: < 5 seconds

### 12.2 Measure Popup Load Time
1. Open Chrome DevTools
2. Open popup
3. Check **Performance** tab
4. Measure time from click to popup visible

Target: < 300ms

### 12.3 Measure API Response Time
```bash
curl -w "Time: %{time_total}s\n" http://localhost:3000/api/flights/test-user
```

Target: < 200ms

### 12.4 Measure Scraper Speed
```bash
time node -e "
import('./backend/utils/scraper.js').then(async (mod) => {
  const price = await mod.checkFlightPrices('https://...');
  console.log('Price:', price);
});
"
```

Target: < 5 seconds

---

## Phase 13: Error Handling Tests

### 13.1 Test Invalid Email
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"Test123!@#"}'
```

Should return error: "Invalid email"

### 13.2 Test Duplicate Flight
Manually set same flight twice in storage and try to track again.
Should show: "This flight is already being tracked"

### 13.3 Test Max Flights Limit
Add 3 flights while free tier, try to add 4th.
Should show: "Free tier limited to 2 flights. Upgrade to Pro for unlimited."

### 13.4 Test Missing Credentials
Set `BACKEND_URL` to wrong value.
Should show error: "Connection refused"

### 13.5 Test Invalid Webhook Signature
```bash
curl -X POST http://localhost:3000/api/payment/webhook \
  -H "x-signature: wrong-signature" \
  -d '{...}'
```

Should return: "Invalid signature" (401)

---

## Checklist: Before Deploying

- [ ] All health checks pass (curl http://localhost:3000/api/health)
- [ ] Can create user and login
- [ ] Can track flight and see in popup
- [ ] Green button appears on Google Flights
- [ ] Price chart displays with sample data
- [ ] Email sends successfully via Resend
- [ ] Webhook verification works
- [ ] User marked as Pro after webhook
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No console errors in extension
- [ ] Popup loads in <300ms
- [ ] Settings page works
- [ ] Email templates are formatted correctly
- [ ] All env vars set correctly
- [ ] Database connection works

---

## Quick Test Commands

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Build extension (watch mode)
npm run watch:extension

# Terminal 3: Test health
curl http://localhost:3000/api/health

# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'

# Test email send
curl -X POST http://localhost:3000/api/check-prices \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","flightIds":["test"]}'
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `lsof -i :3000` then kill process |
| Extension won't load | Run `npm run build:extension` again |
| Supabase won't connect | Check URL and key in .env |
| Email not sending | Verify Resend API key is valid |
| Price scraper timeout | Check Google Flights URL format |
| Popup shows blank | Check console for errors |
| Button not appearing | Wait 2s, refresh page, check DevTools |

---

## Success Criteria

✅ All tests pass  
✅ No errors in console  
✅ Extension works as expected  
✅ Backend responds to all endpoints  
✅ Database updates correctly  
✅ Emails deliver successfully  
✅ Performance targets met  

You're ready to deploy! 🚀
