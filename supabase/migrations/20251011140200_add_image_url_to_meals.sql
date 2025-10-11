/*
  # Add image_url to meals table

  1. Changes
    - Add `image_url` column to store food images for meal entries
    - This will store URLs to food images fetched from Pexels API

  2. Notes
    - Uses IF NOT EXISTS to avoid errors if column already exists
    - Nullable field as existing meals won't have images
*/

-- Add image_url column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meals' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE meals ADD COLUMN image_url text;
  END IF;
END $$;
