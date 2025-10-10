import { useState } from 'react';
import Welcome from './components/Onboarding/Welcome';
import GoalSetup from './components/Onboarding/GoalSetup';
import AppModern from './components/App/AppModern';

type AppView = 'welcome' | 'goal-setup' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  console.log('App rendering (UI Demo Mode):', { currentView });

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

  return <AppModern onLogout={() => console.log('Logout clicked')} />;
}

export default App;
