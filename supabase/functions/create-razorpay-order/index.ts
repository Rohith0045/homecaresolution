import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Configure CORS headers to allow requests from the React frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Expected to receive { amount: number, currency?: string }
    const { amount, currency = 'INR' } = await req.json()

    if (!amount) {
      return new Response(
        JSON.stringify({ error: 'Amount is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keyId || !keySecret) {
       throw new Error("Razorpay credentials are not set in the environment variables.")
    }

    // Call Razorpay API to create an order
    // Razorpay expects `amount` in paisa (if INR) so `amount * 100` must be handled
    // Wait, let's assume the frontend sends the amount in rupees, so we multiply by 100 here.
    const amountInPaisa = Math.round(amount * 100)

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Basic Auth using Key ID and Key Secret
        'Authorization': `Basic ${btoa(`${keyId}:${keySecret}`)}`
      },
      body: JSON.stringify({
        amount: amountInPaisa,
        currency,
        receipt: `receipt_${Date.now()}`,
      }),
    })

    const orderData = await razorpayResponse.json()

    if (!razorpayResponse.ok) {
       throw new Error(orderData.error?.description || 'Failed to create Razorpay order')
    }

    return new Response(
      JSON.stringify(orderData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
