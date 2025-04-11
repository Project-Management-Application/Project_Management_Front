/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Table, Button, TextInput, Pagination, Modal } from 'flowbite-react';
import { HiPlus, HiSearch, HiTrash } from 'react-icons/hi';
import { getDashboardData, inviteUser } from '../../services/Workspace-apis'; // Import API functions
import ConfirmDeleteModal from '../UI/ConfirmDeleteModal';

const Members: React.FC = () => {
  // Sample data
  const initialMembersData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com' },
    { id: 5, name: 'Charlie Davis', email: 'charlie.davis@example.com' },
    { id: 6, name: 'Emma Wilson', email: 'emma.wilson@example.com' },
  ];

  // State for members, search, pagination, modals, and workspace
  const [membersData, setMembersData] = useState(initialMembersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const itemsPerPage = 4;

  // Fetch workspaceId on mount
  useEffect(() => {
    const fetchWorkspaceId = async () => {
      try {
        const dashboardData = await getDashboardData();
        setWorkspaceId(dashboardData.workspace.id);
      } catch (err) {
        setWorkspaceError('Unable to load workspace data');
      }
    };

    fetchWorkspaceId();
  }, []);

  // Filter members based on search term
  const filteredMembers = membersData.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  // Handle opening the delete modal
  const handleOpenRemoveModal = (id: number, name: string) => {
    setMemberToRemove({ id, name });
    setIsDeleteModalOpen(true);
  };

  // Handle confirming the removal
  const handleConfirmRemove = () => {
    if (memberToRemove) {
      setMembersData(membersData.filter((member) => member.id !== memberToRemove.id));
    }
    setIsDeleteModalOpen(false);
    setMemberToRemove(null);
  };

  // Handle canceling the removal
  const handleCancelRemove = () => {
    setIsDeleteModalOpen(false);
    setMemberToRemove(null);
  };

  // Handle opening the invite modal
  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
    setInviteEmail('');
    setInviteError('');
    setInviteSuccess('');
  };

  // Handle inviting a new member
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
      setInviteError('');
      setInviteSuccess('');
      await inviteUser(workspaceId, inviteEmail);
      setInviteSuccess('Invitation sent successfully!');
      setInviteEmail(''); // Clear input after success
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation. Please try again.');
    } finally {
      setIsInviteLoading(false);
    }
  };

  // Handle closing the invite modal
  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteError('');
    setInviteSuccess('');
  };

  // Handle page change
  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="p-6">
      {/* Workspace Error (optional display) */}
      {workspaceError && (
        <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
          {workspaceError}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h1>
        <Button
          color="blue"
          className="flex items-center"
          onClick={handleOpenInviteModal}
          disabled={!workspaceId} // Disable if workspaceId isn’t loaded
        >
          <HiPlus className="mr-2 size-5" />
          Invite New Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <TextInput
          id="search"
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={HiSearch}
          className="w-full max-w-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <Table hoverable className="modern-table">
          <Table.Head className="bg-gray-100 dark:bg-gray-700">
            <Table.HeadCell className="text-gray-900 dark:text-white">Name</Table.HeadCell>
            <Table.HeadCell className="text-gray-900 dark:text-white">Email</Table.HeadCell>
            <Table.HeadCell className="text-gray-900 dark:text-white">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member) => (
                <Table.Row
                  key={member.id}
                  className="bg-white transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </Table.Cell>
                  <Table.Cell className="text-gray-700 dark:text-gray-300">
                    {member.email}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      color="failure"
                      size="xs"
                      className="flex items-center"
                      onClick={() => handleOpenRemoveModal(member.id, member.name)}
                    >
                      <HiTrash className="mr-1 size-4" />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showIcons
            className="flex items-center"
          />
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelRemove}
        onConfirm={handleConfirmRemove}
        itemName={memberToRemove?.name}
      />

      {/* Invite New Member Modal */}
      <Modal show={isInviteModalOpen} onClose={handleCloseInviteModal} size="md" popup>
        <Modal.Header>Invite New Member</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {/* Success Message */}
            {inviteSuccess && (
              <div className="rounded-lg border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
                {inviteSuccess}
              </div>
            )}
            {/* Error Message */}
            {inviteError && (
              <div className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
                {inviteError}
              </div>
            )}
            {/* Email Input */}
            <TextInput
              type="email"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteError('');
                setInviteSuccess('');
              }}
              placeholder="e.g., teammate@example.com"
              disabled={isInviteLoading}
              className="w-full"
            />
            {/* Invite Button */}
            <Button
              color="blue"
              onClick={handleInvite}
              disabled={isInviteLoading || !inviteEmail.trim() || !workspaceId}
              className="w-full"
            >
              {isInviteLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 size-5 animate-spin text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
    </div>
  );
};

export default Members;