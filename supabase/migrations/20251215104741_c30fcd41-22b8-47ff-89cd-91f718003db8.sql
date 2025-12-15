-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all campaign drafts
CREATE POLICY "Admins can view all drafts"
ON public.campaign_drafts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));