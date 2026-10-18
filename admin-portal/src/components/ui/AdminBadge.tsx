import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral';

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = 'neutral',
  dot = true,
  className = '',
  size = 'sm',
}) => {
  let bgClass = 'bg-gray-100 text-gray-700 border-gray-200/80';
  let dotClass = 'bg-gray-400';

  switch (variant) {
    case 'success':
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
      dotClass = 'bg-emerald-500';
      break;
    case 'warning':
      bgClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
      dotClass = 'bg-amber-500';
      break;
    case 'danger':
      bgClass = 'bg-rose-50 text-rose-800 border-rose-200/80';
      dotClass = 'bg-rose-500';
      break;
    case 'info':
      bgClass = 'bg-blue-50 text-blue-800 border-blue-200/80';
      dotClass = 'bg-blue-500';
      break;
    case 'neutral':
    default:
      bgClass = 'bg-gray-50 text-gray-700 border-gray-200';
      dotClass = 'bg-gray-400';
      break;
  }

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClass} ${bgClass} ${className} select-none`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />}
      <span className="truncate">{children}</span>
    </span>
  );
};
