/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { getWorkspaceMembers } from '../../../services/Workspace-apis';
import { inviteMemberToProject } from '../../../services/project-apis';
import Toast from '../../UI/Toast';

interface InviteMemberModalProps {
  projectId: number;
  workspaceId: number;
  onClose: () => void;
}

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface ToastData {
  message: string;
  type: 'success' | 'error';
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ projectId, workspaceId, onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [workspaceMembers, setWorkspaceMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      setFetchingMembers(true);
      try {
        const members = await getWorkspaceMembers(workspaceId);
        setWorkspaceMembers(members);
      } catch (err) {
        console.error('Failed to load workspace members', err);
      } finally {
        setFetchingMembers(false);
      }
    };
    fetchWorkspaceMembers();
  }, [workspaceId]);

  const handleInvite = async () => {
    if (!email.trim()) {
      setToast({
        message: 'Please enter an email address',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await inviteMemberToProject(projectId, email, role);
      setToast({
        message: `Invitation sent to ${email}`,
        type: 'success'
      });
      setEmail(''); // Clear email input after success
      setTimeout(() => {
        onClose();
      }, 2000); // Close modal after 2 seconds
    } catch (err: any) {
      setToast({
        message: err.message || 'Failed to send invitation',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={handleCloseToast} 
        />
      )}
      
      <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="animate-slideIn w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-2xl transition-all duration-300">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Share Project</h2>
            <button 
              onClick={onClose} 
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              aria-label="Close"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Invite Form */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address or name"
                className="flex-1 rounded-md border border-gray-600 bg-gray-700 px-4 py-3 text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Email address"
              />
              <div className="relative inline-block">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none rounded-md border border-gray-600 bg-gray-700 px-4 py-3 pr-10 text-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select role"
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="EDITOR">Editor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleInvite}
              disabled={loading}
              className="w-full rounded-md bg-blue-600 px-4 py-3 text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Invite member"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending...</span>
                </div>
              ) : (
                'Share'
              )}
            </button>
          </div>

          {/* Workspace Members Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium text-gray-300">Workspace members</h3>
              <span className="text-sm text-gray-400">{workspaceMembers.length}</span>
            </div>
            
            <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
              {fetchingMembers ? (
                <div className="flex justify-center py-4">
                  <svg className="size-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : workspaceMembers.length === 0 ? (
                <p className="py-4 text-center text-gray-400">No workspace members found</p>
              ) : (
                workspaceMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-700/40 p-3 transition-colors hover:bg-gray-700/60"
                    onClick={() => setEmail(member.email)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                        {member.firstName.charAt(0).toUpperCase()}{member.lastName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.firstName} {member.lastName}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="rounded-md bg-blue-600/20 px-3 py-1 text-sm text-blue-400 transition-colors hover:bg-blue-600/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmail(member.email);
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteMemberModal;
