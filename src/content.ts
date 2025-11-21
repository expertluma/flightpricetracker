interface FlightData {
  origin: string;
  originCity: string;
  destination: string;
  destCity: string;
  departDate: string;
  returnDate: string | null;
  adults: number;
  cabin: string;
  stops: string;
  price: number;
  url: string;
}

function extractFlightData(): FlightData | null {
  const url = window.location.href;
  
  const urlParams = new URLSearchParams(window.location.search);
  const flt = urlParams.get('flt') || '';
  
  const priceText = document.querySelector('[aria-label*="price"], [aria-label*="from"], .gws-flights-results__price')?.textContent || '';
  const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
  
  const parseFlightParams = (flt: string) => {
    const parts = flt.split('|');
    return {
      origin: parts[0]?.split(',')[0] || '',
      destination: parts[0]?.split(',')[1] || '',
      departDate: parts[1] || '',
      returnDate: parts[2] || null,
      adults: parseInt(parts[3] || '1'),
      cabin: parts[4] || 'ECONOMY',
      stops: parts[5] || 'any',
    };
  };

  if (!flt) return null;

  const params = parseFlightParams(flt);

  return {
    origin: params.origin,
    originCity: params.origin,
    destination: params.destination,
    destCity: params.destination,
    departDate: params.departDate,
    returnDate: params.returnDate,
    adults: params.adults,
    cabin: params.cabin,
    stops: params.stops,
    price: price,
    url: url,
  };
}

function injectTrackButton() {
  if (document.getElementById('fpt-track-button')) return;

  const button = document.createElement('button');
  button.id = 'fpt-track-button';
  button.textContent = '✈️ Track Price';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 24px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    transition: all 0.3s ease;
  `;

  button.onmouseover = () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
  };
  button.onmouseout = () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
  };

  button.onclick = () => {
    const data = extractFlightData();
    if (data) {
      chrome.runtime.sendMessage({ type: 'TRACK_FLIGHT', data }, (response) => {
        if (response.success) {
          button.textContent = '✓ Tracked!';
          button.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
          setTimeout(() => {
            button.textContent = '✈️ Track Price';
            button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          }, 2000);
        }
      });
    } else {
      alert('Could not extract flight information. Make sure you are on a Google Flights results page.');
    }
  };

  document.body.appendChild(button);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectTrackButton);
} else {
  injectTrackButton();
}

const observer = new MutationObserver(() => {
  if (!document.getElementById('fpt-track-button')) {
    injectTrackButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
