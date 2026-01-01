import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-md hover:shadow-lg',
  secondary: 'bg-secondary-50 hover:bg-secondary-100 active:bg-secondary-200 text-secondary-700 border border-secondary-200',
  ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        flex items-center justify-center gap-2
        font-semibold rounded-xl transition-all duration-200
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
    >
      {children}
    </button>
  );
}
