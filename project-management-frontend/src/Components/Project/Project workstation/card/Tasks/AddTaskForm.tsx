import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddTaskFormProps {
  cardId: number;
  onAddTask: (cardId: number, taskName: string) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ cardId, onAddTask }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await onAddTask(cardId, taskName.trim());
        setTaskName('');
      } catch (error) {
        console.error('Error adding task:', error);
      } finally {
        setIsSubmitting(false);
        setIsAddingTask(false);
      }
    }
  };

  if (!isAddingTask) {
    return (
      <button
        onClick={() => setIsAddingTask(true)}
        className="mt-2 flex w-full items-center justify-center rounded-lg bg-gray-700/50 p-2 text-sm text-gray-300 transition-all duration-200 hover:bg-gray-700/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <Plus className="mr-2 size-4" />
        Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="overflow-hidden rounded-lg bg-gray-700 p-2 shadow-lg transition-all">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name..."
          className="w-full rounded bg-gray-600 p-2 text-sm text-white transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="mt-2 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => {
              setIsAddingTask(false);
              setTaskName('');
            }}
            className="flex items-center justify-center rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Cancel"
          >
            <X className="size-4" />
          </button>
          <button
            type="submit"
            disabled={!taskName.trim() || isSubmitting}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:bg-blue-600/50 disabled:text-white/50"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;