// src/components/ProjectStation/TaskItem.tsx
import React from 'react';
import { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Task } from '../../../../types/Task';

interface TaskItemProps {
  task: Task;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, provided, snapshot }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`group rounded-lg bg-gray-700 p-3 text-white shadow-sm transition-all duration-300 ${
        snapshot.isDragging
          ? 'scale-105 shadow-xl ring-2 ring-blue-500'
          : 'hover:scale-[1.02] hover:shadow-md'
      }`}
    >
      <p className="text-sm font-medium">{task.name}</p>
      <div className="mt-2 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
        <button className="rounded p-1 text-xs text-gray-400 hover:bg-gray-600 hover:text-white">
          <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;