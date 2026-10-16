import React from 'react';

interface UsageProgressProps {
  value: number;
  max: number;
  className?: string;
  barColor?: string;
  heightClass?: string;
}

export const UsageProgress: React.FC<UsageProgressProps> = ({
  value,
  max,
  className = '',
  barColor,
  heightClass = 'h-1.5',
}) => {
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  // Default color is Lithos Server Salad brand orange (#e8702a)
  const resolvedColor =
    barColor || (percentage > 90 ? 'bg-red-500' : percentage > 75 ? 'bg-amber-500' : 'bg-[#e8702a]');

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Usage: ${value} of ${max}`}
      className={`w-full overflow-hidden rounded-full bg-gray-100 ${heightClass} ${className}`}
    >
      <div
        className={`${resolvedColor} h-full transition-all duration-300 ease-out rounded-full`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
