import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-nowpayments-sig',
};

const NOWPAYMENTS_IPN_SECRET = Deno.env.get('NOWPAYMENTS_IPN_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, unknown>, key: string) => {
      result[key] = obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])
        ? sortObject(obj[key] as Record<string, unknown>)
        : obj[key];
      return result;
    }, {});
}

function verifySignature(payload: Record<string, unknown>, signature: string): boolean {
  if (!NOWPAYMENTS_IPN_SECRET) {
    console.error('IPN secret not configured');
    return false;
  }

  const sortedPayload = sortObject(payload);
  const payloadString = JSON.stringify(sortedPayload);
  
  const hmac = createHmac('sha512', NOWPAYMENTS_IPN_SECRET);
  hmac.update(payloadString);
  const calculatedSignature = hmac.digest('hex');
  
  return calculatedSignature === signature;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-nowpayments-sig');
    const payload = await req.json();
    
    console.log('Webhook received:', JSON.stringify(payload));
    console.log('Signature:', signature);

    // Verify signature in production
    if (signature && !verifySignature(payload, signature)) {
      console.error('Invalid signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const {
      payment_id,
      payment_status,
      pay_address,
      pay_amount,
      actually_paid,
      price_amount,
      price_currency,
      order_id,
      outcome_amount,
      outcome_currency,
    } = payload;

    console.log(`Processing payment ${payment_id} with status: ${payment_status}`);

    // Find transaction by nowpayments_id
    const { data: transaction, error: findError } = await supabase
      .from('transactions')
      .select('*')
      .eq('nowpayments_id', payment_id.toString())
      .single();

    if (findError || !transaction) {
      console.error('Transaction not found:', payment_id, findError);
      return new Response(JSON.stringify({ error: 'Transaction not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update transaction status
    const updateData: Record<string, unknown> = {
      payment_status: payment_status,
      updated_at: new Date().toISOString(),
    };

    // Map NOWPayments status to our status
    if (payment_status === 'finished' || payment_status === 'confirmed') {
      updateData.status = 'completed';
      updateData.tx_hash = payload.hash || null;
      
      // Credit user balance
      const { data: account, error: accountError } = await supabase
        .from('accounts')
        .select('balance_eur')
        .eq('user_id', transaction.user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (account) {
        const newBalance = (account.balance_eur || 0) + transaction.amount;
        await supabase
          .from('accounts')
          .update({ balance_eur: newBalance })
          .eq('user_id', transaction.user_id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        console.log(`Credited ${transaction.amount} EUR to user ${transaction.user_id}`);
      }
    } else if (payment_status === 'failed' || payment_status === 'expired' || payment_status === 'refunded') {
      updateData.status = 'failed';
    } else if (payment_status === 'waiting' || payment_status === 'confirming' || payment_status === 'sending') {
      updateData.status = 'pending';
    }

    const { error: updateError } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(JSON.stringify({ error: 'Update failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Transaction ${transaction.id} updated to status: ${payment_status}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
