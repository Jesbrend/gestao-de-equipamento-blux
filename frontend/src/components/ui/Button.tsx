import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
}

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:bg-[#111827] hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150',
};

const sizes = { sm: 'px-3 py-1.5 text-xs', md: '', lg: 'px-6 py-3 text-base' };

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {children}
    </button>
  );
}
