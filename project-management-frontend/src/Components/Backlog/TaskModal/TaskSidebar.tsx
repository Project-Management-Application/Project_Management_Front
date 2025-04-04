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
        <h3 className="text-lg font-extrabold text-gray-200 mb-4 tracking-wide uppercase bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
          Add to Card
        </h3>
        <div className="space-y-4">
          <button
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-neon-blue transition-all duration-300"
            onClick={() => console.log("Members clicked - implement as needed")}
          >
            <HiUser className="w-5 h-5" />
            Members
          </button>
          <button
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-neon-blue transition-all duration-300"
            onClick={onShowLabels}
          >
            <HiTag className="w-5 h-5" />
            Labels
          </button>
          <button
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-neon-blue transition-all duration-300"
            onClick={onShowChecklist}
          >
            <HiClipboard className="w-5 h-5" />
            Checklist
          </button>
          <button
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-neon-blue transition-all duration-300"
            onClick={onShowDatePicker}
          >
            <HiClock className="w-5 h-5" />
            Dates
          </button>
          <button
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-neon-blue transition-all duration-300"
            onClick={handleShowAttachment}
          >
            <HiPaperClip className="w-5 h-5" />
            Attachment
          </button>
          <button
            className="flex items-center gap-2 w-full text-left text-gray-300 hover:text-neon-blue transition-all duration-300"
            onClick={handleShowCover}
          >
            <HiPhotograph className="w-5 h-5" />
            Cover
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskSidebar;