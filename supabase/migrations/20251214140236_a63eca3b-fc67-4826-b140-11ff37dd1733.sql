-- Create campaign_drafts table for saving campaign drafts
CREATE TABLE public.campaign_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  account_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Unbenannter Entwurf',
  
  -- Campaign, AdSet, Ad data as JSON
  campaign_data JSONB NOT NULL DEFAULT '{}',
  adset_data JSONB NOT NULL DEFAULT '{}',
  ad_data JSONB NOT NULL DEFAULT '{}',
  
  -- URL parameters stored separately for easy querying
  buying_type TEXT NOT NULL DEFAULT 'auction',
  objective TEXT NOT NULL DEFAULT 'awareness',
  setup TEXT NOT NULL DEFAULT 'manual',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own drafts
CREATE POLICY "Users can view own drafts"
  ON public.campaign_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON public.campaign_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON public.campaign_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON public.campaign_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_campaign_drafts_updated_at
  BEFORE UPDATE ON public.campaign_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_accounts_updated_at();