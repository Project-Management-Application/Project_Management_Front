import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import CardHeader from './CardHeader';
import TaskItem from './TaskItem';
import EmptyTasksList from './EmptyTasksList';
import { ProjectCard } from '../../../../types/ProjectCard';
import { addTaskToCard, deleteCard } from '../../../../services/project-apis';

interface Member {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface CardListProps {
  card: ProjectCard;
  projectId: number;
  members: Member[];
  onDeleteCard: (cardId: number) => void;
  refreshProjectData: () => Promise<void>;
  isTemporary?: boolean;
}

const CardList: React.FC<CardListProps> = ({
  card,
  projectId,
  members,
  onDeleteCard,
  refreshProjectData,
  isTemporary = false,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `card-${card.id}`,
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newTaskName.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);

        // Generate a temporary ID for the task
        const tempId = -Date.now();

        // Create a temporary task for immediate UI feedback
        const tempTask = {
          id: tempId,
          name: newTaskName.trim(),
          cardId: card.id,
          isTemporary: true,
        };

        // Update local state optimistically
        card.tasks.push(tempTask);
        setNewTaskName('');
        setIsAddingTask(false);

        // Make the actual API call
        await addTaskToCard(card.id, newTaskName.trim());

        // Refresh data to get the real task with correct ID
        await refreshProjectData();
      } catch (error) {
        console.error('Error in handleAddTask:', error);
        setError(error instanceof Error ? error.message : 'Failed to add task');

        // Show error for 5 seconds then clear
        setTimeout(() => {
          setError(null);
        }, 5000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteCard = async () => {
    console.log(`[CardList] Starting deletion process for cardId: ${card.id}`);
    try {
      await deleteCard(card.id);
      console.log(`[CardList] Successfully called deleteCard API for cardId: ${card.id}`);
      onDeleteCard(card.id);
      console.log(`[CardList] Triggered onDeleteCard for cardId: ${card.id}`);
      await refreshProjectData();
      console.log(`[CardList] Refreshed project data after deleting cardId: ${card.id}`);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error(`[CardList] Failed to delete cardId: ${card.id}`, error);
      setError('Failed to delete card. Please try again.');

      // Show error for 5 seconds then clear
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex w-64 shrink-0 flex-col rounded-xl ${
        isTemporary ? 'animate-pulse opacity-90 bg-gray-800/60' : 'bg-gray-800/80'
      } shadow-lg transition-all duration-200 ${
        isOver ? 'scale-[1.02] bg-gray-700/90 ring-2 ring-blue-400' : ''
      }`}
      style={{
        minHeight: '150px',
        maxHeight: '85vh',
      }}
    >
      <CardHeader
        card={card}
        onDeleteCard={() => {
          if (isTemporary) return; // Prevent deletion of temporary card
          console.log(`[CardList] Delete button clicked for cardId: ${card.id}, showing confirmation`);
          setShowDeleteConfirm(true);
        }}
      />

      <div
        className={`flex flex-col gap-3 overflow-y-auto p-3 ${isOver ? 'bg-gray-750/70' : ''}`}
      >
        <SortableContext
          items={card.tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {card.tasks && card.tasks.length > 0 ? (
            card.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projectId={projectId}
                members={members}
                refreshProjectData={refreshProjectData}
              />
            ))
          ) : (
            <EmptyTasksList />
          )}
        </SortableContext>

        {error && (
          <div className="mb-2 mt-1 rounded bg-red-500/20 p-2 text-xs text-red-200">
            {error}
          </div>
        )}

        {isAddingTask ? (
          <form onSubmit={handleAddTask} className="mt-2">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task name..."
              className="mb-2 w-full rounded-lg bg-gray-700 p-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
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
            onClick={() => {
              if (isTemporary) return; // Prevent adding tasks to temporary card
              setIsAddingTask(true);
            }}
            className={`mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 transition-colors ${
              isTemporary
                ? 'cursor-not-allowed opacity-50'
                : 'hover:border-gray-500 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <Plus className="size-3.5" />
            Add a task
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-indigo-200">Delete Card</h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete the card "{card.name}"? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  console.log(`[CardList] Cancellation of deletion for cardId: ${card.id}`);
                  setShowDeleteConfirm(false);
                }}
                className="rounded px-3 py-1 text-sm text-gray-400 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(`[CardList] Confirmed deletion for cardId: ${card.id}`);
                  handleDeleteCard();
                }}
                className="rounded bg-rose-500 px-3 py-1 text-sm text-white hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;