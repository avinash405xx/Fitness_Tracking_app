import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext';
import { DataRefreshProvider } from './contexts/DataRefreshContext';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <DataRefreshProvider>
          <App />
        </DataRefreshProvider>
      </AuthProvider>
    </StrictMode>
  );
}
