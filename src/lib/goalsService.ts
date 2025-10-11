import { supabase } from './supabase';
import { addWeightEntry } from './weightHistoryService';

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: string;
  target_value: number;
  current_value: number;
  start_value?: number;
  unit: string;
  icon?: string;
  color?: string;
  start_date?: string;
  target_date?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  is_completed?: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGoalInput {
  name: string;
  description?: string;
  category: string;
  target_value: number;
  current_value?: number;
  unit: string;
  icon?: string;
  color?: string;
  start_date?: string;
  target_date?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateGoalInput {
  name?: string;
  description?: string;
  category?: string;
  target_value?: number;
  current_value?: number;
  unit?: string;
  icon?: string;
  color?: string;
  start_date?: string;
  target_date?: string;
  status?: 'active' | 'completed' | 'paused' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
}

export async function getGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }

  return data || [];
}

export async function getGoalById(goalId: string, userId: string): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching goal:', error);
    throw error;
  }

  return data;
}

export async function getGoalsByStatus(userId: string, status: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching goals by status:', error);
    throw error;
  }

  return data || [];
}

export async function createGoal(userId: string, goalData: CreateGoalInput): Promise<Goal> {
  const currentValue = goalData.current_value || 0;

  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      name: goalData.name,
      description: goalData.description || '',
      category: goalData.category,
      target_value: goalData.target_value,
      current_value: currentValue,
      start_value: currentValue,
      unit: goalData.unit,
      icon: goalData.icon || 'target',
      color: goalData.color || 'from-blue-600 to-green-600',
      start_date: goalData.start_date || new Date().toISOString().split('T')[0],
      target_date: goalData.target_date,
      status: goalData.status || 'active',
      priority: goalData.priority || 'medium',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating goal:', error);
    throw error;
  }

  if (goalData.category === 'bodyweight' && currentValue > 0) {
    await addWeightEntry(userId, {
      weight: currentValue,
      unit: goalData.unit,
      goal_id: data.id,
      notes: 'Initial weight',
    });
  }

  return data;
}

export async function updateGoal(
  goalId: string,
  userId: string,
  updates: UpdateGoalInput
): Promise<Goal> {
  const updateData: Record<string, unknown> = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.target_value !== undefined) updateData.target_value = updates.target_value;
  if (updates.current_value !== undefined) updateData.current_value = updates.current_value;
  if (updates.unit !== undefined) updateData.unit = updates.unit;
  if (updates.icon !== undefined) updateData.icon = updates.icon;
  if (updates.color !== undefined) updateData.color = updates.color;
  if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
  if (updates.target_date !== undefined) updateData.target_date = updates.target_date;
  if (updates.status !== undefined) {
    updateData.status = updates.status;
    if (updates.status === 'completed') {
      updateData.is_completed = true;
      updateData.completed_at = new Date().toISOString();
    }
  }
  if (updates.priority !== undefined) updateData.priority = updates.priority;

  const { data, error } = await supabase
    .from('goals')
    .update(updateData)
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating goal:', error);
    throw error;
  }

  return data;
}

export async function updateGoalProgress(
  goalId: string,
  userId: string,
  currentValue: number
): Promise<Goal> {
  const goal = await getGoalById(goalId, userId);

  if (!goal) {
    throw new Error('Goal not found');
  }

  const updates: UpdateGoalInput = {
    current_value: currentValue,
  };

  if (goal.category === 'bodyweight') {
    await addWeightEntry(userId, {
      weight: currentValue,
      unit: goal.unit,
      goal_id: goalId,
    });

    if (currentValue === goal.target_value && goal.status !== 'completed') {
      updates.status = 'completed';
    }
  } else {
    if (currentValue >= goal.target_value && goal.status !== 'completed') {
      updates.status = 'completed';
    }
  }

  return updateGoal(goalId, userId, updates);
}

export async function deleteGoal(goalId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
}

export function calculateGoalProgress(
  currentValue: number,
  targetValue: number,
  category?: string,
  startValue?: number
): number {
  if (targetValue === 0) return 0;

  if (category === 'bodyweight' && startValue !== undefined) {
    const totalDistance = Math.abs(targetValue - startValue);
    if (totalDistance === 0) return currentValue === targetValue ? 100 : 0;

    const currentDistance = Math.abs(currentValue - startValue);
    const progress = (currentDistance / totalDistance) * 100;

    return Math.min(progress, 100);
  }

  return Math.min((currentValue / targetValue) * 100, 100);
}

export function getGoalProgressStatus(currentValue: number, targetValue: number): string {
  const progress = calculateGoalProgress(currentValue, targetValue);

  if (progress >= 100) return 'completed';
  if (progress >= 75) return 'almost-there';
  if (progress >= 50) return 'halfway';
  if (progress >= 25) return 'in-progress';
  return 'just-started';
}
