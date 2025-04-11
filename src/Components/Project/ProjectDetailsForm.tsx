/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { getBackgroundImages } from '../../services/models-apis';
import { backgroundOptions } from '../../utils/backgroundColors';
import { ProjectFormData } from '../../types/project';
import { getDashboardData } from '../../services/Workspace-apis';
import { createProject } from '../../services/project-apis';
import Toast from '../UI/Toast';

interface ProjectDetailsFormProps {
  modelId: number | null;
  onBack: () => void;
  onSubmit: () => void;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({ modelId, onBack, onSubmit }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    visibility: 'PUBLIC',
  });
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'colors'>('images');
  const [loadingImages, setLoadingImages] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchWorkspaceId = async () => {
      try {
        const dashboardData = await getDashboardData();
        setWorkspaceId(dashboardData.workspace.id);
      } catch (err) {
        setError('Unable to load workspace data');
      }
    };

    fetchWorkspaceId();

    if (!modelId) {
      const fetchImages = async () => {
        setLoadingImages(true);
        try {
          const images = await getBackgroundImages();
          setBackgroundImages(images);
          if (images.length > 0) {
            setSelectedBackground(images[0]);
          }
        } catch (err) {
          console.error('Failed to load background images:', err);
        } finally {
          setLoadingImages(false);
        }
      };
      fetchImages();
    }
  }, [modelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!workspaceId) {
      setError('Workspace ID is not available');
      setIsSubmitting(false);
      setToast({ message: 'Workspace ID is missing', type: 'error' });
      return;
    }

    const projectData = {
      ...formData,
      workspaceId,
      modelId: modelId || null,
      backgroundImage: modelId ? null : selectedBackground || null,
      backgroundColor: modelId ? null : (!selectedBackground && selectedColor ? selectedColor : null),
    };

    try {
      await createProject(projectData);
      setToast({ message: 'Project created successfully!', type: 'success' });
      window.dispatchEvent(new Event('projectCreated')); // Dispatch event to refresh Sidebar
      setTimeout(() => {
        onSubmit(); // Call onSubmit after showing the toast
      }, 3000); // Delay to allow toast visibility
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create project';
      setToast({ message: errorMessage, type: 'error' });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated Project Preview component
  const ProjectPreview = () => {
    let bgStyle = {};
    if (selectedBackground) {
      bgStyle = {
        backgroundImage: `url(${selectedBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    } else if (selectedColor) {
      bgStyle = {
        background: selectedColor, // Use 'background' to support gradients
      };
    } else {
      bgStyle = { backgroundColor: '#f3f4f6' };
    }

    return (
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700">
        <div className="aspect-video w-full" style={bgStyle as any}>
          <div className="flex size-full items-start gap-4 p-6">
            {/* Placeholder Card 1 */}
            <div className="w-1/3 rounded-lg bg-white/90 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-600"></div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-700"></div>
                <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-700"></div>
                <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-700"></div>
              </div>
            </div>
            {/* Placeholder Card 2 */}
            <div className="w-1/3 rounded-lg bg-white/90 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
              <div className="mb-2 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-600"></div>
              <div className="space-y-2">
                <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-700"></div>
                <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-700"></div>
              </div>
            </div>
            {/* Placeholder Card 3 */}
            <div className="w-1/3 rounded-lg bg-white/90 p-4 shadow-md backdrop-blur-sm dark:bg-gray-800/90">
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-600"></div>
              <div className="space-y-2">
                <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-700"></div>
                <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-700"></div>
                <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="animate-fade-in space-y-6">
        {/* Live Preview */}
        <ProjectPreview />

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            <svg className="size-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {!modelId && (
            <div className="space-y-4">
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Background
              </label>
              {/* Tabs */}
              <div className="flex w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('images')}
                  className={`flex w-1/2 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition-all duration-300 ${
                    activeTab === 'images'
                      ? 'bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Images
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('colors')}
                  className={`flex w-1/2 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition-all duration-300 ${
                    activeTab === 'colors'
                      ? 'bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400'
                      : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Colors
                </button>
              </div>

              {/* Background Options */}
              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                {activeTab === 'images' && (
                  <div className="space-y-4">
                    {loadingImages ? (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="aspect-video animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                        ))}
                      </div>
                    ) : backgroundImages.length === 0 ? (
                      <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                        No background images available
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {backgroundImages.map((image, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedBackground(image);
                              setSelectedColor(null);
                            }}
                            className={`group relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                              selectedBackground === image
                                ? 'border-blue-500 ring-2 ring-blue-500/20'
                                : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Background ${index + 1}`}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {selectedBackground === image && (
                              <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 transition-opacity duration-300">
                                <div className="rounded-full bg-blue-600 p-1 text-white">
                                  <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'colors' && (
                  <div className="grid grid-cols-5 gap-3 sm:grid-cols-8">
                    {backgroundOptions.map((color, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedColor(color);
                          setSelectedBackground(null);
                        }}
                        className={`group aspect-square cursor-pointer rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          selectedColor === color
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        style={{ background: color }}
                      >
                        {selectedColor === color && (
                          <div className="flex size-full items-center justify-center">
                            <div className="rounded-full bg-white p-1 text-blue-600 shadow-sm">
                              <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="size-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                placeholder="My Awesome Project"
                required
              />
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Description
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-3">
                <svg className="size-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </div>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-gray-900 shadow-sm transition-all focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                placeholder="Describe your project in a few words..."
                rows={3}
              />
            </div>
          </div>

          {/* Visibility Option */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Visibility
            </label>
            <div className="flex w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visibility: 'PUBLIC' })}
                className={`flex w-1/2 items-center justify-center gap-2 rounded-md px-4 py-3 transition-all duration-300 ${
                  formData.visibility === 'PUBLIC'
                    ? 'bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400'
                    : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Public
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visibility: 'PRIVATE' })}
                className={`flex w-1/2 items-center justify-center gap-2 rounded-md px-4 py-3 transition-all duration-300 ${
                  formData.visibility === 'PRIVATE'
                    ? 'bg-white text-amber-600 shadow-md dark:bg-gray-700 dark:text-amber-400'
                    : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <button
            type="submit"
            disabled={!formData.name || isSubmitting}
            className="relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:from-blue-500 dark:to-blue-700"
          >
            {isSubmitting ? (
              <>
                <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Project...
              </>
            ) : (
              <>
                Create Project
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetailsForm;