import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex h-full items-center justify-center bg-gray-900/90">
      <div className="flex flex-col items-center gap-4">
        <div className="size-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <p className="text-lg font-medium text-white">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;