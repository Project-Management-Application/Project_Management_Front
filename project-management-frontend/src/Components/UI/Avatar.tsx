import React from 'react';

interface AvatarProps {
  username?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

export const Avatar: React.FC<AvatarProps> = ({
  username,
  src,
  size = 'md',
  className = '',
  status
}) => {
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-14 w-14 text-lg',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-400',
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={username || 'Avatar'}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-medium text-white ring-2 ring-white`}>
          {username ? getInitials(username) : 'U'}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 block size-2.5 rounded-full ${statusColors[status]} ring-2 ring-white`} />
      )}
    </div>
  );
};