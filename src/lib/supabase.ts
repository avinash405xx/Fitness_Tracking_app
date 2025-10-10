import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  category: string;
  current_value: number;
  target_value: number;
  unit: string;
  icon: string;
  color: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  type: 'workout' | 'meal';
  name: string;
  category: string;
  calories: number;
  duration?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  notes?: string;
  logged_at: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  name: string;
  description: string;
  xp_reward: number;
  unlocked_at: string;
}

export interface Milestone {
  id: string;
  user_id: string;
  milestone_type: string;
  name: string;
  description: string;
  current_progress: number;
  target_progress: number;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
