import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // Note: This accepts a function returning void or Promise<void>
  itemName?: string;
  message?: string;
  isLoading?: boolean; // Added isLoading prop
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  message = 'Are you sure you want to remove this item?',
  isLoading = false,
}) => {
  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiTrash className="mx-auto mb-4 size-12 text-gray-400 dark:text-gray-500" />
          <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">
            {itemName ? `Are you sure you want to delete ${itemName}?` : message}
          </p>
          <div className="flex justify-center gap-4">
            <Button color="gray" onClick={onClose} disabled={isLoading}>
              No, cancel
            </Button>
            <Button color="failure" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="mr-2 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Removing...
                </div>
              ) : (
                'Yes, I’m sure'
              )}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;