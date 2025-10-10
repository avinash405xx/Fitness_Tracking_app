import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    if (!loading) {
      if (user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-white text-2xl font-bold mb-2">Fitness Tracker</h2>
          <p className="text-white/80">Loading your fitness journey...</p>
        </motion.div>
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
