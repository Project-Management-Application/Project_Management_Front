import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { motion } from 'framer-motion';
import { inviteUser } from '../../services/Workspace-apis';

interface InviteMembersProps {
  workspaceId: number | null;
}

const InviteMembers: React.FC<InviteMembersProps> = ({ workspaceId }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!email.trim()) {
      setError('Email cannot be empty');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!workspaceId) {
      setError('Workspace ID is missing');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      await inviteUser(workspaceId, email);
      setSuccess('Invitation sent successfully!');
      setEmail(''); // Clear the input after success
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-4xl font-extrabold tracking-tight text-white">Invite Team Members</h2>
      <p className="text-gray-300">
        Invite your team to collaborate in your new workspace.
      </p>

      {/* Success Toast */}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border-l-4 border-blue-500 bg-gray-800/50 p-4 text-blue-200 backdrop-blur-sm"
          role="alert"
        >
          <p>{success}</p>
        </motion.div>
      )}

      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border-l-4 border-red-500 bg-gray-800/50 p-4 text-red-200 backdrop-blur-sm"
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
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
            setSuccess('');
          }}
          placeholder="e.g., teammate@example.com"
          className="w-full rounded-lg border-gray-600 bg-gray-700/50 text-white shadow-inner placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoading}
        />
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleInvite}
          disabled={isLoading || !email.trim()}
          className={`w-full rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 text-lg font-semibold text-white shadow-lg transition-all ${
            isLoading || !email.trim() ? 'cursor-not-allowed opacity-50' : 'hover:from-blue-600 hover:to-blue-500'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="mr-2 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </div>
          ) : (
            'Send Invite'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default InviteMembers;