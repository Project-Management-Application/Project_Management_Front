// src/components/ProjectStation/EmptyTasksList.tsx
import React from 'react';

const EmptyTasksList: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 text-center text-gray-400">
      <svg className="mb-2 size-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p className="text-sm">No tasks yet</p>
    </div>
  );
};

export default EmptyTasksList;