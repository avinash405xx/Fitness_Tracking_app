import { useState } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AppModern from './components/App/AppModern';

type AppView = 'login' | 'signup' | 'dashboard';

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
        onSignupSuccess={() => setCurrentView('dashboard')}
      />
    );
  }

  return <AppModern onLogout={() => setCurrentView('login')} />;
}

export default App;
