/* eslint-disable tailwindcss/no-contradicting-classname */
import React from "react";
import { HiUser, HiTag, HiClipboard, HiClock, HiPaperClip, HiPhotograph } from "react-icons/hi";

type TaskSidebarProps = {
  taskId?: number;
  onShowDatePicker: () => void;
  onShowChecklist: () => void;
  onShowLabels: () => void;
};

const TaskSidebar: React.FC<TaskSidebarProps> = ({
  taskId,
  onShowDatePicker,
  onShowChecklist,
  onShowLabels,
}) => {
  const handleShowAttachment = () => {
    console.log("Show attachment dialog for task:", taskId);
  };

  const handleShowCover = () => {
    console.log("Show cover selector for task:", taskId);
  };

  return (
    <div className="col-span-1 space-y-6">
      <div>
        <h3 className="mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-lg font-extrabold uppercase tracking-wide text-gray-200 text-transparent">
          Add to Card
        </h3>
        <div className="space-y-4">
          <button
            className="flex w-full items-center gap-2 text-left text-gray-300 transition-all duration-300 hover:text-neon-blue"
            onClick={() => console.log("Members clicked - implement as needed")}
          >
            <HiUser className="size-5" />
            Members
          </button>
          <button
            className="flex w-full items-center gap-2 text-left text-gray-300 transition-all duration-300 hover:text-neon-blue"
            onClick={onShowLabels}
          >
            <HiTag className="size-5" />
            Labels
          </button>
          <button
            className="flex w-full items-center gap-2 text-left text-gray-300 transition-all duration-300 hover:text-neon-blue"
            onClick={onShowChecklist}
          >
            <HiClipboard className="size-5" />
            Checklist
          </button>
          <button
            className="flex w-full items-center gap-2 text-left text-gray-300 transition-all duration-300 hover:text-neon-blue"
            onClick={onShowDatePicker}
          >
            <HiClock className="size-5" />
            Dates
          </button>
          <button
            className="flex w-full items-center gap-2 text-left text-gray-300 transition-all duration-300 hover:text-neon-blue"
            onClick={handleShowAttachment}
          >
            <HiPaperClip className="size-5" />
            Attachment
          </button>
          <button
            className="flex w-full items-center gap-2 text-left text-gray-300 transition-all duration-300 hover:text-neon-blue"
            onClick={handleShowCover}
          >
            <HiPhotograph className="size-5" />
            Cover
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskSidebar;