-- Add category field to tickets table
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';