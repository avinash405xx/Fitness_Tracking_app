/*
  # Create daily goal logs table

  1. New Tables
    - `daily_goal_logs`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `user_id` (uuid, foreign key) - References auth.users
      - `goal_id` (uuid, foreign key) - References goals table
      - `date` (date) - The date for this log entry
      - `current_value` (numeric) - The value achieved on this day
      - `target_value` (numeric) - The target value for this goal
      - `notes` (text, nullable) - Optional notes about the entry
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `daily_goal_logs` table
    - Add policy for users to read their own logs
    - Add policy for users to insert their own logs
    - Add policy for users to update their own logs
    - Add policy for users to delete their own logs

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on goal_id for faster goal-related queries
    - Add index on date for time-based queries
    - Add unique constraint on (user_id, goal_id, date) to prevent duplicate entries

  4. Notes
    - This table tracks daily progress for fitness and nutrition goals
    - Goals reset daily, and this table maintains historical records
    - Body weight goals do NOT use this table (they use weight_history instead)
*/

-- Create daily_goal_logs table
CREATE TABLE IF NOT EXISTS daily_goal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  current_value numeric NOT NULL DEFAULT 0,
  target_value numeric NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint to prevent duplicate entries for same goal on same date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'daily_goal_logs_user_goal_date_unique'
  ) THEN
    ALTER TABLE daily_goal_logs 
    ADD CONSTRAINT daily_goal_logs_user_goal_date_unique 
    UNIQUE (user_id, goal_id, date);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE daily_goal_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own daily goal logs"
  ON daily_goal_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily goal logs"
  ON daily_goal_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily goal logs"
  ON daily_goal_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily goal logs"
  ON daily_goal_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_goal_logs_user_id ON daily_goal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_goal_logs_goal_id ON daily_goal_logs(goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_goal_logs_date ON daily_goal_logs(date DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_goal_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_daily_goal_logs_updated_at_trigger'
  ) THEN
    CREATE TRIGGER update_daily_goal_logs_updated_at_trigger
    BEFORE UPDATE ON daily_goal_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_goal_logs_updated_at();
  END IF;
END $$;
