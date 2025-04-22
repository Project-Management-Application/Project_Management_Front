/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { getJoinedWorkspaces, getMyWorkspace, WorkspaceDTO } from '../../../services/Workspace-apis';

interface Workspace {
  id: number;
  name: string;
  isYours: boolean;
  isCurrent: boolean;
}

interface WorkspaceListProps {
  currentWorkspaceId: number;
  setCurrentWorkspace: (id: number) => void;
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ currentWorkspaceId, setCurrentWorkspace }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
    const validId = savedWorkspaceId ? Number(savedWorkspaceId) : null;

    if (!currentWorkspaceId && validId) {
      setCurrentWorkspace(validId);
      console.log(`Restored workspace ID from localStorage: ${validId}`);
      fetchWorkspaces(validId);
    } else {
      fetchWorkspaces(currentWorkspaceId);
    }
  }, []);

  const fetchWorkspaces = async (effectiveWorkspaceId: number | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const myWorkspace = await getMyWorkspace();
      const joinedWorkspaces = await getJoinedWorkspaces();

      const mappedWorkspaces: Workspace[] = [];

      if (myWorkspace) {
        mappedWorkspaces.push({
          id: myWorkspace.id,
          name: myWorkspace.name,
          isYours: true,
          isCurrent: myWorkspace.id === effectiveWorkspaceId,
        });
      }

      const mappedJoinedWorkspaces = joinedWorkspaces.map((ws: WorkspaceDTO) => ({
        id: ws.id,
        name: ws.name,
        isYours: false,
        isCurrent: ws.id === effectiveWorkspaceId,
      }));

      mappedWorkspaces.push(...mappedJoinedWorkspaces);
      setWorkspaces(mappedWorkspaces);

      const hasValidCurrentWorkspace = mappedWorkspaces.some(ws => ws.id === effectiveWorkspaceId);

      if (!hasValidCurrentWorkspace && mappedWorkspaces.length > 0) {
        const defaultWorkspace = mappedWorkspaces.find(ws => ws.isYours) || mappedWorkspaces[0];
        setCurrentWorkspace(defaultWorkspace.id);
        localStorage.setItem('currentWorkspaceId', String(defaultWorkspace.id));
        console.log(`Set default workspace to: ID ${defaultWorkspace.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load workspaces');
      console.error('Error fetching workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentWorkspace = workspaces.find((ws) => ws.id === currentWorkspaceId);
  const yourWorkspace = workspaces.find((ws) => ws.isYours) || null;
  const joinedWorkspaces = workspaces.filter((ws) => ws.id !== currentWorkspaceId);
  const yourWorkspaces = joinedWorkspaces.filter((ws) => ws.isYours);
  const guestWorkspaces = joinedWorkspaces.filter((ws) => !ws.isYours);
  const isInYourWorkspace = currentWorkspace?.isYours ?? false;

  const handleWorkspaceSwitch = (workspaceId: number) => {
    setCurrentWorkspace(workspaceId);
    localStorage.setItem('currentWorkspaceId', String(workspaceId));
    setIsDropdownOpen(false);
    console.log(`Switched to workspace ID: ${workspaceId}`);
  };

  const getWorkspaceIcon = (name: string, isGuest: boolean) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const borderColor = isGuest ? 'border-orange-400' : 'border-purple-400';
    return (
      <div
        className={`mr-2 flex size-5 items-center justify-center rounded-full border-2 bg-gradient-to-br from-gray-800 to-gray-600 text-xs font-semibold text-white ${borderColor} shadow-sm`}
      >
        {firstLetter}
      </div>
    );
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="flex w-48 items-center justify-between rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 shadow-sm transition-all duration-300 hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-blue-600"
        id="workspace-menu-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="truncate">{currentWorkspace?.name || (isLoading ? 'Loading...' : 'No Workspaces')}</span>
        <svg
          className="ml-2 size-3 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          id="workspace-dropdown"
          className="absolute z-50 my-2 w-56 list-none divide-y divide-gray-700/50 rounded-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-xl backdrop-blur-lg dark:from-gray-900/90 dark:to-black/90"
        >
          {/* Current Workspace */}
          <div className="px-3 py-2">
            <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">
              Current Workspace
            </span>
            {isLoading ? (
              <div className="mt-1 flex items-center px-2 py-1 text-sm text-gray-400">Loading...</div>
            ) : error ? (
              <div className="mt-1 px-2 py-1 text-xs text-red-400">{error}</div>
            ) : currentWorkspace ? (
              <div className="mt-1 flex cursor-default items-center px-2 py-1 text-sm text-white">
                {getWorkspaceIcon(currentWorkspace.name, !isInYourWorkspace)}
                <span className="truncate">{currentWorkspace.name}</span>
              </div>
            ) : (
              <div className="mt-1 px-2 py-1 text-xs text-gray-400">No current workspace</div>
            )}
          </div>

          {/* Your Workspaces */}
          <div className="px-3 py-2">
            <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">Your Workspaces</span>
            {yourWorkspaces.length === 0 ? (
              <div className="mt-1 px-2 py-1 text-xs text-gray-400">No other workspaces</div>
            ) : (
              <ul className="mt-1">
                {yourWorkspaces.map((workspace) => (
                  <li
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace.id)}
                    className="group relative flex cursor-pointer items-center px-2 py-1 text-sm text-white transition-transform duration-200 hover:scale-105"
                  >
                    {getWorkspaceIcon(workspace.name, false)}
                    <span className="truncate">{workspace.name}</span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Guest Workspaces */}
          {guestWorkspaces.length > 0 && (
            <div className="px-3 py-2">
              <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">Guest Workspaces</span>
              <ul className="mt-1">
                {guestWorkspaces.map((workspace) => (
                  <li
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace.id)}
                    className="group relative flex cursor-pointer items-center px-2 py-1 text-sm text-white transition-transform duration-200 hover:scale-105"
                  >
                    {getWorkspaceIcon(workspace.name, true)}
                    <span className="truncate">{workspace.name}</span>
                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 group-hover:w-full" />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Your Workspace (entry point when you're in a guest workspace) */}
          {!isInYourWorkspace && yourWorkspace && yourWorkspace.id !== currentWorkspaceId && (
            <div className="px-3 py-2">
              <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">Your Workspace</span>
              <div
                onClick={() => handleWorkspaceSwitch(yourWorkspace.id)}
                className="group relative mt-1 flex cursor-pointer items-center px-2 py-1 text-sm text-white transition-transform duration-200 hover:scale-105"
              >
                {getWorkspaceIcon(yourWorkspace.name, false)}
                <span className="truncate">{yourWorkspace.name}</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
