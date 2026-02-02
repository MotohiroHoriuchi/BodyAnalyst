import { ReactNode } from 'react';

interface DashboardGridProps {
  children: ReactNode;
}

export function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#1C1C1E] p-4">
      <div className="grid grid-cols-2 gap-3 max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
