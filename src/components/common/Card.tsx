import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Card({ children, className = '', padding = 'md', onClick }: CardProps) {
  const baseClasses = `bg-white rounded-xl shadow-md border border-neutral-100 ${paddingClasses[padding]}`;
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-lg hover:border-neutral-200 transition-all duration-200 active:scale-[0.98]'
    : '';

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
}
