import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/common';
import { Home, Meals, Workout, Analytics, Settings } from './pages';
import { seedDatabase } from './db/seed';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await seedDatabase();
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4FF]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default App;
