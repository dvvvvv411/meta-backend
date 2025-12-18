-- Add default_language column to brandings table
ALTER TABLE public.brandings 
ADD COLUMN default_language TEXT DEFAULT 'de' CHECK (default_language IN ('de', 'en'));