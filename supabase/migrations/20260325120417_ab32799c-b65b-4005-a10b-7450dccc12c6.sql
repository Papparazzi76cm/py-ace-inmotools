-- Add agency fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS agency_logo_url text;

-- Create storage bucket for agency logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-logos', 'agency-logos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for agency logos bucket
CREATE POLICY "Users can upload own logo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'agency-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own logo"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'agency-logos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'agency-logos');