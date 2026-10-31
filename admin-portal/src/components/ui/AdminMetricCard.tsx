import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface AdminMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  badge?: {
    text: string;
    variant: 'positive' | 'negative' | 'neutral' | 'warning';
  };
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const AdminMetricCard: React.FC<AdminMetricCardProps> = ({
  label,
  value,
  subtext,
  badge,
  onClick,
  icon,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 transition-all relative overflow-hidden group ${
        onClick
          ? 'cursor-pointer hover:border-gray-300 hover:shadow-xs'
          : ''
      }`}
    >
      <div className="flex items-center justify-between text-gray-500 mb-2">
        <span className="text-xs font-semibold tracking-tight text-gray-600">{label}</span>
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-gray-400 group-hover:text-gray-600 transition-colors">{icon}</span>}
          {onClick && (
            <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#e8702a] transition-colors" />
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 font-sans">
          {value}
        </div>
        {badge && (
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              badge.variant === 'positive'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : badge.variant === 'negative'
                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                : badge.variant === 'warning'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[11px] font-medium text-gray-500 mt-1.5 truncate">{subtext}</p>
      )}
    </div>
  );
};
