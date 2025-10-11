import { supabase } from './supabase';
import { getStatsByDate, getTodayStats, updateDailyStats } from './mealService';

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export async function getWaterLogsByDate(userId: string, date: string): Promise<WaterLog[]> {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', date)
    .lt('logged_at', nextDayStr)
    .order('logged_at', { ascending: true });

  if (error) {
    console.error('Error fetching water logs:', error);
    throw error;
  }

  return data || [];
}

export async function getTodaysWaterLogs(userId: string): Promise<WaterLog[]> {
  const today = new Date().toISOString().split('T')[0];
  return getWaterLogsByDate(userId, today);
}

export async function addWaterLog(userId: string, amountMl: number, date?: string): Promise<WaterLog> {
  const logDate = date || new Date().toISOString();

  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: userId,
      amount_ml: amountMl,
      logged_at: logDate,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding water log:', error);
    throw error;
  }

  const targetDate = logDate.split('T')[0];
  await updateTotalWaterIntake(userId, targetDate);

  return data;
}

export async function deleteWaterLog(logId: string, userId: string): Promise<void> {
  const log = await supabase
    .from('water_logs')
    .select('logged_at')
    .eq('id', logId)
    .single();

  const { error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting water log:', error);
    throw error;
  }

  if (log.data) {
    const targetDate = log.data.logged_at.split('T')[0];
    await updateTotalWaterIntake(userId, targetDate);
  }
}

export async function getWaterIntakeByDate(userId: string, date: string): Promise<number> {
  const logs = await getWaterLogsByDate(userId, date);
  return logs.reduce((sum, log) => sum + log.amount_ml, 0);
}

export async function getTodayWaterIntake(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  return getWaterIntakeByDate(userId, today);
}

export async function updateTotalWaterIntake(userId: string, date?: string): Promise<void> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const totalWater = await getWaterIntakeByDate(userId, targetDate);

  await updateDailyStats(userId, {
    water_intake_ml: totalWater,
    stat_date: targetDate,
  });
}

export async function getWaterProgressByDate(userId: string, date: string): Promise<{ intake: number; goal: number; percentage: number }> {
  const stats = await getStatsByDate(userId, date);
  const intake = stats.water_intake_ml || 0;
  const goal = stats.water_goal_ml || 2300;
  const percentage = Math.min(Math.round((intake / goal) * 100), 100);

  return { intake, goal, percentage };
}

export async function getWaterProgress(userId: string): Promise<{ intake: number; goal: number; percentage: number }> {
  const today = new Date().toISOString().split('T')[0];
  return getWaterProgressByDate(userId, today);
}
