import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'outline' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className = '',
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors whitespace-nowrap";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    outline: "bg-transparent border border-gray-300 text-gray-700",
    secondary: "bg-gray-700 text-white",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  
  const sizes = {
    sm: "text-xs px-2 py-0.5 rounded",
    md: "text-xs px-2.5 py-0.5 rounded",
    lg: "text-sm px-3 py-1 rounded-md",
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};