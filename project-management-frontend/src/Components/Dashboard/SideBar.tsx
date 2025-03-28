import React from 'react';
import { Link } from 'react-router-dom';
import { initFlowbite } from 'flowbite';

const Sidebar: React.FC = () => {
  React.useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <aside
      id="default-sidebar"
      className="h-[calc(100vh-var(--header-height))] w-64 transition-transform"
      aria-label="Sidenav"
    >
    <div
  className="h-full overflow-y-auto overflow-x-hidden border-r border-gray-200 
  bg-white px-3 py-5 
  dark:border-gray-700 dark:bg-gray-800"
>
        {/* Workspace Header */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Espace de travail de user
          </div>
        </div>

        {/* Main Navigation */}
        <ul className="space-y-2">
          <li>
            <Link
              to=""
              className="group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-layout-dashboard mr-3 text-gray-400 dark:text-gray-300"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Projets</span>
            </Link>
          </li>
          <li>
            <Link
              to="/members"
              className="group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-users mr-3 text-gray-400 dark:text-gray-300"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Membres</span>
            </Link>
          </li>
        </ul>

        {/* Workspace Views */}
        <div className="mt-4 border-t pt-4">
          <div className="mb-2 px-2 text-xs font-semibold text-gray-400 dark:text-gray-300">
            Vues de l'espace de travail
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/table"
                className="group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-table mr-3 text-gray-400 dark:text-gray-300"
                >
                  <path d="M12 3v18" />
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                </svg>
                <span>Tableau</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-calendar mr-3 text-gray-400 dark:text-gray-300"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>Calendrier</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Your Boards */}
        <div className="mt-4 border-t pt-4">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-300">
              Vos tableaux
            </span>
            <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            {[
              
              { name: 'Ville virtuelle', color: 'bg-gray-100 dark:bg-gray-700' },
              { name: 'Tableau Agile', color: 'bg-gray-100 dark:bg-gray-700' },
              { name: 'Ville virtuelle', color: 'bg-gray-100 dark:bg-gray-700' },
            
            ].map((board) => (
              <li key={board.name}>
                <Link
                  to={`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span className={`mr-3 size-6 rounded ${board.color}`}></span>
                  <span>{board.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <ul className="mt-5 space-y-2 border-t border-gray-200 pt-5 dark:border-gray-700">
          <li>
            <a
              href="#"
              className="group flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-base font-normal text-white transition duration-75 hover:bg-gray-100 dark:from-purple-500 dark:to-pink-500 dark:hover:bg-gray-700"
            >
              <svg
                aria-hidden="true"
                className="size-6 shrink-0 text-white transition duration-75 group-hover:text-white dark:text-white dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-3 text-white dark:text-white">Essayer Premium</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;