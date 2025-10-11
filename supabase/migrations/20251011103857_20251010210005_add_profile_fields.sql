/*
  # Add Profile Fields for User Details
  
  ## Overview
  Adds additional fields to the profiles table to support user personal information
  and profile management functionality.
  
  ## Changes
  
  ### Profiles Table Updates
  - Add `age` (integer, nullable) - User's age
  - Add `gender` (text, nullable) - User's gender
  - Add `height` (decimal, nullable) - User's height in cm
  - Add `weight` (decimal, nullable) - User's current weight in kg
  
  ## Notes
  - All new fields are nullable to maintain flexibility
  - Uses IF NOT EXISTS pattern to prevent errors on repeated runs
*/

-- Add age field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE profiles ADD COLUMN age integer;
  END IF;
END $$;

-- Add gender field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE profiles ADD COLUMN gender text;
  END IF;
END $$;

-- Add height field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'height'
  ) THEN
    ALTER TABLE profiles ADD COLUMN height decimal(5,2);
  END IF;
END $$;

-- Add weight field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'weight'
  ) THEN
    ALTER TABLE profiles ADD COLUMN weight decimal(5,2);
  END IF;
END $$;