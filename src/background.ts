import { trackFlight, getTrackedFlights, checkPrices } from './utils/storage'

const BACKEND_URL = process.env.VITE_BACKEND_URL || 'http://localhost:3000'
const ALARM_NAME = 'price-check-alarm'

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM_NAME, { periodInMinutes: 6 * 60 })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TRACK_FLIGHT') {
    const { data } = request
    trackFlight(data).then(() => {
      sendResponse({ success: true })
    }).catch((error) => {
      console.error('Error tracking flight:', error)
      sendResponse({ success: false, error: error.message })
    })
    return true
  }
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    schedulePriceCheck()
  }
})

async function schedulePriceCheck() {
  try {
    const flights = await getTrackedFlights()
    if (flights.length === 0) return

    const userId = (await chrome.storage.local.get('userId')).userId
    if (!userId) return

    await fetch(`${BACKEND_URL}/api/check-prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, flightIds: flights.map(f => f.id) }),
    })
  } catch (error) {
    console.error('Price check failed:', error)
  }
}
