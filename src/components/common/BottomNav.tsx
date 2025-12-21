import { NavLink } from 'react-router-dom';
import { Home, Utensils, Dumbbell, BarChart3 } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

function NavItem({ to, icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-2 px-4 transition-colors ${
          isActive
            ? 'text-primary-500'
            : 'text-gray-400 hover:text-gray-600'
        }`
      }
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </NavLink>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        <NavItem to="/" icon={<Home className="w-6 h-6" />} label="ホーム" />
        <NavItem to="/meals" icon={<Utensils className="w-6 h-6" />} label="食事" />
        <NavItem to="/workout" icon={<Dumbbell className="w-6 h-6" />} label="トレーニング" />
        <NavItem to="/analytics" icon={<BarChart3 className="w-6 h-6" />} label="分析" />
      </div>
    </nav>
  );
}
