import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function Header({ title, showSettings = false, leftAction, rightAction }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {leftAction}
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {rightAction}
          {showSettings && (
            <Link
              to="/settings"
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="設定"
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
