import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  variant = 'default',
  showLabel = false,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.round((value / max) * 100) || 0;
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-indigo-500';
    }
  };
  
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };
  
  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between">
        {showLabel && (
          <>
            <span className="text-xs font-medium text-gray-500">{percentage}%</span>
            <span className="text-xs font-medium text-gray-500">{value}/{max}</span>
          </>
        )}
      </div>
      <div className={`w-full overflow-hidden rounded-full bg-gray-200 ${getSizeStyles()}`}>
        <div
          className={`${getSizeStyles()} ${getVariantStyles()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};