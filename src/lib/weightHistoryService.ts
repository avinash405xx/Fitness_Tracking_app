import { supabase } from './supabase';

export interface WeightHistoryEntry {
  id: string;
  user_id: string;
  goal_id?: string;
  weight: number;
  unit: string;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

export interface CreateWeightEntryInput {
  weight: number;
  unit: string;
  goal_id?: string;
  notes?: string;
  recorded_at?: string;
}

export async function addWeightEntry(
  userId: string,
  entryData: CreateWeightEntryInput
): Promise<WeightHistoryEntry> {
  const { data, error } = await supabase
    .from('weight_history')
    .insert({
      user_id: userId,
      weight: entryData.weight,
      unit: entryData.unit,
      goal_id: entryData.goal_id,
      notes: entryData.notes,
      recorded_at: entryData.recorded_at || new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding weight entry:', error);
    throw error;
  }

  return data;
}

export async function getWeightHistory(
  userId: string,
  goalId?: string
): Promise<WeightHistoryEntry[]> {
  let query = supabase
    .from('weight_history')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false });

  if (goalId) {
    query = query.eq('goal_id', goalId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching weight history:', error);
    throw error;
  }

  return data || [];
}

export async function getWeightHistoryByDateRange(
  userId: string,
  startDate: string,
  endDate: string,
  goalId?: string
): Promise<WeightHistoryEntry[]> {
  let query = supabase
    .from('weight_history')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', startDate)
    .lte('recorded_at', endDate)
    .order('recorded_at', { ascending: true });

  if (goalId) {
    query = query.eq('goal_id', goalId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching weight history by date range:', error);
    throw error;
  }

  return data || [];
}

export async function updateWeightEntry(
  entryId: string,
  userId: string,
  updates: Partial<CreateWeightEntryInput>
): Promise<WeightHistoryEntry> {
  const { data, error } = await supabase
    .from('weight_history')
    .update(updates)
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating weight entry:', error);
    throw error;
  }

  return data;
}

export async function deleteWeightEntry(
  entryId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('weight_history')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting weight entry:', error);
    throw error;
  }
}

export async function getLatestWeightEntry(
  userId: string,
  goalId?: string
): Promise<WeightHistoryEntry | null> {
  let query = supabase
    .from('weight_history')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1);

  if (goalId) {
    query = query.eq('goal_id', goalId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error fetching latest weight entry:', error);
    throw error;
  }

  return data;
}
