import React, { useState } from 'react';
import { createWorkspace } from '../../services/Workspace-apis';
import { Button, TextInput } from 'flowbite-react';
import { motion } from 'framer-motion';

interface SetupWorkspaceProps {
  onNext: () => void;
  onWorkspaceCreated: (id: number) => void;
  setLoading: (loading: boolean) => void;
}

const SetupWorkspace: React.FC<SetupWorkspaceProps> = ({ onWorkspaceCreated, setLoading }) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState('');

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      setError('Workspace name cannot be empty');
      return;
    }

    try {
      setLoading(true); // Start loading
      const response = await createWorkspace(workspaceName);
      onWorkspaceCreated(response.id); // This will call handleWorkspaceCreated, which sets loading to false
    } catch (err) {
      setError('Failed to create workspace. Please try again.');
      setLoading(false); // Stop loading on error
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-4xl font-extrabold tracking-tight text-white">Create Your Workspace</h2>
      <p className="text-gray-300">
        A workspace is where your team will collaborate on projects.
      </p>
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border-l-4 border-red-500 bg-red-900/50 p-4 text-red-300 backdrop-blur-sm"
          role="alert"
        >
          <p>{error}</p>
        </motion.div>
      )}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <TextInput
          type="text"
          value={workspaceName}
          onChange={(e) => {
            setWorkspaceName(e.target.value);
            if (e.target.value.trim()) setError('');
          }}
          placeholder="e.g., My Team Workspace"
          className="w-full rounded-lg border-gray-600 bg-gray-700/50 text-white shadow-inner placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
        />
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleCreateWorkspace}
          disabled={!workspaceName.trim()}
          className={`w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-semibold text-white shadow-lg transition-all ${
            !workspaceName.trim() ? 'cursor-not-allowed opacity-50' : 'hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          Create Workspace
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SetupWorkspace;