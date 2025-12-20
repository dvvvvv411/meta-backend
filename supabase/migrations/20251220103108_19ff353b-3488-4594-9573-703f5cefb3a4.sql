-- Add branding_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN branding_id uuid REFERENCES public.brandings(id) ON DELETE SET NULL;

-- Update handle_new_user trigger to include branding_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, company_name, branding_id)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'company_name',
    (NEW.raw_user_meta_data->>'branding_id')::uuid
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'werbetreibender');
  
  RETURN NEW;
END;
$$;