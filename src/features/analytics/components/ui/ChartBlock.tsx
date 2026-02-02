import { ReactNode } from 'react';

interface ChartBlockProps {
  title: string;
  size?: '1x1' | '2x1' | '2x2';
  loading?: boolean;
  error?: string;
  isEmpty?: boolean;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ChartBlock({
  title,
  size = '1x1',
  loading = false,
  error,
  isEmpty = false,
  onRetry,
  children,
}: ChartBlockProps) {
  const sizeClasses = {
    '1x1': 'col-span-1 aspect-square',
    '2x1': 'col-span-2 aspect-[2/1]',
    '2x2': 'col-span-2 aspect-square',
  };

  return (
    <div
      className={`relative bg-white dark:bg-[#1C1C1E] rounded-xl shadow-lg p-3 ${sizeClasses[size]}`}
    >
      {/* Title overlay */}
      <div className="absolute top-2 left-3 z-10">
        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 opacity-70">
          {title}
        </h3>
      </div>

      {/* Content area */}
      <div className="w-full h-full pt-6">
        {loading && <BlockSkeleton />}
        {error && <BlockError message={error} onRetry={onRetry} />}
        {isEmpty && !loading && !error && <EmptyBlock />}
        {!loading && !error && !isEmpty && children}
      </div>
    </div>
  );
}

// Loading skeleton component
function BlockSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center animate-pulse">
      <div className="w-full h-full space-y-3">
        {/* Simulate chart bars/lines */}
        <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-2">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyBlock() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
      <svg
        className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
        データがありません
        <br />
        記録を追加してください
      </p>
    </div>
  );
}

// Error state component
function BlockError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <svg
        className="w-12 h-12 text-red-400 mb-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 text-center px-4">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
        >
          再試行
        </button>
      )}
    </div>
  );
}
