import React, { useState, useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import taskifyLogo from '../../assets/images/taskify-logo.png'; 
import userAvatar from '../../assets/images/user.jpg'; 

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });
  const [, setIsSidebarOpen] = useState<boolean>(true);

  // Initialize Flowbite components
  useEffect(() => {
    initFlowbite();
  }, []);

  // Sync dark mode with document and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Toggle sidebar visibility
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

  const notifications = [
    { id: 1, message: 'New task assigned', time: '5 minutes ago', read: false },
    { id: 2, message: 'Project meeting at 2 PM', time: '30 minutes ago', read: true },
    { id: 3, message: 'Board updated', time: 'Yesterday', read: true },
  ];

  return (
    <header className="antialiased">
      <nav className="border-b border-gray-300 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center justify-start">
            {/* Sidebar Toggle */}
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

            {/* Logo */}
            <a href="/" className="ml-4 mr-6 flex items-center">
              <img
                src={taskifyLogo}
                className="mr-3 h-6 sm:h-9"
                alt="Taskify Logo"
              />
              <span className="self-center whitespace-nowrap text-xl font-bold dark:text-white">
                Taskify
              </span>
            </a>

            {/* Search Bar */}
            <form action="#" method="GET" className="pl-2">
              <label htmlFor="topbar-search" className="sr-only">
                Search
              </label>
              <div className="relative w-96">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="size-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="topbar-search"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-9 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
                  placeholder="Search projects"
                />
              </div>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center">
        

            {/* Notifications Button */}
            <button
              type="button"
              className="relative mr-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              id="notifications-button"
              data-dropdown-toggle="notifications-dropdown"
            >
              <span className="sr-only">Notifications</span>
              <svg
                className="size-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {notifications.some((n) => !n.read) && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div
              id="notifications-dropdown"
              className="z-50 my-4 hidden w-72 list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
            >
              <div className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-400">
                Notifications
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 ${
                      !notification.read
                        ? 'bg-gray-100 dark:bg-gray-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="shrink-0">
                        <svg
                          className={`size-5 ${
                            !notification.read
                              ? 'text-blue-500'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div className="ml-3 w-full">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#"
                className="block py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
              >
                View All Notifications
              </a>
            </div>

            {/* User Menu Button */}
            <button
              type="button"
              className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="dropdown"
            >
              <span className="sr-only">Open User Menu</span>
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-white">
                <img
                  src={userAvatar} // Use imported variable
                  alt="User Avatar"
                  className="size-full rounded-full"
                />
              </div>
            </button>

            {/* User Dropdown */}
            <div
              className="z-50 my-4 hidden w-64 list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
              id="dropdown"
            >
              {/* Account Section */}
              <div className="px-4 py-3">
                <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                  User
                </span>
                <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                  user@gmail.com
                </span>
              </div>
              <ul className="py-1">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Switch Account
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Manage Account
                  </a>
                </li>
              </ul>
              {/* Settings Section */}
              <ul className="py-1">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
              </ul>
              {/* Theme Section */}
              <ul className="py-1">
                <li className="px-4 py-2">
                  <span className="block text-sm text-gray-700 dark:text-gray-400">Theme</span>
                  <div className="mt-2 space-y-2">
                    <button
                      onClick={() => toggleDarkMode('light')}
                      className="flex w-full items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <input
                        type="radio"
                        name="theme"
                        checked={!isDarkMode}
                        onChange={() => toggleDarkMode('light')}
                        className="mr-2"
                      />
                      <svg
                        className="size-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 10 2Zm0 13a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5ZM15.258 4.742a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1-0.707.707l-.707-.707a.5.5 0 0 1 0-.707Zm-10.516 10.516a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1-.707.707l-.707-.707a.5.5 0 0 1 0-.707ZM17.5 9.5h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1Zm-13 0h-1a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1ZM15.258 15.258a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 0 1 .707.707l-.707.707a.5.5 0 0 1-.707 0Zm-10.516-10.516a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 0 1 .707.707l-.707.707a.5.5 0 0 1-.707 0ZM10 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-400">Light</span>
                    </button>
                    <button
                      onClick={() => toggleDarkMode('dark')}
                      className="flex w-full items-center rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <input
                        type="radio"
                        name="theme"
                        checked={isDarkMode}
                        onChange={() => toggleDarkMode('dark')}
                        className="mr-2"
                      />
                      <svg
                        className="size-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-400">Dark</span>
                    </button>
                  </div>
                </li>
              </ul>
              {/* Bottom Section */}
              <ul className="py-1">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;