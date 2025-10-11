/*
  # Add unique constraint to daily_stats table

  1. Changes
    - Add unique constraint on (user_id, stat_date) combination
    - This allows upsert operations to work correctly when updating daily statistics
  
  2. Purpose
    - Ensures each user can only have one stats record per day
    - Enables efficient upsert operations for updating calorie tracking
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'daily_stats_user_id_stat_date_key'
  ) THEN
    ALTER TABLE daily_stats 
    ADD CONSTRAINT daily_stats_user_id_stat_date_key 
    UNIQUE (user_id, stat_date);
  END IF;
END $$;
