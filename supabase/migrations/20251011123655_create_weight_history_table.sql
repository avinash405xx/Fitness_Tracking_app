/*
  # Create weight history tracking table

  1. New Tables
    - `weight_history`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `user_id` (uuid, foreign key) - References auth.users
      - `goal_id` (uuid, foreign key, nullable) - References goals table, null if not associated with a goal
      - `weight` (numeric) - The recorded weight value
      - `unit` (text) - Unit of measurement (e.g., "Kgs")
      - `notes` (text, nullable) - Optional notes about the entry
      - `recorded_at` (timestamptz) - When the weight was recorded
      - `created_at` (timestamptz) - When the record was created in the database

  2. Security
    - Enable RLS on `weight_history` table
    - Add policy for users to read their own weight history
    - Add policy for users to insert their own weight entries
    - Add policy for users to update their own weight entries
    - Add policy for users to delete their own weight entries

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on goal_id for faster goal-related queries
    - Add index on recorded_at for time-based queries
*/

-- Create weight_history table
CREATE TABLE IF NOT EXISTS weight_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id uuid REFERENCES goals(id) ON DELETE SET NULL,
  weight numeric NOT NULL,
  unit text NOT NULL DEFAULT 'Kgs',
  notes text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE weight_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own weight history"
  ON weight_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight history"
  ON weight_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight history"
  ON weight_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight history"
  ON weight_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_weight_history_user_id ON weight_history(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_history_goal_id ON weight_history(goal_id);
CREATE INDEX IF NOT EXISTS idx_weight_history_recorded_at ON weight_history(recorded_at DESC);
