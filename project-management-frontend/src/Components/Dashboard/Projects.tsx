/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardData } from '../../services/Workspace-apis';
import { DashboardData } from '../../types/DashboardData';
import CreateProjectModal from '../Project/CreateProjectModal';

const Projects: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'created'>('recent');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      navigate('/login');
    }
  };

  const getBoardStyle = (project: DashboardData['projects'][0]) => {
    if (project.backgroundImage) {
      return { background: `url(${project.backgroundImage}) center/cover no-repeat` };
    }
    if (project.backgroundColor) {
      return { backgroundColor: project.backgroundColor };
    }
    if (project.modelId && project.modelBackgroundImage) {
      return { background: `url(${project.modelBackgroundImage}) center/cover no-repeat` };
    }
    return { backgroundColor: '#e5e7eb' }; // Tailwind gray-200
  };

  const handleProjectCreated = () => {
    fetchData(); // Refresh the project list after creation
  };

  // Filter and sort projects
  const filteredProjects = dashboardData?.projects
    .filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((project) =>
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && project.visibility === 'PUBLIC') ||
      (visibilityFilter === 'private' && project.visibility === 'PRIVATE')
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'created') return (a.createdAt || '').localeCompare(b.createdAt || '');
      return 0; // 'recent' can be refined with a timestamp if available
    }) || [];

  if (loading) {
    return (
      <div className="animate-pulse p-6">
        <div className="mb-6 h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Workspace Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-700 text-white">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H9m-6 0h2" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            {dashboardData?.workspace.name || 'My Workspace'}
          </h1>
        </div>
      
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row sm:items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'name' | 'created')}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:w-48"
          >
            <option value="recent">Sort by: Most Recent</option>
            <option value="name">Sort by: Name</option>
            <option value="created">Sort by: Creation Date</option>
          </select>
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value as 'all' | 'public' | 'private')}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 sm:w-48"
          >
            <option value="all">Filter by: All</option>
            <option value="public">Filter by: Public</option>
            <option value="private">Filter by: Private</option>
          </select>
        </div>
        <div className="relative w-full sm:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 transition-all duration-200 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Search projects..."
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Create New Project Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative flex h-40 items-center justify-center rounded-lg bg-blue-700 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <div className="text-center">
            <svg className="mx-auto mb-2 size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Create a New Project</span>
          </div>
          <div className="absolute inset-0 rounded-lg border-2 border-transparent transition-all duration-300 group-hover:border-blue-500"></div>
        </button>

        {/* Existing Projects */}
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-8 text-center">
            <svg className="mx-auto mb-3 size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">No projects found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setVisibilityFilter('all');
              }}
              className="mt-2 text-blue-700 hover:underline dark:text-blue-400"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/board/${project.id}`}
              className="group relative h-40 overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={getBoardStyle(project)}
              />
              <div className="relative flex h-full items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex w-full items-center justify-between">
                  <span className="text-lg font-semibold text-white drop-shadow-md">
                    {project.name}
                  </span>
                  <span className="flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                    {project.visibility === 'PUBLIC' ? (
                      <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="mr-1 size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {project.visibility === 'PUBLIC' ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Projects;