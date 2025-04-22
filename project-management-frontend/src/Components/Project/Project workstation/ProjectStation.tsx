/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import CardList from './card/CardList';
import TaskItem from './card/TaskItem';
import ProjectHeader from './ProjectHeader';
import AddCardSection from './card/AddCardSection';
import { ProjectCard } from '../../../types/ProjectCard';
import { ProjectDetails, BackendProjectCard } from '../../../types/ProjectDetails';
import { Task } from '../../../types/Task';
import { cardColors } from '../../../utils/cardColors';
import LoadingOverlay from '../../UI/LoadingOverlay';
import { addCardToProject, getProjectDetails, moveTask } from '../../../services/project-apis';

const ProjectStation: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(true);
  const [newCardName, setNewCardName] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState('');
  const [workspaceId, setWorkspaceId] = useState<number>(0);
  const [moveError, setMoveError] = useState<string | null>(null);

  // Configure the sensors for different input methods
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjectData = useCallback(async () => {
    if (!projectId) return;

    try {
      const data: ProjectDetails = await getProjectDetails(parseInt(projectId));
      
      setProjectName(data.name || 'Untitled Project');
      setWorkspaceId(data.workspaceId);
      
      const mappedCards: ProjectCard[] = data.cards.map((card: BackendProjectCard, index: number) => ({
        id: card.id,
        name: card.name,
        tasks: Array.isArray(card.tasks) ? card.tasks.map((backendTask: Task) => ({
          id: backendTask.id,
          name: backendTask.name,
        })) : [],
        color: cardColors[index % cardColors.length],
      }));
      
      setCards(mappedCards);

      if (data.backgroundImage) {
        setBackgroundStyle({ 
          background: `url(${data.backgroundImage}) center/cover no-repeat`,
        });
      } else if (data.backgroundColor) {
        setBackgroundStyle({ backgroundColor: data.backgroundColor });
      } else if (data.modelBackgroundImage) {
        setBackgroundStyle({ 
          background: `url(${data.modelBackgroundImage}) center/cover no-repeat`,
        });
      } else {
        setBackgroundStyle({ backgroundColor: '#1e3a8a' });
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
      navigate('/Dashboard/projects');
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (!projectId) {
      navigate('/Dashboard/projects');
      return;
    }

    const initializeProject = async () => {
      try {
        await fetchProjectData();
      } finally {
        setLoading(false);
      }
    };

    initializeProject();
  }, [projectId, navigate, fetchProjectData]);

  const refreshProjectData = useCallback(async () => {
    if (!loading) {
      await fetchProjectData();
    }
  }, [fetchProjectData, loading]);

  const handleAddCard = async () => {
    if (newCardName.trim() && projectId) {
      try {
        await addCardToProject(parseInt(projectId), newCardName.trim());
        await refreshProjectData();
        setNewCardName('');
        setIsAddingCard(false);
      } catch (error) {
        console.error('Failed to add card:', error);
      }
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };

  // Find a task by its ID across all cards
  const findTaskById = (taskId: number): { task: Task, cardId: number, index: number } | null => {
    for (const card of cards) {
      const taskIndex = card.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        return { task: card.tasks[taskIndex], cardId: card.id, index: taskIndex };
      }
    }
    return null;
  };

  // Handle the start of a drag operation
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = parseInt(active.id.toString());

    const taskInfo = findTaskById(taskId);
    if (taskInfo) {
      setActiveTaskId(taskId);
      setActiveTask(taskInfo.task);
    }
  };

  // Handle when a draggable item is moved over a droppable area
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Skip if not moving over a different card
    if (!overId.toString().includes('card-')) return;
    
    const activeTaskInfo = findTaskById(parseInt(activeId.toString()));
    if (!activeTaskInfo) return;
    
    const activeCardId = activeTaskInfo.cardId;
    const overCardId = parseInt(overId.toString().replace('card-', ''));
    
    // Skip if dragging over the same card
    if (activeCardId === overCardId) return;
    
    // No need to update state here as we'll do it in handleDragEnd
  };

  // Handle when a drag operation completes
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTaskId(null);
    setActiveTask(null);
    
    if (!over) return;
    
    const activeId = parseInt(active.id.toString());
    const activeTaskInfo = findTaskById(activeId);
    
    if (!activeTaskInfo) return;
    
    let destinationCardId: number;
    let destinationIndex: number = 0;
    
    // Determine if dropping on a card or another task
    if (over.id.toString().includes('card-')) {
      destinationCardId = parseInt(over.id.toString().replace('card-', ''));
      
      // If dropping directly on a card, add to the end of the card's tasks
      const destCard = cards.find(card => card.id === destinationCardId);
      destinationIndex = destCard ? destCard.tasks.length : 0;
    } else {
      // Dropping on another task
      const overTaskId = parseInt(over.id.toString());
      const overTaskInfo = findTaskById(overTaskId);
      
      if (!overTaskInfo) return;
      
      destinationCardId = overTaskInfo.cardId;
      destinationIndex = overTaskInfo.index;
    }
    
    // If nothing changed, do nothing
    if (activeTaskInfo.cardId === destinationCardId && activeTaskInfo.index === destinationIndex) {
      return;
    }
    
    // Create a deep copy of the cards to work with
    const newCards = JSON.parse(JSON.stringify(cards));
    
    // Remove task from source card
    const sourceCard = newCards.find((card: ProjectCard) => card.id === activeTaskInfo.cardId);
    const [movedTask] = sourceCard.tasks.splice(activeTaskInfo.index, 1);
    
    // Add task to destination card
    const destCard = newCards.find((card: ProjectCard) => card.id === destinationCardId);
    destCard.tasks.splice(destinationIndex, 0, movedTask);
    
    // Update UI optimistically
    setCards(newCards);
    setMoveError(null);
    
    try {
      // Persist changes through API
      await moveTask(activeId, destinationCardId);
      
      // Refresh data in background
      refreshProjectData();
    } catch (error) {
      console.error('Error moving task:', error);
      
      // Revert UI on error
      setCards(cards);
      
      // Show error message
      setMoveError(error instanceof Error ? error.message : 'Failed to move task');
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setMoveError(null);
      }, 5000);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Loading project..." />;
  }

  return (
    <div className="size-full">
      <div className="relative size-full overflow-hidden">
        <div className="absolute inset-0" style={backgroundStyle}></div>
        <div className="absolute inset-0 bg-gray-900/40"></div>

        <div className="relative z-[1] flex h-full flex-col rounded-lg">
          <ProjectHeader 
            projectName={projectName} 
            projectId={parseInt(projectId!)} 
            workspaceId={workspaceId}
          />

          <div className="relative">
            {moveError && (
              <div className="animate-fade-in-out absolute inset-x-0 top-0 z-50 mx-auto max-w-md transform rounded-md bg-red-500 px-4 py-2 text-center text-sm text-white shadow-lg">
                <div className="flex items-center justify-center">
                  <svg 
                    className="mr-2 size-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  {moveError}
                </div>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="flex h-[calc(100vh-5rem)] flex-1 gap-4 overflow-x-auto p-4">
                <div className="flex gap-4 pb-4">
                  {cards.map((card) => (
                    <CardList 
                      key={card.id} 
                      card={card} 
                      onDeleteCard={handleDeleteCard}
                      refreshProjectData={refreshProjectData}
                    />
                  ))}
                  <AddCardSection 
                    isAddingCard={isAddingCard}
                    setIsAddingCard={setIsAddingCard}
                    newCardName={newCardName}
                    setNewCardName={setNewCardName}
                    handleAddCard={handleAddCard}
                  />
                </div>
              </div>

              {/* Drag overlay provides visual feedback during drag operations */}
              <DragOverlay>
                {activeTask ? (
                  <div className="rounded-lg bg-gray-700 p-3 text-white shadow-xl ring-2 ring-blue-500 opacity-80 w-64">
                    <p className="text-sm font-medium">{activeTask.name}</p>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStation;
