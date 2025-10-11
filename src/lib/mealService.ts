import { supabase } from './supabase';

export interface Meal {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  meal_date: string;
  created_at: string;
}

export interface DailyStat {
  id: string;
  user_id: string;
  stat_date: string;
  water_intake_ml: number;
  water_goal_ml: number;
  calories_consumed: number;
  calories_burned: number;
  calories_goal: number;
  steps: number;
  steps_goal: number;
  weight_kg: number | null;
  bpm: number | null;
  created_at: string;
  updated_at: string;
}

export async function getTodaysMeals(userId: string): Promise<Meal[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('meal_date', today)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }

  return data || [];
}

export async function addMeal(
  userId: string,
  mealData: {
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
  }
): Promise<Meal> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userId,
      meal_type: mealData.meal_type,
      name: mealData.name,
      calories: mealData.calories,
      protein: mealData.protein || 0,
      carbs: mealData.carbs || 0,
      fats: mealData.fats || 0,
      fiber: mealData.fiber || 0,
      meal_date: today,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding meal:', error);
    throw error;
  }

  await updateDailyCalories(userId);

  return data;
}

export async function updateMeal(
  mealId: string,
  userId: string,
  mealData: {
    name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    fiber?: number;
  }
): Promise<Meal> {
  const { data, error } = await supabase
    .from('meals')
    .update(mealData)
    .eq('id', mealId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating meal:', error);
    throw error;
  }

  await updateDailyCalories(userId);

  return data;
}

export async function deleteMeal(mealId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }

  await updateDailyCalories(userId);
}

export async function getTodayStats(userId: string): Promise<DailyStat> {
  const today = new Date().toISOString().split('T')[0];

  let { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('stat_date', today)
    .maybeSingle();

  if (error) {
    console.error('Error fetching daily stats:', error);
    throw error;
  }

  if (!data) {
    const { data: newData, error: insertError } = await supabase
      .from('daily_stats')
      .insert({
        user_id: userId,
        stat_date: today,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating daily stats:', insertError);
      throw insertError;
    }

    data = newData;
  }

  return data;
}

export async function updateDailyCalories(userId: string): Promise<void> {
  const meals = await getTodaysMeals(userId);
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('daily_stats')
    .upsert({
      user_id: userId,
      stat_date: today,
      calories_consumed: totalCalories,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,stat_date',
    });

  if (error) {
    console.error('Error updating daily calories:', error);
  }
}

export async function updateDailyStats(
  userId: string,
  stats: {
    water_intake_ml?: number;
    calories_burned?: number;
    steps?: number;
    weight_kg?: number;
    bpm?: number;
    calories_goal?: number;
    water_goal_ml?: number;
    steps_goal?: number;
  }
): Promise<DailyStat> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_stats')
    .upsert({
      user_id: userId,
      stat_date: today,
      ...stats,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,stat_date',
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating daily stats:', error);
    throw error;
  }

  return data;
}

export async function getMealsByType(
  userId: string,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
): Promise<Meal[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('meal_date', today)
    .eq('meal_type', mealType)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching meals by type:', error);
    throw error;
  }

  return data || [];
}
