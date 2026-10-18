import React from 'react';
import { Loader2 } from 'lucide-react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#e8702a]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer gap-2 select-none';

  let sizeClasses = 'text-xs px-3 py-1.5 h-8';
  if (size === 'sm') sizeClasses = 'text-[11px] px-2.5 py-1 h-7';
  if (size === 'lg') sizeClasses = 'text-sm px-4 py-2 h-10';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-[#e8702a] hover:bg-[#d2611f] text-white shadow-xs';
      break;
    case 'secondary':
      variantClasses = 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-2xs';
      break;
    case 'outline':
      variantClasses = 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300';
      break;
    case 'danger':
      variantClasses = 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs';
      break;
    case 'ghost':
      variantClasses = 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900';
      break;
    case 'subtle':
      variantClasses = 'bg-gray-100 hover:bg-gray-200 text-gray-800';
      break;
  }

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
