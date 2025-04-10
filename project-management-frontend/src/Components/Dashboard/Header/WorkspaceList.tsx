import React from 'react';

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

// Mock data (replace with API call later)
const workspaces: Workspace[] = [
  { id: 1, name: 'My Workspace', isYours: true, isCurrent: true },
  { id: 2, name: 'Team Project', isYours: false, isCurrent: false },
  { id: 3, name: 'Client Collab', isYours: false, isCurrent: false },
];

const WorkspaceList: React.FC<WorkspaceListProps> = ({ currentWorkspaceId, setCurrentWorkspace }) => {
  const currentWorkspace = workspaces.find((ws) => ws.id === currentWorkspaceId);
  const yourWorkspace = workspaces.find((ws) => ws.isYours);
  const joinedWorkspaces = workspaces.filter((ws) => ws.id !== currentWorkspaceId);
  const yourWorkspaces = joinedWorkspaces.filter((ws) => ws.isYours);
  const guestWorkspaces = joinedWorkspaces.filter((ws) => !ws.isYours);
  const isInYourWorkspace = currentWorkspace?.isYours;

  const handleWorkspaceSwitch = (workspaceId: number) => {
    setCurrentWorkspace(workspaceId);
    console.log(`Switched to workspace ID: ${workspaceId}`);
    // Fetch projects with visibility logic:
    // - Public projects: always visible
    // - Private projects: visible if user is a member (simulated)
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
        data-dropdown-toggle="workspace-dropdown"
      >
        <span className="truncate">{currentWorkspace?.name || 'Select Workspace'}</span>
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

      <div
        id="workspace-dropdown"
        className="z-50 my-2 hidden w-56 list-none divide-y divide-gray-700/50 rounded-xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 shadow-xl backdrop-blur-lg dark:from-gray-900/90 dark:to-black/90"
      >
        {/* Section 1: Current Workspace */}
        <div className="px-3 py-2">
          <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">
            Current Workspace
          </span>
          <div className="mt-1 flex cursor-default items-center px-2 py-1 text-sm text-white">
            {getWorkspaceIcon(currentWorkspace?.name || 'S', !isInYourWorkspace)}
            <span className="truncate">{currentWorkspace?.name}</span>
          </div>
        </div>

        {/* Section 2: Your Workspaces */}
        <div className="px-3 py-2">
          <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">
            Your Workspaces
          </span>
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

        {/* Section 3: Guest Workspaces */}
        {guestWorkspaces.length > 0 && (
          <div className="px-3 py-2">
            <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">
              Guest Workspaces
            </span>
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

        {/* Section 4: Your Workspace (only shown when NOT in your workspace) */}
        {!isInYourWorkspace && yourWorkspace && yourWorkspace.id !== currentWorkspaceId && (
          <div className="px-3 py-2">
            <span className="block text-xs font-semibold text-gray-300 dark:text-gray-200">
              Your Workspace
            </span>
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
    </div>
  );
};

export default WorkspaceList;