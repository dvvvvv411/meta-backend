-- Add new columns to accounts table for checkout flow
ALTER TABLE public.accounts 
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS price_paid NUMERIC DEFAULT 150,
ADD COLUMN IF NOT EXISTS invoice_number TEXT;

-- Allow users to insert their own accounts (for self-checkout)
CREATE POLICY "Users can insert own accounts"
ON public.accounts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update auto_renew for their own accounts
CREATE POLICY "Users can update own account auto_renew"
ON public.accounts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);