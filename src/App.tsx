import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Proto pages (dev-only)
const NetworkGraphDemo = import.meta.env.DEV
  ? lazy(() => import('../proto/visualization-engine/src/components/NetworkGraph/NetworkGraphDemo').then(m => ({ default: m.NetworkGraphDemo })))
  : null;

const WorkoutInputPreview = import.meta.env.DEV
  ? lazy(() => import('./features/workout/components/WorkoutInputPreview').then(m => ({ default: m.WorkoutInputPreview })))
  : null;

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { MealPage } from './pages/MealPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { WeightPage } from './pages/WeightPage';
import { SettingsPage } from './pages/SettingsPage';

// Layout
import { MainLayout } from './components/layout/MainLayout';

function App() {
  // Set dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Dev-only: render proto pages without auth
  if (import.meta.env.DEV && NetworkGraphDemo && window.location.pathname === '/proto/network-graph') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <NetworkGraphDemo />
      </Suspense>
    );
  }

  // Dev-only: render WorkoutInput preview without auth
  if (import.meta.env.DEV && WorkoutInputPreview && window.location.pathname === '/proto/workout-input') {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <WorkoutInputPreview />
      </Suspense>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="workout" element={<WorkoutPage />} />
          <Route path="meal" element={<MealPage />} />
          <Route path="weight" element={<WeightPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
