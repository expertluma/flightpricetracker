export interface TrackedFlight {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destCity: string;
  departDate: string;
  returnDate: string | null;
  adults: number;
  cabin: string;
  stops: string;
  currentPrice: number;
  lowestPrice: number;
  url: string;
  createdAt: number;
}

export interface PriceHistory {
  id: string;
  flightId: string;
  price: number;
  date: number;
}

export async function trackFlight(data: any): Promise<void> {
  const flights = await getTrackedFlights()
  
  const isDuplicate = flights.some(
    f => f.origin === data.origin && 
         f.destination === data.destination && 
         f.departDate === data.departDate
  )

  if (isDuplicate) {
    throw new Error('This flight is already being tracked')
  }

  if (flights.length >= 2) {
    const isPro = (await chrome.storage.local.get('isPro')).isPro || false
    if (!isPro) {
      throw new Error('Free tier limited to 2 flights. Upgrade to Pro for unlimited.')
    }
  }

  const flight: TrackedFlight = {
    id: `flight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    origin: data.origin,
    originCity: data.originCity,
    destination: data.destination,
    destCity: data.destCity,
    departDate: data.departDate,
    returnDate: data.returnDate,
    adults: data.adults,
    cabin: data.cabin,
    stops: data.stops,
    currentPrice: data.price,
    lowestPrice: data.price,
    url: data.url,
    createdAt: Date.now(),
  }

  flights.push(flight)
  await chrome.storage.local.set({ trackedFlights: flights })

  const history: PriceHistory = {
    id: `history_${Date.now()}`,
    flightId: flight.id,
    price: data.price,
    date: Date.now(),
  }

  const allHistory = (await chrome.storage.local.get('priceHistory')).priceHistory || []
  allHistory.push(history)
  await chrome.storage.local.set({ priceHistory: allHistory })
}

export async function getTrackedFlights(): Promise<TrackedFlight[]> {
  const data = await chrome.storage.local.get('trackedFlights')
  return data.trackedFlights || []
}

export async function removeFlight(flightId: string): Promise<void> {
  const flights = await getTrackedFlights()
  const filtered = flights.filter(f => f.id !== flightId)
  await chrome.storage.local.set({ trackedFlights: filtered })
}

export async function updateFlightPrice(flightId: string, newPrice: number): Promise<void> {
  const flights = await getTrackedFlights()
  const flight = flights.find(f => f.id === flightId)
  
  if (flight) {
    if (newPrice < flight.lowestPrice) {
      flight.lowestPrice = newPrice
    }
    flight.currentPrice = newPrice

    await chrome.storage.local.set({ trackedFlights: flights })

    const history: PriceHistory = {
      id: `history_${Date.now()}`,
      flightId: flightId,
      price: newPrice,
      date: Date.now(),
    }

    const allHistory = (await chrome.storage.local.get('priceHistory')).priceHistory || []
    allHistory.push(history)
    await chrome.storage.local.set({ priceHistory: allHistory })
  }
}

export async function getPriceHistory(flightId: string): Promise<PriceHistory[]> {
  const data = await chrome.storage.local.get('priceHistory')
  const allHistory = data.priceHistory || []
  return allHistory.filter((h: PriceHistory) => h.flightId === flightId)
}
