-- Brandings Tabelle
CREATE TABLE public.brandings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true
);

-- Accounts Tabelle
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL DEFAULT 'meta',
    status TEXT NOT NULL DEFAULT 'active',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    branding_id UUID REFERENCES public.brandings(id) ON DELETE SET NULL,
    monthly_budget DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions Tabelle
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    type TEXT NOT NULL DEFAULT 'deposit',
    status TEXT DEFAULT 'completed',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets Tabelle
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Events Tabelle
CREATE TABLE public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS aktivieren
ALTER TABLE public.brandings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

-- Admin Policies für Brandings
CREATE POLICY "Admins can view all brandings" ON public.brandings
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert brandings" ON public.brandings
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brandings" ON public.brandings
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brandings" ON public.brandings
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin Policies für Accounts
CREATE POLICY "Admins can view all accounts" ON public.accounts
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert accounts" ON public.accounts
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update accounts" ON public.accounts
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete accounts" ON public.accounts
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Policies für Transactions (Admin + eigene)
CREATE POLICY "Admins can view all transactions" ON public.transactions
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert transactions" ON public.transactions
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own transactions" ON public.transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies für Tickets (Admin + eigene)
CREATE POLICY "Admins can view all tickets" ON public.tickets
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own tickets" ON public.tickets
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage tickets" ON public.tickets
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create tickets" ON public.tickets
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets" ON public.tickets
FOR UPDATE USING (auth.uid() = user_id);

-- Admin Policies für Activity Events
CREATE POLICY "Admins can view all activity" ON public.activity_events
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert activity" ON public.activity_events
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger für Tickets updated_at
CREATE OR REPLACE FUNCTION public.update_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_timestamp
BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.update_tickets_updated_at();