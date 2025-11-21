import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './options.css'

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000'

function OptionsApp() {
  const [isPro, setIsPro] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const pro = (await chrome.storage.local.get('isPro')).isPro || false
    const userEmail = (await chrome.storage.local.get('userEmail')).userEmail || ''
    setIsPro(pro)
    setEmail(userEmail)
  }

  async function handleUpgradeClick() {
    if (!email) {
      setMessage('Please set your email first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/payment/checkout-url/${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get checkout URL')
      }

      window.open(data.checkoutUrl, '_blank')
      setMessage('Opening payment page...')
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveEmail() {
    if (!email) {
      setMessage('Email cannot be empty')
      return
    }

    await chrome.storage.local.set({ userEmail: email })
    setMessage('Email saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleManageProAccount() {
    window.open(`${BACKEND_URL}/dashboard`, '_blank')
  }

  return (
    <div className="options-container">
      <div className="options-header">
        <h1>✈️ Flight Price Tracker Settings</h1>
      </div>

      <div className="options-content">
        <div className="section">
          <h2>Account Email</h2>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field"
            />
            <button onClick={handleSaveEmail} className="btn-primary">
              Save Email
            </button>
          </div>
        </div>

        <div className="section">
          <h2>Subscription Status</h2>
          <div className="status-card">
            <div className="status-badge" style={{ background: isPro ? '#10b981' : '#9ca3af' }}>
              {isPro ? 'PRO' : 'FREE'}
            </div>
            <div className="status-info">
              <p className="status-title">{isPro ? 'Pro Member' : 'Free Tier'}</p>
              <p className="status-details">
                {isPro 
                  ? 'Unlimited flights • 4-hour price checks'
                  : 'Max 2 tracked flights • 6-hour price checks'}
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Upgrade to Pro</h2>
          <p className="section-description">
            Get unlimited flight tracking and faster price checks (every 4 hours instead of 6)
          </p>
          <div className="pricing-card">
            <div className="price">$7.99/month</div>
            <ul className="features-list">
              <li>✓ Unlimited flights</li>
              <li>✓ 4-hour price checks</li>
              <li>✓ Priority email alerts</li>
              <li>✓ No ads</li>
            </ul>
            <button
              onClick={handleUpgradeClick}
              disabled={loading || isPro}
              className="btn-upgrade"
            >
              {loading ? 'Loading...' : isPro ? 'Already Pro' : 'Upgrade Now'}
            </button>
          </div>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="section">
          <h2>Help</h2>
          <div className="help-section">
            <h3>How to use</h3>
            <ol>
              <li>Go to Google Flights and search for flights</li>
              <li>Click the green "Track Price" button in the bottom-right</li>
              <li>We'll check prices every 6 hours (4 hours for Pro)</li>
              <li>Get email alerts when prices drop ≥5%</li>
            </ol>

            <h3>Need help?</h3>
            <p>
              Email us at{' '}
              <a href="mailto:support@flightpricetracker.com">
                support@flightpricetracker.com
              </a>
            </p>
          </div>
        </div>

        <div className="footer">
          <p>Flight Price Tracker v0.1.0</p>
          <p>
            <a href="#" onClick={() => window.open('https://flightpricetracker.com/privacy')}>
              Privacy Policy
            </a>
            {' • '}
            <a href="#" onClick={() => window.open('https://flightpricetracker.com/terms')}>
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
)
