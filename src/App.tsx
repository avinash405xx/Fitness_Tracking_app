import { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Welcome from './components/Onboarding/Welcome';
import GoalSetup from './components/Onboarding/GoalSetup';
import AppModern from './components/App/AppModern';
import { useAuth } from './contexts/AuthContext';

type AppView = 'login' | 'signup' | 'welcome' | 'goal-setup' | 'dashboard';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('login');

  useEffect(() => {
    console.log('Auth state:', { user: !!user, loading });
    if (!loading) {
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    }
  }, [user, loading]);

  console.log('App rendering:', { loading, currentView });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <Login
        onSwitchToSignup={() => setCurrentView('signup')}
        onLoginSuccess={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <Signup
        onSwitchToLogin={() => setCurrentView('login')}
        onSignupSuccess={() => setCurrentView('welcome')}
      />
    );
  }

  if (currentView === 'welcome') {
    return <Welcome onComplete={() => setCurrentView('goal-setup')} />;
  }

  if (currentView === 'goal-setup') {
    return (
      <GoalSetup
        onComplete={() => setCurrentView('dashboard')}
        onBack={() => setCurrentView('welcome')}
      />
    );
  }

  return <AppModern onLogout={() => setCurrentView('login')} />;
}

export default App;
