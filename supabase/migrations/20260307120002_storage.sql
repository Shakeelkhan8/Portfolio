-- Supabase Storage buckets and policies

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'media',
    'media',
    TRUE,
    52428800,
    ARRAY[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/webm'
    ]
  ),
  (
    'documents',
    'documents',
    TRUE,
    52428800,
    ARRAY['application/pdf']
  ),
  (
    'branding',
    'branding',
    TRUE,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/x-icon']
  )
ON CONFLICT (id) DO NOTHING;

-- Public read for all buckets
CREATE POLICY storage_public_read_media
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY storage_public_read_documents
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY storage_public_read_branding
  ON storage.objects FOR SELECT
  USING (bucket_id = 'branding');

-- Admin upload/update/delete
CREATE POLICY storage_admin_insert
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin()
    AND bucket_id IN ('media', 'documents', 'branding')
  );

CREATE POLICY storage_admin_update
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (public.is_admin() AND bucket_id IN ('media', 'documents', 'branding'))
  WITH CHECK (public.is_admin() AND bucket_id IN ('media', 'documents', 'branding'));

CREATE POLICY storage_admin_delete
  ON storage.objects FOR DELETE
  TO authenticated
  USING (public.is_admin() AND bucket_id IN ('media', 'documents', 'branding'));
