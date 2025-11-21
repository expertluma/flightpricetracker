import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export const LEMON_SQUEEZY_API = 'https://api.lemonsqueezy.com/v1'
export const LEMON_SQUEEZY_PRODUCT_ID = process.env.LEMON_SQUEEZY_PRODUCT_ID
export const LEMON_SQUEEZY_VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID

export function generateCheckoutUrl(email) {
  const params = new URLSearchParams({
    checkout_data: JSON.stringify({
      email,
      custom: { email },
    }),
  })

  return `${process.env.LEMON_SQUEEZY_STORE_URL}/checkout?${params.toString()}`
}

export async function verifyLemonSqueezyWebhook(body, signature) {
  const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET)
  hmac.update(body)
  const computedSignature = hmac.digest('hex')

  return computedSignature === signature
}

export async function handleLemonSqueezyWebhook(event) {
  const { type, data } = event

  if (type === 'order:finished') {
    const { attributes } = data
    const email = attributes.customer_email || attributes.metadata?.email

    if (!email) {
      console.error('No email in webhook payload')
      return
    }

    const { error } = await supabase
      .from('users')
      .update({
        is_pro: true,
        lemon_customer_id: attributes.customer_id,
      })
      .eq('email', email)

    if (error) {
      console.error('Error updating user to pro:', error)
      throw error
    }

    console.log(`User ${email} upgraded to Pro`)
  }
}

export async function getUserCheckoutUrl(email) {
  const user = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (user.error) {
    throw new Error('User not found')
  }

  if (user.data.is_pro) {
    throw new Error('User is already Pro')
  }

  return generateCheckoutUrl(email)
}
