// components/CreateProjectModal.tsx
import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import ProjectDetailsForm from './ProjectDetailsForm';
import ProjectTemplateSelector from './ProjectTemplateSelector';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [step, setStep] = useState<'initial' | 'template' | 'scratch' | 'details'>('initial');
  const [selectedModel, setSelectedModel] = useState<number | null>(null);

  const handleTemplateSelect = () => setStep('template');
  const handleScratchSelect = () => setStep('scratch');
  const handleBackToInitial = () => setStep('initial');
  const handleModelSelected = (modelId: number) => {
    setSelectedModel(modelId);
    setStep('details');
  };

  const handleProjectCreated = () => {
    onProjectCreated();
    setStep('initial');
    setSelectedModel(null);
    onClose();
  };

  // Determine the progress percentage based on current step
  const getProgressPercentage = () => {
    switch (step) {
      case 'initial': return 0;
      case 'template': case 'scratch': return 50;
      case 'details': return 75;
      default: return 0;
    }
  };

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="2xl"
      className="animate-fade-in"
    >
      <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Modal Header with progress bar */}
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-in-out" 
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {step === 'initial' && 'Create New Project'}
                  {step === 'template' && 'Choose a Template'}
                  {(step === 'scratch' || step === 'details') && 'Project Details'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step === 'initial' && 'Get started with your new idea'}
                  {step === 'template' && 'Find the perfect starting point'}
                  {(step === 'scratch' || step === 'details') && 'Customize your project'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="group rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6 pb-8">
          {step === 'initial' && (
            <div className="animate-fade-in space-y-8">
              <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                Choose how you'd like to begin your project journey
              </p>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Template Card */}
                <div 
                  onClick={handleTemplateSelect}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    <svg className="size-full p-8 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Use a Template</h4>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">Get started quickly with pre-built project templates tailored to your needs.</p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400">
                      <span className="font-medium">Explore templates</span>
                      <svg className="ml-2 size-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Scratch Card */}
                <div 
                  onClick={handleScratchSelect}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-green-500 to-teal-600">
                    <svg className="size-full p-8 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="p-5">
                    <h4 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Start from Scratch</h4>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">Create a completely custom project with your own unique specifications.</p>
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <span className="font-medium">Create blank project</span>
                      <svg className="ml-2 size-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {step === 'template' && (
            <ProjectTemplateSelector
              onSelect={handleModelSelected}
              onBack={handleBackToInitial}
            />
          )}
          
          {(step === 'scratch' || step === 'details') && (
            <ProjectDetailsForm
              modelId={selectedModel}
              onBack={step === 'scratch' ? handleBackToInitial : () => setStep('template')}
              onSubmit={handleProjectCreated}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;