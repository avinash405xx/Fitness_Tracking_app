import { supabase, Goal, ActivityLog, Achievement, Milestone } from './supabase';

export async function getGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('goals').insert(goal).select().single();

  if (error) throw error;
  return data;
}

export async function updateGoal(id: string, updates: Partial<Goal>) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (updates.is_completed && !updates.completed_at) {
    await checkAndUnlockAchievement(updates.user_id!, 'goal_complete', 'Goal Crusher', 'Complete your first goal', 300);
    await updateMilestone(updates.user_id!, 'goal_complete', 1);
  }

  return data;
}

export async function deleteGoal(id: string) {
  const { error } = await supabase.from('goals').delete().eq('id', id);
  if (error) throw error;
}

export async function getActivityLogs(userId: string, type?: 'workout' | 'meal', limit = 50) {
  let query = supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
    .limit(limit);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createActivityLog(log: Omit<ActivityLog, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('activity_logs').insert(log).select().single();

  if (error) throw error;

  if (log.type === 'workout') {
    await checkWorkoutMilestones(log.user_id);
    await updateStreak(log.user_id);
  } else if (log.type === 'meal') {
    await checkMealMilestones(log.user_id);
  }

  return data;
}

export async function updateActivityLog(id: string, updates: Partial<ActivityLog>) {
  const { data, error } = await supabase
    .from('activity_logs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteActivityLog(id: string) {
  const { error } = await supabase.from('activity_logs').delete().eq('id', id);
  if (error) throw error;
}

export async function getAchievements(userId: string) {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getMilestones(userId: string) {
  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { name?: string; avatar_url?: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getDashboardStats(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [profile, goals, todayLogs, weekLogs] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('goals').select('*').eq('user_id', userId),
    supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', todayISO),
    supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const todayCalories = todayLogs.data?.reduce((sum, log) => {
    return log.type === 'workout' ? sum + log.calories : sum;
  }, 0) || 0;

  const weekWorkouts = weekLogs.data?.filter((log) => log.type === 'workout').length || 0;

  return {
    profile: profile.data,
    goals: goals.data || [],
    todayCalories,
    weekWorkouts,
    todayLogs: todayLogs.data || [],
  };
}

async function checkWorkoutMilestones(userId: string) {
  const { data: workouts } = await supabase
    .from('activity_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'workout');

  const workoutCount = workouts?.length || 0;

  if (workoutCount === 1) {
    await checkAndUnlockAchievement(userId, 'first_workout', 'First Workout', 'Complete your first workout', 50);
  }

  await updateMilestone(userId, 'first_workout', Math.min(workoutCount, 1));
  await updateMilestone(userId, 'workouts_5', Math.min(workoutCount, 5));
}

async function checkMealMilestones(userId: string) {
  const { data: meals } = await supabase
    .from('activity_logs')
    .select('logged_at')
    .eq('user_id', userId)
    .eq('type', 'meal')
    .order('logged_at', { ascending: false });

  if (!meals || meals.length === 0) return;

  let consecutiveDays = 1;
  const dates = meals.map((m) => new Date(m.logged_at).toDateString());
  const uniqueDates = [...new Set(dates)];

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  await updateMilestone(userId, 'meals_14', Math.min(consecutiveDays, 14));
}

async function updateStreak(userId: string) {
  const { data: logs } = await supabase
    .from('activity_logs')
    .select('logged_at')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false });

  if (!logs || logs.length === 0) return;

  const dates = logs.map((l) => new Date(l.logged_at).toDateString());
  const uniqueDates = [...new Set(dates)];

  let streak = 1;
  const today = new Date().toDateString();

  if (uniqueDates[0] !== today) {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    if (uniqueDates[0] !== yesterday) {
      streak = 0;
    }
  }

  for (let i = 1; i < uniqueDates.length && streak > 0; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_streak, longest_streak')
    .eq('id', userId)
    .maybeSingle();

  if (profile) {
    const updates: any = { current_streak: streak };

    if (streak > profile.longest_streak) {
      updates.longest_streak = streak;
    }

    await supabase.from('profiles').update(updates).eq('id', userId);

    if (streak >= 7) {
      await checkAndUnlockAchievement(userId, 'streak_7', '7-Day Streak', 'Maintain a 7-day workout streak', 200);
    }

    await updateMilestone(userId, 'streak_7', Math.min(streak, 7));
  }
}

async function checkAndUnlockAchievement(
  userId: string,
  type: string,
  name: string,
  description: string,
  xp: number
) {
  const { data: existing } = await supabase
    .from('achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_type', type)
    .maybeSingle();

  if (!existing) {
    await supabase.from('achievements').insert({
      user_id: userId,
      achievement_type: type,
      name,
      description,
      xp_reward: xp,
    });

    const { data: profile } = await supabase
      .from('profiles')
      .select('total_xp, level')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      const newXP = profile.total_xp + xp;
      const newLevel = Math.floor(newXP / 1000) + 1;

      await supabase.from('profiles').update({
        total_xp: newXP,
        level: newLevel,
      }).eq('id', userId);
    }
  }
}

async function updateMilestone(userId: string, milestoneType: string, progress: number) {
  const { data: milestone } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', userId)
    .eq('milestone_type', milestoneType)
    .maybeSingle();

  if (milestone && !milestone.is_completed) {
    const updates: any = { current_progress: progress };

    if (progress >= milestone.target_progress) {
      updates.is_completed = true;
      updates.completed_at = new Date().toISOString();
    }

    await supabase.from('milestones').update(updates).eq('id', milestone.id);
  }
}
