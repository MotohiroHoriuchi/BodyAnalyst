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
    <header className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-neutral-200 z-40 shadow-sm">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {leftAction}
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {rightAction}
          {showSettings && (
            <Link
              to="/settings"
              className="p-2 -mr-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all duration-200"
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
