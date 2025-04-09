import React from 'react';

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  { id: 1, message: 'New task assigned', time: '5 minutes ago', read: false },
  { id: 2, message: 'Project meeting at 2 PM', time: '30 minutes ago', read: true },
  { id: 3, message: 'Board updated', time: 'Yesterday', read: true },
];

const Notifications: React.FC = () => {
  return (
    <div className="flex items-center">
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
                      !notification.read ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="ml-3 w-full">
                  <div className="text-sm text-gray-900 dark:text-white">{notification.message}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</div>
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
    </div>
  );
};

export default Notifications;