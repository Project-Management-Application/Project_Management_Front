import React from 'react';
import { Modal, Button } from 'flowbite-react';
import { HiTrash } from 'react-icons/hi';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string; 
  message?: string; 
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  message = 'Are you sure you want to delete this item?',
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
            <Button color="gray" onClick={onClose}>
              No, cancel
            </Button>
            <Button color="failure" onClick={onConfirm}>
              Yes, I’m sure
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteModal;