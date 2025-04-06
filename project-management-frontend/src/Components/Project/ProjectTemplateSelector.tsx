import React, { useState, useEffect } from 'react';
import { getAllModels } from '../../services/models-apis';
import { ProjectModel } from '../../types/ProjectModel';

interface ProjectTemplateSelectorProps {
  onSelect: (modelId: number) => void;
  onBack: () => void;
}

const ProjectTemplateSelector: React.FC<ProjectTemplateSelectorProps> = ({ onSelect, onBack }) => {
  const [models, setModels] = useState<ProjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getAllModels();
        setModels(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load templates');
        setLoading(false);
      }
    };
    fetchModels();
  }, []);

  const handleNext = () => {
    if (selectedModel !== null) {
      onSelect(selectedModel);
    }
  };

  // Filter models based on search term
  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Skeleton loading UI
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="size-16 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
        <svg className="mx-auto mb-2 size-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mb-1 text-lg font-medium text-red-800 dark:text-red-200">{error}</h3>
        <p className="text-red-600 dark:text-red-300">Please try again later or contact support.</p>
        <button
          onClick={onBack}
          className="mt-4 rounded-full bg-red-100 px-4 py-2 font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Search and filter bar */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="size-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-4 pl-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500"
          placeholder="Search templates..."
        />
      </div>

      {/* No results message */}
      {filteredModels.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <svg className="mx-auto mb-3 size-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No templates match your search</p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Template cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredModels.map((model) => (
          <div
            key={model.id}
            onClick={() => setSelectedModel(model.id)}
            className={`group cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800 ${
              selectedModel === model.id 
                ? 'border-blue-500 ring-2 ring-blue-500/20' 
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div 
              className="aspect-video bg-cover bg-center" 
              style={{ backgroundImage: `url(${model.backgroundImage})` }}
            >
              {selectedModel === model.id && (
                <div className="flex size-full items-center justify-center bg-blue-500/20 backdrop-blur-sm">
                  <div className="rounded-full bg-blue-600 p-2 text-white">
                    <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{model.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">{model.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={selectedModel === null}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:from-blue-500 dark:to-blue-700"
        >
          Continue
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProjectTemplateSelector;