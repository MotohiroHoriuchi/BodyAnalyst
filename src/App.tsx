import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeDatabase, subscribeToAuthState, type AuthState } from './db';

// Pages (to be implemented)
import { HomePage } from './pages/HomePage';
import { MealPage } from './pages/MealPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

// Layout
import { MainLayout } from './components/layout/MainLayout';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isSignedIn: false,
    user: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize database and auth
    const init = async () => {
      try {
        await initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    init();

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthState(setAuthState);

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!authState.isSignedIn) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="meals" element={<MealPage />} />
          <Route path="workout" element={<WorkoutPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
