-- Add NOWPayments columns to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS nowpayments_id TEXT,
ADD COLUMN IF NOT EXISTS pay_address TEXT,
ADD COLUMN IF NOT EXISTS pay_amount NUMERIC,
ADD COLUMN IF NOT EXISTS pay_currency TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'created',
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_nowpayments_id ON public.transactions(nowpayments_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON public.transactions(payment_status);