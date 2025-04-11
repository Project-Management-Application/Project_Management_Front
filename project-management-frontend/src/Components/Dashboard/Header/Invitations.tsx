/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { getPendingInvitations, acceptInvitation, rejectInvitation } from '../../../services/Workspace-apis';
import { getPendingProjectInvitations, acceptProjectInvitation, declineProjectInvitation } from '../../../services/project-apis';
import { WorkspaceInvitation, ProjectInvitation } from '../../../types/Invitations';
import InvitationModal from '../../UI/InvitationModal';

interface InvitationsProps {
  addToast: (message: string, type: 'success' | 'error') => void;
}

const Invitations: React.FC<InvitationsProps> = ({ addToast }) => {
  const [workspaceInvitations, setWorkspaceInvitations] = useState<WorkspaceInvitation[]>([]);
  const [projectInvitations, setProjectInvitations] = useState<ProjectInvitation[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<{
    type: 'workspace' | 'project';
    id: number;
    name: string;
    role?: string;
    invitedBy?: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'accept' | 'reject' | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchInvitations();

    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Handle keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchInvitations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [workspaceInvs, projectInvs] = await Promise.all([
        getPendingInvitations(),
        getPendingProjectInvitations(),
      ]);
      setWorkspaceInvitations(workspaceInvs);
      setProjectInvitations(projectInvs);
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.message || 'Failed to load invitations');
      addToast('Failed to load invitations', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitationClick = (invitation: WorkspaceInvitation | ProjectInvitation, type: 'workspace' | 'project') => {
    setSelectedInvitation({
      type,
      id: invitation.id,
      name: type === 'workspace' ? (invitation as WorkspaceInvitation).workspaceName : (invitation as ProjectInvitation).projectName,
      role: (invitation as ProjectInvitation).role,
      invitedBy: (invitation as ProjectInvitation).invitedBy,
    });
    setShowModal(true);
    setIsDropdownOpen(false);
  };

  const handleAccept = async () => {
    if (!selectedInvitation) return;
    setLoadingAction('accept');
    try {
      if (selectedInvitation.type === 'workspace') {
        await acceptInvitation(selectedInvitation.id);
        setWorkspaceInvitations(workspaceInvitations.filter((inv) => inv.id !== selectedInvitation.id));
        addToast(`Successfully joined the workspace "${selectedInvitation.name}"`, 'success');
      } else {
        await acceptProjectInvitation(selectedInvitation.id);
        setProjectInvitations(projectInvitations.filter((inv) => inv.id !== selectedInvitation.id));
        addToast(`Successfully joined the project "${selectedInvitation.name}"`, 'success');
      }
      setShowModal(false);
    } catch (err: any) {
      console.error('Error accepting invitation:', err);
      addToast(err.message || 'Failed to accept invitation', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async () => {
    if (!selectedInvitation) return;
    setLoadingAction('reject');
    try {
      if (selectedInvitation.type === 'workspace') {
        await rejectInvitation(selectedInvitation.id);
        setWorkspaceInvitations(workspaceInvitations.filter((inv) => inv.id !== selectedInvitation.id));
        addToast(`Rejected invitation to the workspace "${selectedInvitation.name}"`, 'success');
      } else {
        await declineProjectInvitation(selectedInvitation.id);
        setProjectInvitations(projectInvitations.filter((inv) => inv.id !== selectedInvitation.id));
        addToast(`Rejected invitation to the project "${selectedInvitation.name}"`, 'success');
      }
      setShowModal(false);
    } catch (err: any) {
      console.error('Error rejecting invitation:', err);
      addToast(err.message || 'Failed to reject invitation', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const totalInvitations = workspaceInvitations.length + projectInvitations.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        ref={buttonRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="relative mr-3 rounded-full p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="View invitations"
      >
        <span className="sr-only">Invitations</span>
        <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Zm0 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9Zm12-5v12h2V4h-2ZM6 13h6v2H6v-2Z" />
        </svg>
        {totalInvitations > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
            {totalInvitations}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-gray-700 bg-gray-800 shadow-2xl transition-all duration-200"
          role="menu"
        >
          <div className="p-4">
            <h3 className="mb-3 text-lg font-semibold text-white">Invitations</h3>

            {isLoading && (
              <div className="flex justify-center py-3">
                <svg
                  className="size-5 animate-spin text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}

            {error && !isLoading && (
              <div className="px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            {!isLoading && !error && (
              <>
                {/* Workspace Invitations Section */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
                      />
                    </svg>
                    <h4 className="text-sm font-medium text-gray-300">Workspace Invitations</h4>
                  </div>
                  {workspaceInvitations.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">No pending workspace invitations</div>
                  ) : (
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {workspaceInvitations.map((invitation) => (
                        <div
                          key={invitation.id}
                          onClick={() => handleInvitationClick(invitation, 'workspace')}
                          className="cursor-pointer rounded-md bg-gray-700 p-2 transition-all duration-200 hover:bg-gray-600"
                          role="menuitem"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleInvitationClick(invitation, 'workspace')}
                        >
                          <div className="text-sm text-white">Invitation to "{invitation.workspaceName}"</div>
                          <div className="text-xs text-gray-400">
                            Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-800 px-2 text-xs font-medium text-gray-400">OR</span>
                  </div>
                </div>

                {/* Project Invitations Section */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="size-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01"
                      />
                    </svg>
                    <h4 className="text-sm font-medium text-gray-300">Project Invitations</h4>
                  </div>
                  {projectInvitations.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-400">No pending project invitations</div>
                  ) : (
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {projectInvitations.map((invitation) => (
                        <div
                          key={invitation.id}
                          onClick={() => handleInvitationClick(invitation, 'project')}
                          className="cursor-pointer rounded-md bg-gray-700 p-2 transition-all duration-200 hover:bg-gray-600"
                          role="menuitem"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleInvitationClick(invitation, 'project')}
                        >
                          <div className="text-sm text-white">Invitation to "{invitation.projectName}"</div>
                          <div className="text-xs text-gray-400">
                            Role: {invitation.role} • Invited by: {invitation.invitedBy} • Expires:{' '}
                            {new Date(invitation.expiresAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <InvitationModal
        show={showModal}
        header={selectedInvitation?.type === 'workspace' ? 'Workspace Invitation' : 'Project Invitation'}
        body={
          <p>
            You’ve been invited to join the {selectedInvitation?.type}{' '}
            <span className="font-semibold">"{selectedInvitation?.name}"</span>
            {selectedInvitation?.role && (
              <>
                {' '}
                as a <span className="font-semibold">{selectedInvitation.role}</span>
              </>
            )}
            {selectedInvitation?.invitedBy && (
              <>
                {' '}
                by <span className="font-semibold">{selectedInvitation.invitedBy}</span>
              </>
            )}
            . Do you want to accept?
          </p>
        }
        onClose={() => setShowModal(false)}
        onAccept={handleAccept}
        onReject={handleReject}
        loadingAction={loadingAction}
      />
    </div>
  );
};

export default Invitations;