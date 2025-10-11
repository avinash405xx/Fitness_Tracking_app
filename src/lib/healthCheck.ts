import { supabase } from './supabase';

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

export async function wakeUpDatabase(): Promise<void> {
  try {
    await supabase.from('profiles').select('id').limit(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Failed to wake up database:', error);
  }
}
