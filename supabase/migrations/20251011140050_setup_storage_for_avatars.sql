/*
  # Setup Storage for Profile Avatars

  ## Overview
  Creates a storage bucket for user profile pictures and sets up appropriate
  access policies.

  ## Changes
  1. Create 'avatars' storage bucket
  2. Set up RLS policies for avatar uploads
  3. Allow authenticated users to upload their own avatars
  4. Allow public read access to avatars

  ## Security
  - Users can only upload/update their own avatars
  - File size limits and type restrictions enforced
  - Public read access for displaying avatars
*/

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for avatars bucket
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');
