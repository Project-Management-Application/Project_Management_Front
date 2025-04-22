import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import CardHeader from './CardHeader';
import TaskItem from './TaskItem';
import EmptyTasksList from './EmptyTasksList';
import { ProjectCard } from '../../../../types/ProjectCard';
import { addTaskToCard } from '../../../../services/project-apis';

interface CardListProps {
  card: ProjectCard;
  onDeleteCard: (cardId: number) => void;
  refreshProjectData: () => Promise<void>;
}

const CardList: React.FC<CardListProps> = ({ card, onDeleteCard, refreshProjectData }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: `card-${card.id}`,
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newTaskName.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        
        // Optimistically add the task locally
        const tempTask = {
          id: Date.now(), // Temporary ID
          name: newTaskName.trim()
        };
        
        card.tasks.push(tempTask);
        setNewTaskName('');
        setIsAddingTask(false);
        
        // Make the API call
        await addTaskToCard(card.id, newTaskName.trim());
        
        // Refresh the data in the background
        await refreshProjectData();
      } catch (error) {
        console.error('Error in handleAddTask:', error);
        setError(error instanceof Error ? error.message : 'Failed to add task');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-xl bg-gray-800/80 shadow-lg transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-400 bg-gray-700/90 scale-[1.02]' : ''
      }`}
      style={{
        minHeight: '150px',
        maxHeight: '85vh',
      }}
    >
      <CardHeader card={card} onDeleteCard={onDeleteCard} />

      <div className={`flex flex-col gap-3 overflow-y-auto p-3 ${
        isOver ? 'bg-gray-750/70' : ''
      }`}>
        <SortableContext
          items={card.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {card.tasks && card.tasks.length > 0 ? (
            card.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <EmptyTasksList />
          )}
        </SortableContext>
        
        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="mt-2">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="mb-2 w-full rounded-lg bg-gray-700 p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {error && (
              <div className="mb-2 text-sm text-red-400">
                {error}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTaskName('');
                  setError(null);
                }}
                className="rounded px-2 py-1 text-sm text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTaskName.trim() || isSubmitting}
                className="rounded bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-blue-600/50 disabled:text-white/50"
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:bg-gray-700/50 hover:text-white"
          >
            <Plus className="size-3.5" />
            Add a task
          </button>
        )}
      </div>
    </div>
  );
};

export default CardList;