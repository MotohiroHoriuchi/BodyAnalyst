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
        `flex flex-col items-center justify-center py-2 px-4 transition-all duration-200 rounded-lg ${
          isActive
            ? 'text-primary-600 scale-105'
            : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
        }`
      }
    >
      {icon}
      <span className="text-xs mt-1 font-semibold tracking-tight">{label}</span>
    </NavLink>
  );
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 pb-safe z-50 shadow-lg">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16 px-2">
        <NavItem to="/" icon={<Home className="w-6 h-6" />} label="ホーム" />
        <NavItem to="/meals" icon={<Utensils className="w-6 h-6" />} label="食事" />
        <NavItem to="/workout" icon={<Dumbbell className="w-6 h-6" />} label="トレーニング" />
        <NavItem to="/analytics" icon={<BarChart3 className="w-6 h-6" />} label="分析" />
      </div>
    </nav>
  );
}
