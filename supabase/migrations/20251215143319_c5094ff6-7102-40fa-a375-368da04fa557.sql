-- Allow admins to UPDATE transactions (for approving/declining withdrawals)
CREATE POLICY "Admins can update transactions" 
ON public.transactions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));