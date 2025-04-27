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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import CardList from './card/CardList';
import ProjectHeader from './ProjectHeader';
import AddCardSection from './card/AddCardSection';
import { ProjectCard } from '../../../types/ProjectCard';
import { BackendProjectCard } from '../../../types/ProjectDetails';
import { Task } from '../../../types/Task';
import { cardColors } from '../../../utils/cardColors';
import LoadingOverlay from '../../UI/LoadingOverlay';
import { addCardToProject, getProjectDetails, moveTask, getProjectMembers } from '../../../services/project-apis';

interface Member {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

const ProjectStation: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [members, setMembers] = useState<Member[]>([]); // Added members state
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(true);
  const [newCardName, setNewCardName] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [, setActiveTaskId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState('');
  const [workspaceId, setWorkspaceId] = useState<number>(0);
  const [moveError, setMoveError] = useState<string | null>(null);

  // Configure the sensors for different input methods
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
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
      const [projectData, membersData] = await Promise.all([
        getProjectDetails(parseInt(projectId)),
        getProjectMembers(parseInt(projectId)), // Fetch members
      ]);

      setProjectName(projectData.name || 'Untitled Project');
      setWorkspaceId(projectData.workspaceId);
      setMembers(membersData); // Store members

      const mappedCards: ProjectCard[] = projectData.cards.map((card: BackendProjectCard, index: number) => ({
        id: card.id,
        name: card.name,
        tasks: Array.isArray(card.tasks) ? card.tasks.map((backendTask: Task) => ({
          id: backendTask.id,
          name: backendTask.name,
          cardId: card.id,
          description: backendTask.description,
          coverImage: backendTask.coverImage,
          coverColor: backendTask.coverColor,
          status: backendTask.status,
          checklists: backendTask.checklists,
          labels: backendTask.labels,
          comments: backendTask.comments,
          attachments: backendTask.attachments,
          assignedMemberIds: backendTask.assignedMemberIds,
          startDate: backendTask.startDate,
          dueDate: backendTask.dueDate,
          dueDateReminder: backendTask.dueDateReminder,
        })) : [],
        color: cardColors[index % cardColors.length],
      }));

      setCards(mappedCards);

      if (projectData.backgroundImage) {
        setBackgroundStyle({ 
          background: `url(${projectData.backgroundImage}) center/cover no-repeat`,
        });
      } else if (projectData.backgroundColor) {
        setBackgroundStyle({ backgroundColor: projectData.backgroundColor });
      } else if (projectData.modelBackgroundImage) {
        setBackgroundStyle({ 
          background: `url(${projectData.modelBackgroundImage}) center/cover no-repeat`,
        });
      } else {
        setBackgroundStyle({ backgroundColor: '#1e3a8a' });
      }
    } catch (error) {
      console.error('Failed to fetch project details or members:', error);
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

  const findTaskById = (taskId: number): { task: Task, cardId: number, index: number } | null => {
    for (const card of cards) {
      const taskIndex = card.tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        return { task: card.tasks[taskIndex], cardId: card.id, index: taskIndex };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = parseInt(active.id.toString());

    const taskInfo = findTaskById(taskId);
    if (taskInfo) {
      setActiveTaskId(taskId);
      setActiveTask(taskInfo.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    if (!overId.toString().includes('card-')) return;
    
    const activeTaskInfo = findTaskById(parseInt(activeId.toString()));
    if (!activeTaskInfo) return;
    
    const activeCardId = activeTaskInfo.cardId;
    const overCardId = parseInt(overId.toString().replace('card-', ''));
    
    if (activeCardId === overCardId) return;
  };

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
    
    if (over.id.toString().includes('card-')) {
      destinationCardId = parseInt(over.id.toString().replace('card-', ''));
      const destCard = cards.find(card => card.id === destinationCardId);
      destinationIndex = destCard ? destCard.tasks.length : 0;
    } else {
      const overTaskId = parseInt(over.id.toString());
      const overTaskInfo = findTaskById(overTaskId);
      
      if (!overTaskInfo) return;
      
      destinationCardId = overTaskInfo.cardId;
      destinationIndex = overTaskInfo.index;
    }
    
    if (activeTaskInfo.cardId === destinationCardId && activeTaskInfo.index === destinationIndex) {
      return;
    }
    
    const newCards = JSON.parse(JSON.stringify(cards));
    
    const sourceCard = newCards.find((card: ProjectCard) => card.id === activeTaskInfo.cardId);
    const [movedTask] = sourceCard.tasks.splice(activeTaskInfo.index, 1);
    
    const destCard = newCards.find((card: ProjectCard) => card.id === destinationCardId);
    destCard.tasks.splice(destinationIndex, 0, movedTask);
    
    setCards(newCards);
    setMoveError(null);
    
    try {
      await moveTask(activeId, destinationCardId);
      refreshProjectData();
    } catch (error) {
      console.error('Error moving task:', error);
      setCards(cards);
      setMoveError(error instanceof Error ? error.message : 'Failed to move task');
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
              <div className="animate-fade-in-out absolute inset-x-0 top-0 z-50 mx-auto max-w-md rounded-md bg-red-500 px-4 py-2 text-center text-sm text-white shadow-lg">
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
                      projectId={parseInt(projectId!)} // Pass projectId
                      members={members} // Pass members
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

              <DragOverlay>
                {activeTask ? (
                  <div className="w-64 rounded-lg bg-gray-700 p-3 text-white opacity-80 shadow-xl ring-2 ring-blue-500">
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