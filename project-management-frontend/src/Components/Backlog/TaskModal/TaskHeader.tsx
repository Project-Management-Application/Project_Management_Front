import React from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
type TaskHeaderProps = {
  title: string;
  setTitle: (title: string) => void;
  status: string;
  onSaveTitle: () => void;
  onStatusChange: (status: string) => void;
  onClose: () => void;
};

const TaskHeader: React.FC<TaskHeaderProps> = ({
  title,
  setTitle,
  status,
  onSaveTitle,
  onStatusChange,
  onClose,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Dialog.Title as="div" className="flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onSaveTitle}
          className="text-3xl font-semibold text-white bg-transparent border-none focus:ring-0 w-full placeholder-gray-400"
          placeholder="Task title"
        />
        <div className="text-sm text-gray-400 mt-1">
          in list{" "}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-transparent text-neon-blue border-none focus:ring-0"
          >
            <option value="TODO" className="text-white bg-dark-bg">TO DO</option>
            <option value="INPROGRESS" className="text-white bg-dark-bg">IN PROGRESS</option>
            <option value="DONE" className="text-white bg-dark-bg">DONE</option>
          </select>
        </div>
      </Dialog.Title>
      <Button
        color="gray"
        pill
        onClick={onClose}
        className="bg-neon-purple/20 hover:bg-neon-purple/40 transition-all duration-300"
      >
        <HiX className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
};

export default TaskHeader;