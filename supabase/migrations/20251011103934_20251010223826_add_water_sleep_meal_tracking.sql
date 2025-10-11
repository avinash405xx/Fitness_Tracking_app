/*
  # Add Water, Sleep, and Meal Tracking Tables

  ## New Tables
  
  ### 1. `water_logs`
  Tracks daily water intake
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `amount_ml` (integer) - Amount in milliliters
  - `logged_at` (timestamptz) - When water was consumed
  - `created_at` (timestamptz)

  ### 2. `sleep_logs`
  Tracks sleep data
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `date` (date) - Sleep date
  - `bedtime` (time) - When went to bed
  - `wake_time` (time) - When woke up
  - `hours` (decimal) - Total hours slept
  - `quality_score` (integer) - Sleep quality 1-100
  - `deep_sleep_percent` (integer) - Percentage of deep sleep
  - `light_sleep_percent` (integer) - Percentage of light sleep
  - `rem_sleep_percent` (integer) - Percentage of REM sleep
  - `created_at` (timestamptz)

  ### 3. `meals`
  Detailed meal tracking
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `meal_type` (text) - breakfast, lunch, dinner, snack
  - `name` (text) - Meal name
  - `calories` (integer) - Total calories
  - `protein` (integer) - Protein in grams
  - `carbs` (integer) - Carbs in grams
  - `fats` (integer) - Fats in grams
  - `meal_date` (date) - Date of meal
  - `created_at` (timestamptz)

  ### 4. `meal_items`
  Individual food items in meals
  - `id` (uuid, primary key)
  - `meal_id` (uuid, references meals)
  - `food_name` (text) - Name of food item
  - `calories` (integer) - Calories per item
  - `image_url` (text, nullable) - Food image
  - `created_at` (timestamptz)

  ### 5. `daily_stats`
  Aggregated daily statistics
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `stat_date` (date) - Date of stats
  - `water_intake_ml` (integer) - Total water consumed
  - `water_goal_ml` (integer) - Daily water goal
  - `calories_consumed` (integer) - Total calories eaten
  - `calories_burned` (integer) - Total calories burned
  - `calories_goal` (integer) - Daily calorie goal
  - `steps` (integer) - Steps taken
  - `steps_goal` (integer) - Daily step goal
  - `weight_kg` (decimal, nullable) - Weight measurement
  - `bpm` (integer, nullable) - Heart rate
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  
  All tables have RLS enabled with user-scoped policies.
*/

-- Create water_logs table
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount_ml integer NOT NULL CHECK (amount_ml > 0),
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create sleep_logs table
CREATE TABLE IF NOT EXISTS sleep_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  bedtime time,
  wake_time time,
  hours decimal(4, 2) NOT NULL CHECK (hours >= 0 AND hours <= 24),
  quality_score integer CHECK (quality_score >= 0 AND quality_score <= 100),
  deep_sleep_percent integer DEFAULT 0 CHECK (deep_sleep_percent >= 0 AND deep_sleep_percent <= 100),
  light_sleep_percent integer DEFAULT 0 CHECK (light_sleep_percent >= 0 AND light_sleep_percent <= 100),
  rem_sleep_percent integer DEFAULT 0 CHECK (rem_sleep_percent >= 0 AND rem_sleep_percent <= 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name text NOT NULL,
  calories integer DEFAULT 0,
  protein integer DEFAULT 0,
  carbs integer DEFAULT 0,
  fats integer DEFAULT 0,
  meal_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create meal_items table
CREATE TABLE IF NOT EXISTS meal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  calories integer DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create daily_stats table
CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stat_date date DEFAULT CURRENT_DATE,
  water_intake_ml integer DEFAULT 0,
  water_goal_ml integer DEFAULT 2300,
  calories_consumed integer DEFAULT 0,
  calories_burned integer DEFAULT 0,
  calories_goal integer DEFAULT 2000,
  steps integer DEFAULT 0,
  steps_goal integer DEFAULT 10000,
  weight_kg decimal(5, 2),
  bpm integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, stat_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_water_logs_user_id ON water_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_water_logs_logged_at ON water_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_date ON sleep_logs(date DESC);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON meals(meal_date DESC);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal_id ON meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_id ON daily_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date DESC);

-- Enable RLS
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Water logs policies
CREATE POLICY "Users can view own water logs"
  ON water_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water logs"
  ON water_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own water logs"
  ON water_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Sleep logs policies
CREATE POLICY "Users can view own sleep logs"
  ON sleep_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep logs"
  ON sleep_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep logs"
  ON sleep_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sleep logs"
  ON sleep_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Meals policies
CREATE POLICY "Users can view own meals"
  ON meals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON meals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON meals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON meals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Meal items policies (access through meal ownership)
CREATE POLICY "Users can view meal items"
  ON meal_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meals
    WHERE meals.id = meal_items.meal_id
    AND meals.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert meal items"
  ON meal_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM meals
    WHERE meals.id = meal_items.meal_id
    AND meals.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete meal items"
  ON meal_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM meals
    WHERE meals.id = meal_items.meal_id
    AND meals.user_id = auth.uid()
  ));

-- Daily stats policies
CREATE POLICY "Users can view own daily stats"
  ON daily_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily stats"
  ON daily_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily stats"
  ON daily_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for daily_stats updated_at
CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON daily_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();