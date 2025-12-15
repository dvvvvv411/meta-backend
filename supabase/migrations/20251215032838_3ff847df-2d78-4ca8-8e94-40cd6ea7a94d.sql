-- Create storage bucket for campaign creatives
INSERT INTO storage.buckets (id, name, public)
VALUES ('campaign-creatives', 'campaign-creatives', true);

-- RLS Policy for uploads - users can upload to their own folder
CREATE POLICY "Users can upload their own creatives"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'campaign-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policy for reading - public access
CREATE POLICY "Anyone can view campaign creatives"
ON storage.objects FOR SELECT
USING (bucket_id = 'campaign-creatives');

-- RLS Policy for updates - users can update their own files
CREATE POLICY "Users can update their own creatives"
ON storage.objects FOR UPDATE
USING (bucket_id = 'campaign-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS Policy for deletes - users can delete their own files
CREATE POLICY "Users can delete their own creatives"
ON storage.objects FOR DELETE
USING (bucket_id = 'campaign-creatives' AND auth.uid()::text = (storage.foldername(name))[1]);