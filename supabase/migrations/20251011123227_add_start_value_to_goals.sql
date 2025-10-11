/*
  # Add start_value to goals table

  1. Changes
    - Add `start_value` column to track the initial value when goal was created
    - This is especially important for Body Weight goals to calculate progress correctly
    - For weight loss/gain goals, we need to know where the user started to calculate accurate progress

  2. Notes
    - Default to current_value for existing goals to maintain backward compatibility
    - Uses IF NOT EXISTS to avoid errors if column already exists
*/

-- Add start_value column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'start_value'
  ) THEN
    ALTER TABLE goals ADD COLUMN start_value numeric;
    
    -- Set start_value to current_value for existing goals
    UPDATE goals SET start_value = current_value WHERE start_value IS NULL;
  END IF;
END $$;
