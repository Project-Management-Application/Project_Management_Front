/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Table, Button, TextInput, Pagination, Modal } from 'flowbite-react';
import { HiPlus, HiSearch, HiTrash } from 'react-icons/hi';
import { getDashboardData, inviteUser, getWorkspaceMembers, removeMember } from '../../services/Workspace-apis';
import ConfirmDeleteModal from '../UI/ConfirmDeleteModal';
import Toast from '../UI/Toast';

const Members: React.FC = () => {
  const [membersData, setMembersData] = useState<{ id: number; name: string; email: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setWorkspaceId(dashboardData.workspace.id);
        const members = await getWorkspaceMembers(dashboardData.workspace.id);
        setMembersData(members.map(m => ({ id: m.id, name: `${m.firstName} ${m.lastName}`, email: m.email })));
      } catch (err) {
        setWorkspaceError('Unable to load workspace data');
      }
    };
    fetchWorkspaceData();
  }, []);

  const filteredMembers = membersData.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenRemoveModal = (id: number, name: string) => {
    setMemberToRemove({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (memberToRemove && workspaceId) {
      try {
        setIsRemoveLoading(true);
        await removeMember(workspaceId, memberToRemove.id);
        setMembersData(membersData.filter((member) => member.id !== memberToRemove.id));
        setToast({ message: 'Member removed successfully', type: 'success' });
      } catch (err: any) {
        setToast({ message: err.message || 'Failed to remove member', type: 'error' });
      } finally {
        setIsRemoveLoading(false);
      }
    }
    setIsDeleteModalOpen(false);
    setMemberToRemove(null);
  };

  const handleCancelRemove = () => {
    setIsDeleteModalOpen(false);
    setMemberToRemove(null);
  };

  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
    setInviteEmail('');
    setInviteError('');
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setInviteError('Email cannot be empty');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }
    if (!workspaceId) {
      setInviteError('Workspace ID is missing');
      return;
    }
    try {
      setIsInviteLoading(true);
      await inviteUser(workspaceId, inviteEmail);
      setToast({ message: 'Member invited successfully', type: 'success' });
      setInviteEmail('');
      const members = await getWorkspaceMembers(workspaceId);
      setMembersData(members.map(m => ({ id: m.id, name: `${m.firstName} ${m.lastName}`, email: m.email })));
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation');
    } finally {
      setIsInviteLoading(false);
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteError('');
  };

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="p-6">
      {workspaceError && (
        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
          {workspaceError}
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h1>
        <Button color="blue" onClick={handleOpenInviteModal} disabled={!workspaceId}>
          <HiPlus className="mr-2 size-5" />
          Invite New Member
        </Button>
      </div>
      <div className="mb-6">
        <TextInput
          id="search"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={HiSearch}
          className="w-full max-w-md"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <Table hoverable>
          <Table.Head className="bg-gray-100 dark:bg-gray-700">
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member) => (
                <Table.Row key={member.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">{member.name}</Table.Cell>
                  <Table.Cell className="text-gray-700 dark:text-gray-300">{member.email}</Table.Cell>
                  <Table.Cell>
                    <Button
                      color="failure"
                      size="xs"
                      onClick={() => handleOpenRemoveModal(member.id, member.name)}
                      disabled={isRemoveLoading && memberToRemove?.id === member.id}
                    >
                      {isRemoveLoading && memberToRemove?.id === member.id ? (
                        <svg className="mr-1 size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <HiTrash className="mr-1 size-4" />
                      )}
                      Remove
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={3} className="text-center text-gray-500 dark:text-gray-400">
                  No members found
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
          />
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        message={memberToRemove ? `Are you sure you want to remove ${memberToRemove.name} from the workspace?` : undefined}
        isLoading={isRemoveLoading}
      />
      <Modal show={isInviteModalOpen} onClose={handleCloseInviteModal} size="md" popup>
        <Modal.Header>Invite New Member</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {inviteError && (
              <div className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
                {inviteError}
              </div>
            )}
            <TextInput
              type="email"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteError('');
              }}
              placeholder="e.g., teammate@example.com"
              disabled={isInviteLoading}
            />
            <Button
              color="blue"
              onClick={handleInvite}
              disabled={isInviteLoading || !inviteEmail.trim() || !workspaceId}
              className="w-full"
            >
              {isInviteLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="mr-2 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send Invite'
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default Members;