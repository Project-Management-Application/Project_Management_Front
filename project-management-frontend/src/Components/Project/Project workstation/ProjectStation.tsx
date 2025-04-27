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
  const [members, setMembers] = useState<Member[]>([]);
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(true); // Only for initial load
  const [newCardName, setNewCardName] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isSubmittingCard, setIsSubmittingCard] = useState(false);
  const [, setActiveTaskId] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [projectName, setProjectName] = useState('');
  const [workspaceId, setWorkspaceId] = useState<number>(0);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

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
      console.log('[fetchProjectData] Fetching project data for projectId:', projectId);
      const [projectData, membersData] = await Promise.all([
        getProjectDetails(parseInt(projectId)),
        getProjectMembers(parseInt(projectId)),
      ]);
      console.log('[fetchProjectData] Project data:', projectData);
      console.log('[fetchProjectData] Members data:', membersData);

      setProjectName(projectData.name || 'Untitled Project');
      setWorkspaceId(projectData.workspaceId);
      setMembers(membersData);

      const mappedCards: ProjectCard[] = projectData.cards.map((card: BackendProjectCard, index: number) => ({
        id: card.id,
        name: card.name,
        tasks: Array.isArray(card.tasks)
          ? card.tasks.map((backendTask: Task) => ({
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
            }))
          : [],
        color: cardColors[index % cardColors.length],
        isTemporary: false,
      }));

      console.log('[fetchProjectData] Mapped cards:', mappedCards);
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
      console.error('[fetchProjectData] Failed to fetch project details or members:', error);
      setCardError('Failed to load project data. Please try refreshing.');
      setTimeout(() => setCardError(null), 5000);
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
    console.log('[refreshProjectData] Starting refresh');
    try {
      await fetchProjectData();
      console.log('[refreshProjectData] Refresh successful');
    } catch (error) {
      console.error('[refreshProjectData] Error:', error);
      throw error; // Propagate error to caller
    }
  }, [fetchProjectData]);

  const handleAddCard = async () => {
    if (!newCardName.trim() || !projectId || isSubmittingCard) return;

    const tempId = -Date.now();
    const tempCard: ProjectCard = {
      id: tempId,
      name: newCardName.trim(),
      tasks: [],
      color: cardColors[cards.length % cardColors.length],
      isTemporary: true,
    };

    try {
      setIsSubmittingCard(true);
      setCardError(null);

      // Add temporary card optimistically
      setCards((prevCards) => {
        console.log('[handleAddCard] Adding temporary card:', tempCard);
        return [...prevCards, tempCard];
      });
      setNewCardName('');
      setIsAddingCard(false);

      // Call API to add card
      const response = await addCardToProject(parseInt(projectId), newCardName.trim());
      console.log('[handleAddCard] addCardToProject response:', response);

      // Refresh project data to get the real card
      console.log('[handleAddCard] Calling refreshProjectData');
      await refreshProjectData();
      console.log('[handleAddCard] refreshProjectData completed');

      // Verify the new card is in the state
      const newCardExists = cards.some((card) => card.name === newCardName && !card.isTemporary);
      if (!newCardExists) {
        console.warn('[handleAddCard] New card not found in state after refresh');
        
      }
    } catch (error) {
      console.error('[handleAddCard] Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add card';
      console.log('[handleAddCard] Removing temporary card due to error:', errorMessage);
      setCards((prevCards) => prevCards.filter((card) => card.id !== tempId));
      setCardError(errorMessage);
      setTimeout(() => setCardError(null), 5000);
    } finally {
      setIsSubmittingCard(false);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  const findTaskById = (taskId: number): { task: Task; cardId: number; index: number } | null => {
    for (const card of cards) {
      const taskIndex = card.tasks.findIndex((task) => task.id === taskId);
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
      const destCard = cards.find((card) => card.id === destinationCardId);
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
      setTimeout(() => setMoveError(null), 5000);
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
                <div className="flex items-center justify-center">{moveError}</div>
              </div>
            )}

            {cardError && (
              <div className="animate-fade-in-out absolute inset-x-0 top-0 z-50 mx-auto max-w-md rounded-md bg-red-500 px-4 py-2 text-center text-sm text-white shadow-lg">
                <div className="flex items-center justify-center">{cardError}</div>
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
                      projectId={parseInt(projectId!)}
                      members={members}
                      onDeleteCard={handleDeleteCard}
                      refreshProjectData={refreshProjectData}
                      isTemporary={card.isTemporary}
                    />
                  ))}
                  <AddCardSection
                    isAddingCard={isAddingCard}
                    setIsAddingCard={setIsAddingCard}
                    newCardName={newCardName}
                    setNewCardName={setNewCardName}
                    handleAddCard={handleAddCard}
                    isSubmitting={isSubmittingCard}
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