import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { Profile } from '../lib/supabase';

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
  const mockUser = {
    id: 'mock-user-123',
    email: 'demo@fitness.app',
  } as User;

  const mockProfile: Profile = {
    id: 'mock-user-123',
    name: 'Avinash Kumar',
    email: 'avinash.kumar550@gmail.com',
    current_streak: 5,
    longest_streak: 12,
    total_xp: 350,
    level: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const [user] = useState<User | null>(mockUser);
  const [profile] = useState<Profile | null>(mockProfile);
  const [loading] = useState(false);

  const refreshProfile = async () => {
    console.log('Mock refresh profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
