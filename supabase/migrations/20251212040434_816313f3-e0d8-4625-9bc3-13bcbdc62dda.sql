-- Neue Spalten hinzufügen
ALTER TABLE public.brandings
ADD COLUMN domain TEXT,
ADD COLUMN email TEXT,
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN updated_by UUID;

-- Default-Werte für bestehende Daten setzen
UPDATE public.brandings SET domain = 'example.com' WHERE domain IS NULL;
UPDATE public.brandings SET email = 'info@example.com' WHERE email IS NULL;

-- NOT NULL Constraints setzen
ALTER TABLE public.brandings ALTER COLUMN domain SET NOT NULL;
ALTER TABLE public.brandings ALTER COLUMN email SET NOT NULL;

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION public.update_brandings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_brandings_modtime
  BEFORE UPDATE ON public.brandings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_brandings_updated_at();

-- Storage Bucket für Branding-Logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding-logos', 'branding-logos', true);

-- RLS Policies für Storage
CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'branding-logos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'branding-logos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'branding-logos' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Logos are publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'branding-logos');