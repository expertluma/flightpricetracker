import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { createClient } from '@supabase/supabase-js'
import { checkFlightPrices } from './utils/scraper.js'
import { sendPriceDropEmail } from './utils/email.js'
import { 
  getTrackedFlights, 
  updateFlightPrice, 
  getUserByEmail,
  createUser,
  addPriceHistory
} from './utils/database.js'
import {
  verifyLemonSqueezyWebhook,
  handleLemonSqueezyWebhook,
  getUserCheckoutUrl,
} from './utils/payments.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
    })

    if (error) throw error

    const user = await createUser(data.user.id, email)
    res.json({ success: true, user })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    res.json({ success: true, session: data.session })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/track-flight', async (req, res) => {
  try {
    const { userId, flightData } = req.body

    const { data, error } = await supabase
      .from('tracked_flights')
      .insert([
        {
          user_id: userId,
          origin: flightData.origin,
          destination: flightData.destination,
          depart_date: flightData.departDate,
          return_date: flightData.returnDate,
          adults: flightData.adults,
          cabin: flightData.cabin,
          stops: flightData.stops,
          search_url: flightData.url,
          current_price: flightData.price,
          lowest_price: flightData.price,
        },
      ])
      .select()

    if (error) throw error

    res.json({ success: true, flight: data[0] })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.get('/api/flights/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const { data, error } = await supabase
      .from('tracked_flights')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    res.json({ flights: data })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/check-prices', async (req, res) => {
  try {
    const { userId, flightIds } = req.body

    const flights = await getTrackedFlights(userId, flightIds)

    for (const flight of flights) {
      const newPrice = await checkFlightPrices(flight.search_url)

      if (newPrice && newPrice !== flight.current_price) {
        await updateFlightPrice(flight.id, newPrice)
        await addPriceHistory(flight.id, newPrice)

        const priceDropPercent = ((flight.current_price - newPrice) / flight.current_price) * 100

        if (priceDropPercent >= 5 || newPrice < flight.lowest_price) {
          const user = await supabase
            .from('users')
            .select('email')
            .eq('id', userId)
            .single()

          if (user.data) {
            await sendPriceDropEmail(
              user.data.email,
              flight,
              newPrice,
              flight.current_price
            )
          }
        }
      }
    }

    res.json({ success: true, checked: flights.length })
  } catch (error) {
    console.error('Price check error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/payment/checkout-url/:email', async (req, res) => {
  try {
    const { email } = req.params
    const checkoutUrl = await getUserCheckoutUrl(email)
    res.json({ checkoutUrl })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-signature']
    const rawBody = req.body

    if (!signature || typeof rawBody !== 'string') {
      return res.status(400).json({ error: 'Invalid webhook' })
    }

    const isValid = await verifyLemonSqueezyWebhook(rawBody, signature)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const event = JSON.parse(rawBody)
    await handleLemonSqueezyWebhook(event)

    res.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(400).json({ error: error.message })
  }
})

cron.schedule('0 * * * *', async () => {
  console.log('Running price check...')
  try {
    const { data: users } = await supabase.from('users').select('id')
    
    for (const user of users) {
      const flights = await getTrackedFlights(user.id)
      if (flights.length > 0) {
        const flightIds = flights.map(f => f.id)
        
        for (const flight of flights) {
          const newPrice = await checkFlightPrices(flight.search_url)
          if (newPrice && newPrice !== flight.current_price) {
            await updateFlightPrice(flight.id, newPrice)
            await addPriceHistory(flight.id, newPrice)

            const priceDropPercent = ((flight.current_price - newPrice) / flight.current_price) * 100

            if (priceDropPercent >= 5 || newPrice < flight.lowest_price) {
              const userData = await supabase
                .from('users')
                .select('email')
                .eq('id', user.id)
                .single()

              if (userData.data) {
                await sendPriceDropEmail(
                  userData.data.email,
                  flight,
                  newPrice,
                  flight.current_price
                )
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Scheduled price check error:', error)
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
