import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'INR', receipt = `receipt_${Date.now()}` } = await req.json()
    
    // Attempt to get keys, mapping VITE_RAZORPAY_KEY as a fallback if they only use one ID key name
    const keyId = Deno.env.get('RAZORPAY_KEY_ID') || Deno.env.get('VITE_RAZORPAY_KEY');
    const keySecret = Deno.env.get('RAZORPAY_SECRET');

    if (!keyId || !keySecret) {
      throw new Error('Razorpay keys (RAZORPAY_KEY_ID or VITE_RAZORPAY_KEY, and RAZORPAY_SECRET) are not configured in Supabase secrets')
    }

    // Basic Auth for Razorpay requires base64 encoded KeyId:Secret
    const auth = btoa(`${keyId}:${keySecret}`);

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects amounts in the smallest currency unit (paise)
        currency,
        receipt,
      })
    })
    
    const data = await response.json()
    if (!response.ok) {
       console.error("Razorpay API Error:", data);
       throw new Error(data.error?.description || 'Failed to create order with Razorpay')
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
