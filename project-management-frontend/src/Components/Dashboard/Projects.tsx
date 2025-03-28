import React from 'react';
import { Link } from 'react-router-dom';

const Projects: React.FC = () => {
  // Sample board data (you can replace this with dynamic data later)
  const boards = [
    { name: 'Modèle KANBAN', bgClass: 'bg-gradient-to-r from-cyan-500 to-teal-500', isPrivate: true },
    { name: 'Tableau Agile', bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-500', isPrivate: false },
    { name: 'Hackathon Planning-Management', bgClass: 'bg-blue-600', isPrivate: true },
    { name: 'Tableau Agile', bgClass: 'bg-gradient-to-r from-blue-500 to-indigo-500', isPrivate: false },
    { name: 'Vision Globale de l’Entreprise', bgClass: 'bg-gray-300', isPrivate: true },
    { name: 'Virtual city', bgClass: 'bg-gradient-to-r from-blue-600 to-blue-800', isPrivate: false },
  ];

  return (
    <div className="p-6">
      {/* Workspace Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          
        </div>
        <button
          type="button"
          className="flex items-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <svg
            className="mr-2 size-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          Inviter des membres de l'espace de travail
        </button>
      </div>

      {/* Boards Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          {/* Filters (Sort by and Filter by) */}
          <div className="flex items-center space-x-3">
            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              >
                <option>Trier par : Plus récent</option>
                <option>Trier par : Nom</option>
                <option>Trier par : Date de création</option>
              </select>
            </div>

            {/* Filter By Dropdown */}
            <div className="relative">
              <select
                className="block w-48 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              >
                <option>Filtrer par : Tous</option>
                <option>Filtrer par : Public</option>
                <option>Filtrer par : Privé</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="size-5 text-gray-500 dark:text-gray-400"
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder="Rechercher des projets..."
            />
          </div>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Create New Board Tile */}
          <div className="relative flex h-40 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Créer un nouveau projet
              </p>
            
            </div>
          </div>

          {/* Existing Boards */}
          {boards.map((board, index) => (
            <Link
              key={index}
              to={`/board/${board.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="relative h-40 rounded-lg shadow"
            >
              <div
                className={`size-full rounded-lg ${board.bgClass} flex items-end p-4`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-lg font-semibold text-white">
                    {board.name}
                  </span>
                  {board.isPrivate && (
                    <svg
                      className="size-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;