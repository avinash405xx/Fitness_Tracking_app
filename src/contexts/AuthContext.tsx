import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile, supabase } from '../lib/supabase';
import { getCurrentUser, getProfile } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    let profileData = await getProfile(userId);

    if (!profileData) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        const email = user.email || '';

        const { error: profileError } = await supabase.from('profiles').insert({
          id: userId,
          name,
          email,
          current_streak: 0,
          longest_streak: 0,
          total_xp: 0,
          level: 1,
        });

        if (profileError && !profileError.message.includes('duplicate')) {
          console.error('Profile creation error:', profileError);
        } else {
          profileData = await getProfile(userId);
        }

        await initializeUserMilestones(userId);
      }
    }

    setProfile(profileData);
  };

  const initializeUserMilestones = async (userId: string) => {
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
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        );

        const authPromise = getCurrentUser();

        const currentUser = await Promise.race([authPromise, timeoutPromise]) as User | null;

        if (!mounted) return;

        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (async () => {
          if (!mounted) return;

          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await loadProfile(currentUser.id);
          } else {
            setProfile(null);
          }
        })();
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
