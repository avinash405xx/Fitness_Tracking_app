import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

console.log('=== MAIN.TSX EXECUTING ===');
console.log('Time:', new Date().toISOString());

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('CRITICAL: Root element not found!');
  document.body.innerHTML = `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #0d9488, #059669); display: flex; align-items: center; justify-content: center; color: white; font-family: system-ui;">
      <div style="text-align: center; padding: 40px; background: rgba(0,0,0,0.2); border-radius: 20px;">
        <h1 style="font-size: 2rem; margin-bottom: 20px;">❌ Error</h1>
        <p>Root element not found!</p>
      </div>
    </div>
  `;
} else {
  try {
    console.log('Creating root...');
    const root = createRoot(rootElement);

    console.log('Rendering loading state...');
    root.render(
      <StrictMode>
        <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-teal-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <div className="text-white text-2xl font-bold mb-2">Fitness Tracker</div>
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-white/80 text-lg">Initializing app...</div>
          </div>
        </div>
      </StrictMode>
    );

    console.log('Loading App and AuthProvider...');

    // Load the actual app after a brief moment
    setTimeout(async () => {
      try {
        const [{ default: App }, { AuthProvider }] = await Promise.all([
          import('./App.tsx'),
          import('./contexts/AuthContext')
        ]);

        console.log('Rendering full app...');
        root.render(
          <StrictMode>
            <AuthProvider>
              <App />
            </AuthProvider>
          </StrictMode>
        );
        console.log('=== APP FULLY LOADED ===');
      } catch (error) {
        console.error('Error loading app:', error);
        root.render(
          <StrictMode>
            <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h1 className="text-3xl font-bold mb-4">Error Loading App</h1>
                <pre className="text-left bg-black/30 p-4 rounded">{String(error)}</pre>
              </div>
            </div>
          </StrictMode>
        );
      }
    }, 100);

  } catch (error) {
    console.error('Critical error:', error);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(135deg, #991b1b, #7f1d1d); display: flex; align-items: center; justify-content: center; color: white; font-family: system-ui;">
        <div style="text-align: center; padding: 40px; max-width: 600px;">
          <h1 style="font-size: 2rem; margin-bottom: 20px;">Error Loading App</h1>
          <pre style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; text-align: left; overflow: auto;">${error}</pre>
        </div>
      </div>
    `;
  }
}
