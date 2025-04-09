/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { getPendingInvitations, acceptInvitation, rejectInvitation } from '../../../services/Workspace-apis';
import InvitationModal from '../../UI/InvitationModal';


interface Invitation {
  id: number;
  workspaceName: string;
  expiresAt: string;
}


interface InvitationsProps {
  addToast: (message: string, type: 'success' | 'error') => void;
}

const Invitations: React.FC<InvitationsProps> = ({ addToast }) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitation, setSelectedInvitation] = useState<{ id: number; workspaceName: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'accept' | 'reject' | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const data = await getPendingInvitations();
      console.log('Fetched invitations:', data);
      setInvitations(data);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      addToast('Failed to load invitations', 'error');
    }
  };

  const handleInvitationClick = (invitation: { id: number; workspaceName: string }) => {
    setSelectedInvitation(invitation);
    setShowModal(true);
  };

  const handleAccept = async () => {
    if (!selectedInvitation) return;
    setLoadingAction('accept');
    try {
      await acceptInvitation(selectedInvitation.id);
      setInvitations(invitations.filter((inv) => inv.id !== selectedInvitation.id));
      setShowModal(false);
      addToast(`Successfully joined "${selectedInvitation.workspaceName}"`, 'success');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      addToast('Failed to accept invitation', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async () => {
    if (!selectedInvitation) return;
    setLoadingAction('reject');
    try {
      await rejectInvitation(selectedInvitation.id);
      setInvitations(invitations.filter((inv) => inv.id !== selectedInvitation.id));
      setShowModal(false);
      addToast(`Rejected invitation to "${selectedInvitation.workspaceName}"`, 'success');
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      addToast('Failed to reject invitation', 'error');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <button
          type="button"
          className="relative mr-3 rounded-full p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          id="invitations-button"
          data-dropdown-toggle="invitations-dropdown"
        >
          <span className="sr-only">Invitations</span>
          <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3Zm0 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9Zm12-5v12h2V4h-2ZM6 13h6v2H6v-2Z" />
          </svg>
          {invitations.length > 0 && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              {invitations.length}
            </span>
          )}
        </button>

        <div
          id="invitations-dropdown"
          className="z-50 my-4 hidden w-72 list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:divide-gray-600 dark:bg-gray-700"
        >
          <div className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-400">
            Invitations
          </div>
          <div className="max-h-64 overflow-y-auto">
            {invitations.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No pending invitations
              </div>
            ) : (
              invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  onClick={() => handleInvitationClick({ id: invitation.id, workspaceName: invitation.workspaceName })}
                  className="cursor-pointer px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="text-sm text-gray-900 dark:text-white">
                    Invitation to "{invitation.workspaceName}"
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <InvitationModal
        show={showModal}
        header="Workspace Invitation"
        body={<p>You’ve been invited to join the workspace "{selectedInvitation?.workspaceName}". Do you want to accept?</p>}
        onClose={() => setShowModal(false)}
        onAccept={handleAccept}
        onReject={handleReject}
        loadingAction={loadingAction}
      />
    </>
  );
};

export default Invitations;