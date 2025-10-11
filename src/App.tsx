import { useState } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AppModern from './components/App/AppModern';
import { useAuth } from './contexts/AuthContext';

type AppView = 'login' | 'signup';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'login') {
      return (
        <Login
          onSwitchToSignup={() => setCurrentView('signup')}
          onLoginSuccess={() => {}}
        />
      );
    }

    return (
      <Signup
        onSwitchToLogin={() => setCurrentView('login')}
        onSignupSuccess={() => {}}
      />
    );
  }

  return <AppModern onLogout={() => setCurrentView('login')} />;
}

export default App;
