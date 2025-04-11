import React, { useState } from "react";
import { Modal, Textarea, Button, TextInput } from "flowbite-react";
import { updateTaskTitle } from "../../services/backlogApi";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: number;
  taskTitle: string;
  taskDescription: string;
  onSaveTitle: (newTitle: string) => void;
  onSaveDescription: (newDescription: string) => void;
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
  taskTitle,
  taskDescription,
  onSaveTitle,
  onSaveDescription,
}) => {
  const [title, setTitle] = useState(taskTitle);
  const [description, setDescription] = useState(taskDescription);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleBlur = async () => {
    if (title !== taskTitle) {
      try {
        await updateTaskTitle(taskId, title);
        onSaveTitle(title);
      } catch (error) {
        console.error("Error updating task title:", error);
      }
    }
    setIsEditingTitle(false);
  };

  const handleSave = () => {
    onSaveDescription(description);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose}>
      <Modal.Header>
        {isEditingTitle ? (
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
            autoFocus
            className="w-full"
          />
        ) : (
          <h2
            className="text-lg font-semibold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h2>
        )}
      </Modal.Header>

      <Modal.Body>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            className="w-full"
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleSave}>Save</Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;
