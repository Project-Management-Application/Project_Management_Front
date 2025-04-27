import React from 'react';

const EmptyTasksList: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
      <svg
        className="mb-2 size-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-sm">No tasks yet</p>
      <p className="mt-1 text-xs">Add a task to get started</p>
    </div>
  );
};

export default EmptyTasksList;