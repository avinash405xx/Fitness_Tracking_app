import { supabase } from './supabase';

export interface SleepLog {
  id: string;
  user_id: string;
  date: string;
  bedtime: string | null;
  wake_time: string | null;
  hours: number;
  quality_score: number | null;
  deep_sleep_percent: number;
  light_sleep_percent: number;
  rem_sleep_percent: number;
  created_at: string;
}

export async function getSleepLogByDate(userId: string, date: string): Promise<SleepLog | null> {
  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('Error fetching sleep log:', error);
    throw error;
  }

  return data;
}

export async function getTodaySleepLog(userId: string): Promise<SleepLog | null> {
  const today = new Date().toISOString().split('T')[0];
  return getSleepLogByDate(userId, today);
}

export async function addOrUpdateSleepLog(
  userId: string,
  sleepData: {
    date?: string;
    bedtime?: string;
    wake_time?: string;
    hours: number;
    quality_score?: number;
    deep_sleep_percent?: number;
    light_sleep_percent?: number;
    rem_sleep_percent?: number;
  }
): Promise<SleepLog> {
  const logDate = sleepData.date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('sleep_logs')
    .upsert({
      user_id: userId,
      date: logDate,
      bedtime: sleepData.bedtime || null,
      wake_time: sleepData.wake_time || null,
      hours: sleepData.hours,
      quality_score: sleepData.quality_score || null,
      deep_sleep_percent: sleepData.deep_sleep_percent || 0,
      light_sleep_percent: sleepData.light_sleep_percent || 0,
      rem_sleep_percent: sleepData.rem_sleep_percent || 0,
    }, {
      onConflict: 'user_id,date',
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding/updating sleep log:', error);
    throw error;
  }

  return data;
}

export async function deleteSleepLog(logId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('sleep_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting sleep log:', error);
    throw error;
  }
}

export async function getRecentSleepLogs(userId: string, days: number = 7): Promise<SleepLog[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching recent sleep logs:', error);
    throw error;
  }

  return data || [];
}
