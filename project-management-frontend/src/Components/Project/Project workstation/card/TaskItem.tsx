import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../../../types/Task';
import TaskModal from './Tasks/TaskDetailsModal/TaskModal';

interface Member {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface TaskItemProps {
  task: Task;
  projectId: number; // Added projectId
  members: Member[]; // Added members
  refreshProjectData: () => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, projectId, members, refreshProjectData }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  const handleTaskClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleTaskClick}
        className={`group cursor-pointer rounded-lg bg-gray-700 p-3 text-white shadow-sm transition-all duration-200 ${
          isDragging
            ? 'scale-105 cursor-grabbing shadow-xl ring-2 ring-blue-500'
            : 'hover:bg-gray-650 hover:scale-[1.02] hover:shadow-md'
        }`}
      >
        <div className="flex items-center">
          <div className="mr-2 shrink-0 text-gray-400">
            <svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H6V8H8V6Z" fill="currentColor" />
              <path d="M8 11H6V13H8V11Z" fill="currentColor" />
              <path d="M8 16H6V18H8V16Z" fill="currentColor" />
              <path d="M13 6H11V8H13V6Z" fill="currentColor" />
              <path d="M13 11H11V13H13V11Z" fill="currentColor" />
              <path d="M13 16H11V18H13V16Z" fill="currentColor" />
              <path d="M18 6H16V8H18V6Z" fill="currentColor" />
              <path d="M18 11H16V13H18V11Z" fill="currentColor" />
              <path d="M18 16H16V18H18V16Z" fill="currentColor" />
            </svg>
          </div>
          <p className="flex-1 text-sm font-medium">{task.name}</p>
        </div>
        <div className="mt-2 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className="rounded p-1 text-xs text-gray-400 hover:bg-gray-600 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          task={task}
          projectId={projectId} // Pass projectId
          members={members} // Pass members
          onClose={() => setIsModalOpen(false)}
          refreshProjectData={refreshProjectData}
        />
      )}
    </>
  );
};

export default TaskItem;