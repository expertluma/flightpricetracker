import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPriceDropEmail(
  toEmail,
  flight,
  newPrice,
  oldPrice
) {
  const saving = oldPrice - newPrice
  const percentage = ((saving / oldPrice) * 100).toFixed(1)

  const unsubscribeUrl = `${process.env.BACKEND_URL}/api/email/unsubscribe?email=${encodeURIComponent(toEmail)}&flightId=${flight.id}`
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Price Drop Alert</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: white;
      padding: 20px;
      border-radius: 0 0 8px 8px;
    }
    .flight-info {
      background: #f0fdf4;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
      border-left: 4px solid #10b981;
    }
    .route {
      font-size: 20px;
      font-weight: 700;
      color: #059669;
      margin-bottom: 10px;
    }
    .dates {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 5px;
    }
    .price-info {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin: 20px 0;
    }
    .price-box {
      text-align: center;
      padding: 15px;
      background: #f3f4f6;
      border-radius: 6px;
    }
    .price-box .label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 5px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .price-box .value {
      font-size: 24px;
      font-weight: 700;
      color: #10b981;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 12px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .unsubscribe {
      font-size: 11px;
      color: #d1d5db;
      margin-top: 10px;
    }
    .unsubscribe a {
      color: #9ca3af;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ Price Drop Alert!</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">You're saving money!</p>
    </div>
    
    <div class="content">
      <p>Great news! The price for your flight has dropped.</p>
      
      <div class="flight-info">
        <div class="route">${flight.origin} → ${flight.destination}</div>
        <div class="dates">
          Departure: ${new Date(flight.depart_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
          ${flight.return_date ? `<br>Return: ${new Date(flight.return_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}` : ''}
        </div>
      </div>
      
      <div class="price-info">
        <div class="price-box">
          <div class="label">Old Price</div>
          <div class="value">$${oldPrice}</div>
        </div>
        <div class="price-box">
          <div class="label">New Price</div>
          <div class="value">$${newPrice}</div>
        </div>
        <div class="price-box">
          <div class="label">You Save</div>
          <div class="value">$${saving}</div>
        </div>
      </div>
      
      <p style="text-align: center; font-size: 16px; font-weight: 600; color: #059669;">Save ${percentage}% on your flight!</p>
      
      <a href="${flight.search_url}" class="cta-button" style="color: white; text-decoration: none;">
        Book This Flight Now →
      </a>
      
      <p style="font-size: 13px; color: #6b7280; margin-top: 20px;">
        ${flight.adults} adult${flight.adults > 1 ? 's' : ''} • ${flight.cabin} • ${flight.stops}
      </p>
      
      <div class="footer">
        <p>This is an automated alert from Flight Price Tracker</p>
        <div class="unsubscribe">
          <a href="${unsubscribeUrl}">Unsubscribe from this flight</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `

  try {
    const result = await resend.emails.send({
      from: 'alerts@flightpricetracker.com',
      to: toEmail,
      subject: `✈️ Price Drop! ${flight.origin}→${flight.destination} just fell $${saving}`,
      html: htmlContent,
    })

    console.log('Email sent:', result)
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
