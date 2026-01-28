import { Outlet, NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, TrendingUp, Settings } from 'lucide-react';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </NavLink>

          <NavLink
            to="/meals"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <Utensils size={24} />
            <span className="text-xs mt-1">Meals</span>
          </NavLink>

          <NavLink
            to="/workout"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <Dumbbell size={24} />
            <span className="text-xs mt-1">Workout</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <TrendingUp size={24} />
            <span className="text-xs mt-1">Analytics</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`
            }
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
