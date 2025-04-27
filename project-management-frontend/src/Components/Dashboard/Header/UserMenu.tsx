import React from 'react';
import userAvatar from '../../../assets/images/user.jpg';

interface UserMenuProps {
  isDarkMode: boolean;
  toggleDarkMode: (mode: 'light' | 'dark') => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        className="flex rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        id="user-menu-button"
        aria-expanded="false"
        data-dropdown-toggle="dropdown"
      >
        <span className="sr-only">Open User Menu</span>
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-white">
          <img src={userAvatar} alt="User Avatar" className="size-full rounded-full" />
        </div>
      </button>

      <div
        className="z-50 my-4 hidden w-64 list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
        id="dropdown"
      >
        <div className="px-4 py-3">
          <span className="block text-sm font-semibold text-gray-900 dark:text-white">User</span>
          <span className="block truncate text-sm text-gray-500 dark:text-gray-400">user@gmail.com</span>
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
  );
};

export default UserMenu;