// ProjectHeader.tsx
import React, { useState } from 'react';
import InviteMemberModal from './InviteMemberModal';

interface ProjectHeaderProps {
  projectName: string;
  projectId: number; // Add projectId to identify which project to invite to
  workspaceId: number; // Add workspaceId to fetch members
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ projectName, projectId, workspaceId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-t-lg border-b border-white/10 bg-blue-900/80 px-4 py-2">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-white">{projectName}</h1>
        <div className="ml-6 flex items-center gap-4">
          <button className="flex items-center gap-1 rounded bg-blue-800 px-3 py-1 text-sm font-medium text-white">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            Board
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded bg-blue-700/60 p-2 text-white hover:bg-blue-700/80">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button className="rounded bg-blue-700/60 p-2 text-white hover:bg-blue-700/80">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013.586 6z" />
          </svg>
        </button>
        <button
          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-3 py-1 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-900"
          onClick={() => setIsModalOpen(true)}
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Invite Members
        </button>
      </div>
      {isModalOpen && (
        <InviteMemberModal
          projectId={projectId}
          workspaceId={workspaceId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectHeader;