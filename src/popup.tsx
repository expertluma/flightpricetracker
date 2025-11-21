import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { getTrackedFlights, removeFlight, getPriceHistory, TrackedFlight, PriceHistory } from './utils/storage'
import './popup.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function PopupApp() {
  const [flights, setFlights] = useState<TrackedFlight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<TrackedFlight | null>(null)
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlights()
    const interval = setInterval(loadFlights, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedFlight) {
      loadPriceHistory(selectedFlight.id)
    }
  }, [selectedFlight])

  async function loadFlights() {
    const flights = await getTrackedFlights()
    setFlights(flights)
    const pro = (await chrome.storage.local.get('isPro')).isPro || false
    setIsPro(pro)
    setLoading(false)
  }

  async function loadPriceHistory(flightId: string) {
    const history = await getPriceHistory(flightId)
    setHistory(history)
  }

  async function handleRemoveFlight(flightId: string) {
    await removeFlight(flightId)
    await loadFlights()
    setSelectedFlight(null)
  }

  function handleUpgradePro() {
    chrome.runtime.openOptionsPage?.() || window.open('options.html')
  }

  const pricePercentChange = selectedFlight
    ? ((selectedFlight.currentPrice - selectedFlight.lowestPrice) / selectedFlight.lowestPrice) * 100
    : 0

  const chartData = selectedFlight && history.length > 0
    ? {
        labels: history.map(h => new Date(h.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Price',
            data: history.map(h => h.price),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : null

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1>✈️ Flight Tracker</h1>
        <a href="#" className="settings-btn" onClick={() => chrome.runtime.openOptionsPage?.()}>
          ⚙️
        </a>
      </div>

      {flights.length === 0 ? (
        <div className="empty-state">
          <p>No flights tracked yet</p>
          <p className="text-sm">Go to Google Flights and click the green button to track prices</p>
        </div>
      ) : (
        <div className="flights-list">
          {flights.map(flight => (
            <div
              key={flight.id}
              className={`flight-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
              onClick={() => setSelectedFlight(flight)}
            >
              <div className="flight-route">
                <span className="airport">{flight.origin}</span>
                <span className="arrow">→</span>
                <span className="airport">{flight.destination}</span>
              </div>
              <div className="flight-date">{new Date(flight.departDate).toLocaleDateString()}</div>
              <div className="flight-price">
                <span className="current-price">${flight.currentPrice}</span>
                <span className={`price-change ${pricePercentChange > 0 ? 'up' : 'down'}`}>
                  {pricePercentChange > 0 ? '+' : ''}{pricePercentChange.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFlight && (
        <div className="flight-detail">
          <div className="detail-header">
            <h2>
              {selectedFlight.origin} → {selectedFlight.destination}
            </h2>
            <button onClick={() => handleRemoveFlight(selectedFlight.id)} className="btn-remove">
              ✕
            </button>
          </div>

          <div className="detail-info">
            <div className="info-row">
              <span className="label">Departure:</span>
              <span>{new Date(selectedFlight.departDate).toDateString()}</span>
            </div>
            {selectedFlight.returnDate && (
              <div className="info-row">
                <span className="label">Return:</span>
                <span>{new Date(selectedFlight.returnDate).toDateString()}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Passengers:</span>
              <span>{selectedFlight.adults} adult(s)</span>
            </div>
            <div className="info-row">
              <span className="label">Cabin:</span>
              <span>{selectedFlight.cabin}</span>
            </div>
            <div className="info-row">
              <span className="label">Stops:</span>
              <span>{selectedFlight.stops}</span>
            </div>
          </div>

          <div className="price-info">
            <div className="price-stat">
              <span className="label">Current:</span>
              <span className="value">${selectedFlight.currentPrice}</span>
            </div>
            <div className="price-stat">
              <span className="label">Lowest:</span>
              <span className="value">${selectedFlight.lowestPrice}</span>
            </div>
            <div className="price-stat">
              <span className="label">Savings:</span>
              <span className="value">${selectedFlight.currentPrice - selectedFlight.lowestPrice}</span>
            </div>
          </div>

          {chartData && (
            <div className="chart-container">
              <Line data={chartData} options={{ maintainAspectRatio: true }} />
            </div>
          )}

          <a href={selectedFlight.url} target="_blank" rel="noopener noreferrer" className="btn-book">
            Book Now
          </a>
        </div>
      )}

      {flights.length > 2 && !isPro && (
        <div className="upgrade-banner">
          <div className="banner-content">
            <h3>Upgrade to Pro</h3>
            <p>Track unlimited flights + 4-hour price checks</p>
          </div>
          <button onClick={handleUpgradePro} className="btn-upgrade">
            $7.99/mo
          </button>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>
)
