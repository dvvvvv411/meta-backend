-- Allow anyone to view active brandings (for logo display on auth page)
CREATE POLICY "Anyone can view active brandings" 
ON public.brandings 
FOR SELECT 
USING (is_active = true);