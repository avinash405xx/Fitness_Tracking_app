import { supabase } from './supabase';
import { getTodayStats, updateDailyStats } from './mealService';

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export async function getTodaysWaterLogs(userId: string): Promise<WaterLog[]> {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', today)
    .lt('logged_at', tomorrow)
    .order('logged_at', { ascending: true });

  if (error) {
    console.error('Error fetching water logs:', error);
    throw error;
  }

  return data || [];
}

export async function addWaterLog(userId: string, amountMl: number): Promise<WaterLog> {
  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: userId,
      amount_ml: amountMl,
      logged_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding water log:', error);
    throw error;
  }

  await updateTotalWaterIntake(userId);

  return data;
}

export async function deleteWaterLog(logId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting water log:', error);
    throw error;
  }

  await updateTotalWaterIntake(userId);
}

export async function getTodayWaterIntake(userId: string): Promise<number> {
  const logs = await getTodaysWaterLogs(userId);
  return logs.reduce((sum, log) => sum + log.amount_ml, 0);
}

export async function updateTotalWaterIntake(userId: string): Promise<void> {
  const totalWater = await getTodayWaterIntake(userId);

  await updateDailyStats(userId, {
    water_intake_ml: totalWater,
  });
}

export async function getWaterProgress(userId: string): Promise<{ intake: number; goal: number; percentage: number }> {
  const stats = await getTodayStats(userId);
  const intake = stats.water_intake_ml || 0;
  const goal = stats.water_goal_ml || 2300;
  const percentage = Math.min(Math.round((intake / goal) * 100), 100);

  return { intake, goal, percentage };
}
