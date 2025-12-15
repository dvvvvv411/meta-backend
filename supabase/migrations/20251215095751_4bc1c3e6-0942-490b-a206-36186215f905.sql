-- Create api_keys table for storing user API keys
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users can view own api keys
CREATE POLICY "Users can view own api keys"
  ON public.api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create own api keys
CREATE POLICY "Users can create own api keys"
  ON public.api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete own api keys
CREATE POLICY "Users can delete own api keys"
  ON public.api_keys FOR DELETE
  USING (auth.uid() = user_id);