-- Add balance_eur column to profiles table for central user balance
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance_eur NUMERIC DEFAULT 0;

-- Add RLS policy for service role to update balance (webhook uses service role)
-- The existing "Users can view own profile" and "Users can update own profile" policies already cover user access