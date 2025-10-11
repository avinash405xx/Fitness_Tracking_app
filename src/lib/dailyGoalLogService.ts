import { supabase } from './supabase';

export interface DailyGoalLog {
  id: string;
  user_id: string;
  goal_id: string;
  date: string;
  current_value: number;
  target_value: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDailyLogInput {
  goal_id: string;
  current_value: number;
  target_value: number;
  date?: string;
  notes?: string;
}

export async function getTodayLog(
  userId: string,
  goalId: string
): Promise<DailyGoalLog | null> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_goal_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .eq('date', today)
    .maybeSingle();

  if (error) {
    console.error('Error fetching today log:', error);
    throw error;
  }

  return data;
}

export async function upsertDailyLog(
  userId: string,
  logData: CreateDailyLogInput
): Promise<DailyGoalLog> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_goal_logs')
    .upsert(
      {
        user_id: userId,
        goal_id: logData.goal_id,
        date: logData.date || today,
        current_value: logData.current_value,
        target_value: logData.target_value,
        notes: logData.notes,
      },
      {
        onConflict: 'user_id,goal_id,date',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting daily log:', error);
    throw error;
  }

  return data;
}

export async function updateTodayLogProgress(
  userId: string,
  goalId: string,
  currentValue: number,
  targetValue: number
): Promise<DailyGoalLog> {
  return upsertDailyLog(userId, {
    goal_id: goalId,
    current_value: currentValue,
    target_value: targetValue,
  });
}

export async function getDailyLogs(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<DailyGoalLog[]> {
  let query = supabase
    .from('daily_goal_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching daily logs:', error);
    throw error;
  }

  return data || [];
}

export async function getDailyLogsByGoal(
  userId: string,
  goalId: string,
  startDate?: string,
  endDate?: string
): Promise<DailyGoalLog[]> {
  let query = supabase
    .from('daily_goal_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching daily logs by goal:', error);
    throw error;
  }

  return data || [];
}

export async function deleteDailyLog(
  userId: string,
  logId: string
): Promise<void> {
  const { error } = await supabase
    .from('daily_goal_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting daily log:', error);
    throw error;
  }
}

export async function getTodayLogsForAllGoals(
  userId: string
): Promise<Map<string, DailyGoalLog>> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_goal_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today);

  if (error) {
    console.error('Error fetching today logs for all goals:', error);
    throw error;
  }

  const logsMap = new Map<string, DailyGoalLog>();
  (data || []).forEach((log) => {
    logsMap.set(log.goal_id, log);
  });

  return logsMap;
}
