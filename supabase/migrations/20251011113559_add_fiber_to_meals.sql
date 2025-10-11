/*
  # Add fiber column to meals table

  1. Changes
    - Add fiber column to meals table to track dietary fiber intake
    - Set default value to 0 for existing and new records
  
  2. Purpose
    - Enable users to track fiber content in their meals
    - Provide comprehensive nutritional tracking alongside protein, carbs, and fats
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meals' AND column_name = 'fiber'
  ) THEN
    ALTER TABLE meals ADD COLUMN fiber integer DEFAULT 0;
  END IF;
END $$;
