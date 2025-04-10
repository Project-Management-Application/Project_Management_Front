/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import taskifyLogo from '../../../assets/images/taskify-logo.png';
import Toast from '../../UI/Toast';
import UserMenu from './UserMenu';
import Notifications from './Notifications';
import Invitations from './Invitations';
import WorkspaceList from './WorkspaceList'; // New import

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });
  const [, setIsSidebarOpen] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<number>(1); // Default to "My Workspace"

  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    const sidebar = document.getElementById('default-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
    }
  };

  const toggleDarkMode = (mode: 'light' | 'dark') => {
    setIsDarkMode(mode === 'dark');
  };

  const addToast = (message: string, type: 'success' | 'error') => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <header className="antialiased">
      <nav className="border-b border-gray-300 bg-white px-4 py-2.5 lg:px-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center justify-start">
            <button
              id="toggleSidebar"
              onClick={toggleSidebar}
              className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                className="size-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h14M1 6h14M1 11h7"
                />
              </svg>
            </button>

            <a href="/" className="ml-4 mr-6 flex items-center">
              <img src={taskifyLogo} className="mr-3 h-6 sm:h-9" alt="Taskify Logo" />
              <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white">
                Taskify
              </span>
            </a>

            {/* Replaced search input with WorkspaceList */}
            <WorkspaceList
              currentWorkspaceId={currentWorkspaceId}
              setCurrentWorkspace={setCurrentWorkspaceId}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center">
            <Invitations addToast={addToast} />
            <Notifications />
            <UserMenu isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </nav>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
            duration={3000}
          />
        ))}
      </div>
    </header>
  );
};

export default Header;