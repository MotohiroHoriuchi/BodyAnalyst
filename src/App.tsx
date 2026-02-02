import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeDatabase, subscribeToAuthState, type AuthState } from './db';

// Pages
import { HomePage } from './pages/HomePage';
import { MealPage } from './pages/MealPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { WeightPage } from './pages/WeightPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SetupPage } from './pages/SetupPage';

// Layout
import { MainLayout } from './components/layout/MainLayout';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isSignedIn: false,
    user: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved spreadsheet ID
    const savedId = localStorage.getItem('BODYANALYST_SPREADSHEET_ID');
    if (savedId && savedId !== 'your_spreadsheet_id_here') {
      setSpreadsheetId(savedId);
    }

    // Initialize database and auth
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize');
      }
    };

    init();

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState(setAuthState);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSetupComplete = (newSpreadsheetId: string) => {
    setSpreadsheetId(newSpreadsheetId);
  };

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-bold text-red-600 mb-4">Initialization Error</h1>
          <p className="text-gray-700 mb-4">{initError}</p>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Common issues:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Google API credentials not configured in .env file</li>
              <li>Check that VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_API_KEY are set</li>
              <li>Make sure you're using the correct API credentials from Google Cloud Console</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-700">Loading...</div>
          <div className="text-sm text-gray-500 mt-2">Initializing Google API...</div>
        </div>
      </div>
    );
  }

  if (!authState.isSignedIn) {
    return <LoginPage />;
  }

  if (!spreadsheetId) {
    return <SetupPage onComplete={handleSetupComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="meals" element={<MealPage />} />
          <Route path="workout" element={<WorkoutPage />} />
          <Route path="weight" element={<WeightPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
