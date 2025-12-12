-- Neuer Enum für Account-Status
CREATE TYPE public.account_status AS ENUM ('active', 'expired', 'canceled', 'suspended');

-- Accounts-Tabelle erweitern
ALTER TABLE public.accounts
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS expire_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS balance_eur NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_usdt NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_status account_status DEFAULT 'active',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_by UUID;

-- Trigger für updated_at (nutzt bestehende Funktion)
CREATE OR REPLACE FUNCTION public.update_accounts_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_accounts_modtime
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_accounts_updated_at();

-- Transactions-Tabelle erweitern (Account-Verknüpfung)
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS account_id UUID REFERENCES public.accounts(id);

-- Neue Tabelle: account_audit_logs für Audit-Trail
CREATE TABLE public.account_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.account_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS: Nur Admins können Audit-Logs lesen/schreiben
CREATE POLICY "Admins can read audit logs"
ON public.account_audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert audit logs"
ON public.account_audit_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS für Accounts erweitern: User können eigene Accounts sehen
CREATE POLICY "Users can view own accounts"
ON public.accounts FOR SELECT
USING (auth.uid() = user_id);