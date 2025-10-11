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

export async function getMealsByDate(userId: string, date: string): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('meal_date', date)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }

  return data || [];
}

export async function getTodaysMeals(userId: string): Promise<Meal[]> {
  const today = new Date().toISOString().split('T')[0];
  return getMealsByDate(userId, today);
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
    meal_date?: string;
  }
): Promise<Meal> {
  const mealDate = mealData.meal_date || new Date().toISOString().split('T')[0];

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
      meal_date: mealDate,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding meal:', error);
    throw error;
  }

  await updateDailyCalories(userId, mealDate);

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

  const meal = await supabase
    .from('meals')
    .select('meal_date')
    .eq('id', mealId)
    .single();

  if (meal.data) {
    await updateDailyCalories(userId, meal.data.meal_date);
  }

  return data;
}

export async function deleteMeal(mealId: string, userId: string, mealDate?: string): Promise<void> {
  let date = mealDate;

  if (!date) {
    const meal = await supabase
      .from('meals')
      .select('meal_date')
      .eq('id', mealId)
      .single();

    if (meal.data) {
      date = meal.data.meal_date;
    }
  }

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }

  if (date) {
    await updateDailyCalories(userId, date);
  }
}

export async function getStatsByDate(userId: string, date: string): Promise<DailyStat> {
  let { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', userId)
    .eq('stat_date', date)
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
        stat_date: date,
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

export async function getTodayStats(userId: string): Promise<DailyStat> {
  const today = new Date().toISOString().split('T')[0];
  return getStatsByDate(userId, today);
}

export async function updateDailyCalories(userId: string, date?: string): Promise<void> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const meals = await getMealsByDate(userId, targetDate);
  const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

  const { error } = await supabase
    .from('daily_stats')
    .upsert({
      user_id: userId,
      stat_date: targetDate,
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
    stat_date?: string;
  }
): Promise<DailyStat> {
  const targetDate = stats.stat_date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_stats')
    .upsert({
      user_id: userId,
      stat_date: targetDate,
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
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  date?: string
): Promise<Meal[]> {
  const targetDate = date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('meal_date', targetDate)
    .eq('meal_type', mealType)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching meals by type:', error);
    throw error;
  }

  return data || [];
}
