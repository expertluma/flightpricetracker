import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function createUser(supabaseUserId, email) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        supabase_user_id: supabaseUserId,
        email,
        is_pro: false,
      },
    ])
    .select()

  if (error) throw error
  return data[0]
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  return data
}

export async function getTrackedFlights(userId, flightIds = null) {
  let query = supabase
    .from('tracked_flights')
    .select('*')
    .eq('user_id', userId)

  if (flightIds && flightIds.length > 0) {
    query = query.in('id', flightIds)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function updateFlightPrice(flightId, newPrice) {
  const { data: flight } = await supabase
    .from('tracked_flights')
    .select('lowest_price')
    .eq('id', flightId)
    .single()

  const lowestPrice = Math.min(flight.lowest_price, newPrice)

  const { error } = await supabase
    .from('tracked_flights')
    .update({
      current_price: newPrice,
      lowest_price: lowestPrice,
      last_checked: new Date().toISOString(),
    })
    .eq('id', flightId)

  if (error) throw error
}

export async function addPriceHistory(flightId, price) {
  const { error } = await supabase
    .from('price_history')
    .insert([
      {
        flight_id: flightId,
        price,
      },
    ])

  if (error) throw error
}

export async function getPriceHistory(flightId) {
  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('flight_id', flightId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}
