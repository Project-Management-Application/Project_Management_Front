import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { initFlowbite } from 'flowbite';
import { getDashboardData } from '../../services/Workspace-apis';
import { DashboardData } from '../../types/DashboardData';

const Sidebar: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initFlowbite();
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        navigate('/login'); // Redirect to login if fetch fails
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        navigate('/login'); // Redirect to login if fetch fails
      }
    };

    const handleProjectCreated = () => {
      fetchData(); // Refresh dashboard data when a project is created
    };
    window.addEventListener('projectCreated', handleProjectCreated);
    return () => {
      window.removeEventListener('projectCreated', handleProjectCreated); // Cleanup
    };
  }, [navigate]);

  if (loading) return null; // Or a loading spinner

  return (
    <aside
      id="default-sidebar"
      className="h-[calc(100vh-var(--header-height))] w-64 transition-transform"
      aria-label="Sidenav"
    >
      <div className="h-full overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white px-3 py-5 dark:border-gray-700 dark:bg-gray-800">
        {/* Workspace Header */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {dashboardData?.workspace.name || 'Workspace'}
          </div>
        </div>

        {/* Main Navigation */}
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard/projects" // Updated route
              className={`group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                location.pathname === '/dashboard/projects'
                  ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                  : ''
              }`}
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
                className={`mr-3 ${
                  location.pathname === '/dashboard/projects'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-300'
                }`}
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              <span>Projects</span>
            </Link>
          </li>
          <li>
          <Link
    to="/dashboard/members"
    className={`group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
      location.pathname === '/dashboard/members' // Fixed condition
        ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
        : ''
    }`}
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
                className={`mr-3 ${
                  location.pathname === '/members'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-300'
                }`}
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Members</span>
            </Link>
          </li>
        </ul>

        {/* Workspace Views */}
        <div className="mt-4 border-t pt-4">
          <div className="mb-2 px-2 text-xs font-semibold text-gray-400 dark:text-gray-300">
            Workspace Views
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/table"
                className={`group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                  location.pathname === '/table'
                    ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                    : ''
                }`}
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
                  className={`mr-3 ${
                    location.pathname === '/table'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-300'
                  }`}
                >
                  <path d="M12 3v18" />
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M3 15h18" />
                </svg>
                <span>Table</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={`group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                  location.pathname === '/calendar'
                    ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                    : ''
                }`}
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
                  className={`mr-3 ${
                    location.pathname === '/calendar'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-gray-300'
                  }`}
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>Calendar</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Your Boards */}
        <div className="mt-4 border-t pt-4">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-300">
              Your Boards
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
                className="text-gray-400 dark:text-gray-300"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            {dashboardData?.projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/board/${project.id}`}
                  className={`group flex items-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                    location.pathname === `/board/${project.id}`
                      ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                      : ''
                  }`}
                >
                  <span
                    className="mr-3 size-6 rounded"
                    style={{
                      background: project.backgroundImage
                        ? `url(${project.backgroundImage}) center/cover`
                        : project.backgroundColor
                        ? project.backgroundColor
                        : project.modelId && project.modelBackgroundImage
                        ? `url(${project.modelBackgroundImage}) center/cover`
                        : 'bg-gray-100 dark:bg-gray-700',
                    }}
                  ></span>
                  <span>{project.name}</span>
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
              <span className="ml-3 text-white dark:text-white">Try Premium</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;