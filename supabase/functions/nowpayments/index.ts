import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NOWPAYMENTS_API_KEY = Deno.env.get('NOWPAYMENTS_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Verify user token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle different endpoints
    if (path === 'currencies' && req.method === 'GET') {
      // Get available currencies
      const response = await fetch('https://api.nowpayments.io/v1/currencies', {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY!,
        },
      });
      
      const data = await response.json();
      
      // Filter to only supported currencies
      const supportedCurrencies = ['btc', 'eth', 'usdttrc20', 'usdterc20', 'usdtbsc', 'usdc'];
      const filteredCurrencies = data.currencies?.filter((c: string) => 
        supportedCurrencies.includes(c.toLowerCase())
      ) || supportedCurrencies;

      return new Response(JSON.stringify({ currencies: filteredCurrencies }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === 'create-payment' && req.method === 'POST') {
      const { amount_eur, pay_currency, payment_type } = await req.json();
      
      // Validate input
      if (!amount_eur || amount_eur < 10 || amount_eur > 10000) {
        return new Response(JSON.stringify({ error: 'Betrag muss zwischen 10€ und 10.000€ liegen' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (!pay_currency) {
        return new Response(JSON.stringify({ error: 'Währung erforderlich' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Creating payment: ${amount_eur} EUR in ${pay_currency} for user ${user.id}`);

      // Check minimum amount for selected currency
      const minAmountResponse = await fetch(
        `https://api.nowpayments.io/v1/min-amount?currency_from=eur&currency_to=${pay_currency.toLowerCase()}&fiat_equivalent=eur`,
        {
          headers: { 'x-api-key': NOWPAYMENTS_API_KEY! },
        }
      );
      
      const minAmountData = await minAmountResponse.json();
      console.log('Minimum amount data:', JSON.stringify(minAmountData));
      
      if (minAmountData.fiat_equivalent && amount_eur < minAmountData.fiat_equivalent) {
        const minEur = Math.ceil(minAmountData.fiat_equivalent);
        return new Response(JSON.stringify({ 
          error: `Mindestbetrag für ${pay_currency.toUpperCase()} ist ${minEur}€` 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Create payment with NOWPayments
      const paymentResponse = await fetch('https://api.nowpayments.io/v1/payment', {
        method: 'POST',
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_amount: amount_eur,
          price_currency: 'eur',
          pay_currency: pay_currency.toLowerCase(),
          order_id: `${user.id}_${Date.now()}`,
          order_description: `Guthaben-Einzahlung ${amount_eur} EUR`,
          ipn_callback_url: `${SUPABASE_URL}/functions/v1/nowpayments-webhook`,
        }),
      });

      const paymentData = await paymentResponse.json();
      
      console.log('NOWPayments response:', JSON.stringify(paymentData));

      if (!paymentResponse.ok || paymentData.error) {
        console.error('NOWPayments error:', paymentData);
        // Better error message for minimum amount errors
        if (paymentData.code === 'AMOUNT_MINIMAL_ERROR') {
          return new Response(JSON.stringify({ 
            error: `Betrag zu niedrig für ${pay_currency.toUpperCase()}. Bitte wähle einen höheren Betrag oder eine andere Währung.` 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ error: paymentData.message || 'Zahlung konnte nicht erstellt werden' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Calculate fee (2% for deposits, 0% for rentals)
      const isRental = payment_type === 'rental';
      const feeAmount = isRental ? 0 : amount_eur * 0.02;
      const netAmount = amount_eur - feeAmount;

      // Create transaction record
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: isRental ? 'rental' : 'deposit',
          amount: netAmount,
          gross_amount: amount_eur,
          fee_amount: feeAmount,
          currency: 'EUR',
          status: 'pending',
          coin_type: pay_currency.toUpperCase(),
          network: paymentData.network || pay_currency,
          nowpayments_id: paymentData.payment_id?.toString(),
          pay_address: paymentData.pay_address,
          pay_amount: paymentData.pay_amount,
          pay_currency: paymentData.pay_currency,
          payment_status: paymentData.payment_status || 'waiting',
          expires_at: paymentData.expiration_estimate_date || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          description: isRental 
            ? `Agency Account Miete ${amount_eur} EUR via ${pay_currency.toUpperCase()}`
            : `Einzahlung ${amount_eur} EUR via ${pay_currency.toUpperCase()}`,
        })
        .select()
        .single();

      if (txError) {
        console.error('Transaction insert error:', txError);
        return new Response(JSON.stringify({ error: 'Transaktion konnte nicht erstellt werden' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({
        transaction_id: transaction.id,
        payment_id: paymentData.payment_id,
        pay_address: paymentData.pay_address,
        pay_amount: paymentData.pay_amount,
        pay_currency: paymentData.pay_currency,
        payment_status: paymentData.payment_status,
        expires_at: paymentData.expiration_estimate_date,
        amount_eur: amount_eur,
        net_amount: netAmount,
        fee_amount: feeAmount,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === 'payment-status' && req.method === 'POST') {
      const { payment_id } = await req.json();
      
      if (!payment_id) {
        return new Response(JSON.stringify({ error: 'Payment ID erforderlich' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get status from NOWPayments
      const statusResponse = await fetch(`https://api.nowpayments.io/v1/payment/${payment_id}`, {
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY!,
        },
      });

      const statusData = await statusResponse.json();
      
      console.log('Payment status:', JSON.stringify(statusData));

      // Update transaction in database if status changed
      if (statusData.payment_status) {
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            payment_status: statusData.payment_status,
            confirmations: statusData.confirmations || 0,
            tx_hash: statusData.hash || null,
          })
          .eq('nowpayments_id', payment_id.toString())
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Update error:', updateError);
        }

        // If payment is finished, mark as completed
        if (statusData.payment_status === 'finished') {
          await supabase
            .from('transactions')
            .update({ status: 'completed' })
            .eq('nowpayments_id', payment_id.toString())
            .eq('user_id', user.id);
        }
      }

      return new Response(JSON.stringify({
        payment_id: statusData.payment_id,
        payment_status: statusData.payment_status,
        pay_address: statusData.pay_address,
        pay_amount: statusData.pay_amount,
        actually_paid: statusData.actually_paid,
        confirmations: statusData.confirmations,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Endpoint nicht gefunden' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in nowpayments function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
