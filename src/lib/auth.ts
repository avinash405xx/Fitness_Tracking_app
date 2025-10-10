import { supabase } from './supabase';

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      email,
      current_streak: 0,
      longest_streak: 0,
      total_xp: 0,
      level: 1,
    });

    if (profileError) throw profileError;

    await initializeUserMilestones(data.user.id);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  try {
    console.log('Getting current user...');
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    console.log('User retrieved:', user ? 'yes' : 'no');
    return user;
  } catch (error) {
    console.error('Exception getting user:', error);
    return null;
  }
}

export async function getProfile(userId: string) {
  try {
    console.log('Getting profile for user:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }

    console.log('Profile retrieved:', data ? 'yes' : 'no');
    return data;
  } catch (error) {
    console.error('Exception getting profile:', error);
    return null;
  }
}

async function initializeUserMilestones(userId: string) {
  const defaultMilestones = [
    {
      user_id: userId,
      milestone_type: 'first_workout',
      name: 'First Steps',
      description: 'Log your first workout',
      current_progress: 0,
      target_progress: 1,
    },
    {
      user_id: userId,
      milestone_type: 'workouts_5',
      name: 'Getting Started',
      description: 'Complete 5 workouts',
      current_progress: 0,
      target_progress: 5,
    },
    {
      user_id: userId,
      milestone_type: 'streak_7',
      name: 'On Fire',
      description: 'Maintain a 7-day streak',
      current_progress: 0,
      target_progress: 7,
    },
    {
      user_id: userId,
      milestone_type: 'meals_14',
      name: 'Consistency King',
      description: 'Log meals for 14 consecutive days',
      current_progress: 0,
      target_progress: 14,
    },
    {
      user_id: userId,
      milestone_type: 'goal_complete',
      name: 'Goal Crusher',
      description: 'Complete your first goal',
      current_progress: 0,
      target_progress: 1,
    },
  ];

  const { error } = await supabase.from('milestones').insert(defaultMilestones);
  if (error) console.error('Error initializing milestones:', error);
}
