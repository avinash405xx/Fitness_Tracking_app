import { useState } from 'react';
import AppModern from './components/App/AppModern';

type AppView = 'dashboard';

function App() {
  const [currentView] = useState<AppView>('dashboard');

  return <AppModern onLogout={() => console.log('Logout clicked')} />;
}

export default App;
