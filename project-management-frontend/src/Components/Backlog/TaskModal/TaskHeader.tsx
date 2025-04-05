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
    <div className="mb-6 flex items-center justify-between">
      <Dialog.Title as="div" className="flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onSaveTitle}
          className="w-full border-none bg-transparent text-3xl font-semibold text-white placeholder:text-gray-400 focus:ring-0"
          placeholder="Task title"
        />
        <div className="mt-1 text-sm text-gray-400">
          in list{" "}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="border-none bg-transparent text-neon-blue focus:ring-0"
          >
            <option value="TODO" className="bg-dark-bg text-white">TO DO</option>
            <option value="INPROGRESS" className="bg-dark-bg text-white">IN PROGRESS</option>
            <option value="DONE" className="bg-dark-bg text-white">DONE</option>
          </select>
        </div>
      </Dialog.Title>
      <Button
        color="gray"
        pill
        onClick={onClose}
        className="bg-neon-purple/20 transition-all duration-300 hover:bg-neon-purple/40"
      >
        <HiX className="size-6 text-white" />
      </Button>
    </div>
  );
};

export default TaskHeader;