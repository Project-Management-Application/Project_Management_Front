import React from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';

interface InvitationModalProps {
  show: boolean;
  header: string; // Customizable header text
  body: React.ReactNode; // Customizable body content (can be text, JSX, etc.)
  onClose: () => void;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  loadingAction: 'accept' | 'reject' | null;
}

const InvitationModal: React.FC<InvitationModalProps> = ({
  show,
  header,
  body,
  onClose,
  onAccept,
  onReject,
  loadingAction,
}) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      theme={{
        root: {
          base: 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50',
        },
        content: {
          base: 'relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800',
          inner: 'p-5',
        },
        header: {
          base: 'flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700',
          title: 'text-xl font-semibold text-gray-900 dark:text-white',
        },
        body: {
          base: 'p-4 text-gray-700 dark:text-gray-300',
        },
        footer: {
          base: 'flex justify-start gap-2 border-t border-gray-200 p-4 dark:border-gray-700',
        },
      }}
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onAccept}
          disabled={loadingAction !== null}
          className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
        >
          {loadingAction === 'accept' ? (
            <div className="flex items-center">
              <Spinner size="sm" className="mr-2" />
              Processing...
            </div>
          ) : (
            'Accept'
          )}
        </Button>
        <Button
          onClick={onReject}
          disabled={loadingAction !== null}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
        >
          {loadingAction === 'reject' ? (
            <div className="flex items-center">
              <Spinner size="sm" className="mr-2" />
              Processing...
            </div>
          ) : (
            'Reject'
          )}
        </Button>
        <Button
          onClick={onClose}
          disabled={loadingAction !== null}
          className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-600"
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvitationModal;