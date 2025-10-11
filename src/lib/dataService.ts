import { supabase } from './supabase';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000';

export interface WaterLog {
  id: string;
  amount_ml: number;
  logged_at: string;
}

export interface SleepLog {
  id: string;
  date: string;
  hours: number;
  bedtime?: string;
  wake_time?: string;
  deep_sleep_percent: number;
  light_sleep_percent: number;
  rem_sleep_percent: number;
}

export interface Meal {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_date: string;
  items?: MealItem[];
}

export interface MealItem {
  id: string;
  food_name: string;
  calories: number;
  image_url?: string;
}

export interface DailyStats {
  stat_date: string;
  water_intake_ml: number;
  water_goal_ml: number;
  calories_consumed: number;
  calories_burned: number;
  calories_goal: number;
  steps: number;
  steps_goal: number;
  weight_kg?: number;
  bpm?: number;
}

// Water Tracking
export async function getWaterLogs(date: string = new Date().toISOString().split('T')[0]) {
  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .gte('logged_at', `${date}T00:00:00`)
    .lte('logged_at', `${date}T23:59:59`)
    .order('logged_at', { ascending: false });

  if (error) throw error;
  return data as WaterLog[];
}

export async function addWaterLog(amount_ml: number) {
  const { data, error } = await supabase
    .from('water_logs')
    .insert({
      user_id: DEMO_USER_ID,
      amount_ml,
      logged_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as WaterLog;
}

export async function deleteWaterLog(id: string) {
  const { error } = await supabase
    .from('water_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID);

  if (error) throw error;
}

// Sleep Tracking
export async function getSleepLogs(days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('sleep_logs')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return data as SleepLog[];
}

export async function addSleepLog(sleepData: Omit<SleepLog, 'id'>) {
  const { data, error } = await supabase
    .from('sleep_logs')
    .upsert({
      user_id: DEMO_USER_ID,
      ...sleepData,
    })
    .select()
    .single();

  if (error) throw error;
  return data as SleepLog;
}

// Meal Tracking
export async function getMeals(date: string = new Date().toISOString().split('T')[0]) {
  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      items:meal_items(*)
    `)
    .eq('user_id', DEMO_USER_ID)
    .eq('meal_date', date)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Meal[];
}

export async function addMeal(meal: Omit<Meal, 'id' | 'items'>, items: Omit<MealItem, 'id'>[]) {
  const { data: mealData, error: mealError } = await supabase
    .from('meals')
    .insert({
      user_id: DEMO_USER_ID,
      ...meal,
    })
    .select()
    .single();

  if (mealError) throw mealError;

  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('meal_items')
      .insert(
        items.map((item) => ({
          meal_id: mealData.id,
          ...item,
        }))
      );

    if (itemsError) throw itemsError;
  }

  return mealData as Meal;
}

export async function deleteMeal(id: string) {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
    .eq('user_id', DEMO_USER_ID);

  if (error) throw error;
}

// Daily Stats
export async function getDailyStats(date: string = new Date().toISOString().split('T')[0]) {
  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .eq('stat_date', date)
    .maybeSingle();

  if (error) throw error;
  return data as DailyStats | null;
}

export async function updateDailyStats(stats: Partial<DailyStats>) {
  const date = stats.stat_date || new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_stats')
    .upsert({
      user_id: DEMO_USER_ID,
      stat_date: date,
      ...stats,
    })
    .select()
    .single();

  if (error) throw error;
  return data as DailyStats;
}

export async function getWeeklyStats() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('user_id', DEMO_USER_ID)
    .gte('stat_date', startDate.toISOString().split('T')[0])
    .lte('stat_date', endDate.toISOString().split('T')[0])
    .order('stat_date', { ascending: true });

  if (error) throw error;
  return data as DailyStats[];
}

// Initialize demo data
export async function initializeDemoData() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if data already exists
    const existingStats = await getDailyStats(today);
    if (existingStats) return;

    // Create initial daily stats
    await updateDailyStats({
      stat_date: today,
      water_intake_ml: 1500,
      water_goal_ml: 2300,
      calories_consumed: 950,
      calories_burned: 245,
      calories_goal: 2000,
      steps: 4325,
      steps_goal: 10000,
      weight_kg: 62,
      bpm: 72,
    });

    // Add some water logs
    const now = new Date();
    await addWaterLog(250);
    await addWaterLog(300);
    await addWaterLog(400);

    // Add sleep logs for the week
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const sleepHours = [7.5, 6.5, 8, 7, 6, 9, 8.5];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));

      await addSleepLog({
        date: date.toISOString().split('T')[0],
        hours: sleepHours[i],
        bedtime: '22:30:00',
        wake_time: '07:00:00',
        deep_sleep_percent: 45,
        light_sleep_percent: 35,
        rem_sleep_percent: 20,
      });
    }

    // Add meals with items
    await addMeal(
      {
        meal_type: 'breakfast',
        name: 'Healthy Breakfast',
        calories: 350,
        protein: 15,
        carbs: 45,
        fats: 12,
        meal_date: today,
      },
      [
        {
          food_name: 'Bread',
          calories: 120,
          image_url: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=200',
        },
        {
          food_name: 'Peanut Butter',
          calories: 180,
          image_url: 'https://images.pexels.com/photos/7937496/pexels-photo-7937496.jpeg?auto=compress&cs=tinysrgb&w=200',
        },
        {
          food_name: 'Apple',
          calories: 50,
          image_url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=200',
        },
      ]
    );

    console.log('Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}
