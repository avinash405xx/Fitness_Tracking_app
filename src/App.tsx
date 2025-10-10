import { useState } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Welcome from './components/Onboarding/Welcome';
import GoalSetup from './components/Onboarding/GoalSetup';
import DashboardMain from './components/Dashboard/DashboardMain';

type AppView = 'login' | 'signup' | 'welcome' | 'goal-setup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');

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

  return <DashboardMain />;
}

export default App;
