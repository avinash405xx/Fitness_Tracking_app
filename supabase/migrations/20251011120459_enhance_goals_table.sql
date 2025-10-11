/*
  # Enhance Goals Table

  1. Changes
    - Add `description` field for detailed goal information
    - Add `start_date` field to track when goal started
    - Add `target_date` field for goal deadline
    - Add `status` field to replace is_completed with more states
    - Add `priority` field for goal prioritization

  2. Notes
    - Uses IF NOT EXISTS to avoid errors if columns already exist
    - Maintains backward compatibility with existing data
*/

-- Add description column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'description'
  ) THEN
    ALTER TABLE goals ADD COLUMN description text DEFAULT '';
  END IF;
END $$;

-- Add start_date column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'start_date'
  ) THEN
    ALTER TABLE goals ADD COLUMN start_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;

-- Add target_date column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'target_date'
  ) THEN
    ALTER TABLE goals ADD COLUMN target_date date;
  END IF;
END $$;

-- Add status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'status'
  ) THEN
    ALTER TABLE goals ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled'));
    
    -- Migrate existing is_completed to status
    UPDATE goals SET status = 'completed' WHERE is_completed = true;
    UPDATE goals SET status = 'active' WHERE is_completed = false;
  END IF;
END $$;

-- Add priority column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'goals' AND column_name = 'priority'
  ) THEN
    ALTER TABLE goals ADD COLUMN priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_category ON goals(category);
CREATE INDEX IF NOT EXISTS idx_goals_priority ON goals(priority);
