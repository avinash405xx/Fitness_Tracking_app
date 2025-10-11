/*
  # Fitness Tracker Database Schema

  ## Overview
  Creates a comprehensive fitness tracking system with user profiles, goals, activity logs,
  and gamification features (achievements and streaks).

  ## New Tables

  ### 1. `profiles`
  Stores user profile information
  - `id` (uuid, primary key, references auth.users)
  - `name` (text) - User's display name
  - `email` (text) - User's email address
  - `avatar_url` (text, nullable) - Profile picture URL
  - `current_streak` (integer, default 0) - Current consecutive days active
  - `longest_streak` (integer, default 0) - Longest streak achieved
  - `total_xp` (integer, default 0) - Total experience points
  - `level` (integer, default 1) - User's current level
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `goals`
  Tracks user fitness goals
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `name` (text) - Goal name
  - `category` (text) - Goal category (weight_loss, fitness, nutrition, custom)
  - `current_value` (decimal) - Current progress value
  - `target_value` (decimal) - Target to achieve
  - `unit` (text) - Measurement unit (kg, sessions, liters, km, etc.)
  - `icon` (text) - Icon identifier for UI
  - `color` (text) - Color scheme for UI
  - `is_completed` (boolean, default false) - Whether goal is achieved
  - `completed_at` (timestamptz, nullable) - When goal was completed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `activity_logs`
  Records workouts and meals
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `type` (text) - 'workout' or 'meal'
  - `name` (text) - Activity name
  - `category` (text) - Subcategory (cardio, strength, breakfast, lunch, etc.)
  - `calories` (integer) - Calories burned/consumed
  - `duration` (integer, nullable) - Duration in minutes (for workouts)
  - `protein` (integer, nullable) - Protein grams (for meals)
  - `carbs` (integer, nullable) - Carbs grams (for meals)
  - `fats` (integer, nullable) - Fats grams (for meals)
  - `notes` (text, nullable) - Additional notes
  - `logged_at` (timestamptz) - When activity occurred
  - `created_at` (timestamptz)

  ### 4. `achievements`
  Tracks unlocked achievements
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `achievement_type` (text) - Type of achievement
  - `name` (text) - Achievement name
  - `description` (text) - Achievement description
  - `xp_reward` (integer) - XP earned
  - `unlocked_at` (timestamptz)

  ### 5. `milestones`
  Progress toward milestone achievements
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `milestone_type` (text) - Type of milestone
  - `name` (text) - Milestone name
  - `description` (text) - What needs to be done
  - `current_progress` (integer) - Current count
  - `target_progress` (integer) - Target count
  - `is_completed` (boolean, default false)
  - `completed_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security

  Row Level Security (RLS) is enabled on all tables.
  Users can only access their own data.
  
  ## Notes
  
  - All timestamps use timestamptz for timezone awareness
  - Foreign keys ensure data integrity
  - Indexes on user_id for query performance
  - Default values set for gamification metrics
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_xp integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL,
  current_value decimal(10, 2) NOT NULL DEFAULT 0,
  target_value decimal(10, 2) NOT NULL,
  unit text NOT NULL,
  icon text DEFAULT 'target',
  color text DEFAULT 'from-blue-600 to-green-600',
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('workout', 'meal')),
  name text NOT NULL,
  category text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  duration integer,
  protein integer,
  carbs integer,
  fats integer,
  notes text,
  logged_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  xp_reward integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  current_progress integer DEFAULT 0,
  target_progress integer NOT NULL,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_logged_at ON activity_logs(logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_user_id ON milestones(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Goals policies
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Users can view own activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity logs"
  ON activity_logs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity logs"
  ON activity_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Milestones policies
CREATE POLICY "Users can view own milestones"
  ON milestones FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own milestones"
  ON milestones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
  ON milestones FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
