// src/components/ProjectStation/ProjectStation.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import { ProjectDetails, BackendProjectCard } from '../../../types/ProjectDetails';
import { ProjectCard } from '../../../types/ProjectCard';
import { addCardToProject, getProjectDetails } from '../../../services/project-apis';
import { Task } from '../../../types/Task';
import CardList from './card/CardList';
import LoadingOverlay from '../../UI/LoadingOverlay';
import ProjectHeader from './ProjectHeader';
import AddCardSection from './card/AddCardSection';
import { cardColors } from '../../../utils/cardColors';

const ProjectStation: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(true);
  const [newCardName, setNewCardName] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [workspaceId, setWorkspaceId] = useState<number>(0); // Add workspaceId state

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        navigate('/Dashboard/projects');
        return;
      }

      try {
        const data: ProjectDetails = await getProjectDetails(parseInt(projectId));
        setProjectName(data.name || 'Untitled Project');
        setWorkspaceId(data.workspaceId); // Set workspaceId from API response
        
        const mappedCards: ProjectCard[] = data.cards.map((card: BackendProjectCard, index: number) => ({
          id: card.id,
          name: card.name,
          tasks: (card.tasks || []).map((backendTask: Task) => ({
            id: backendTask.id,
            name: backendTask.name,
          })),
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

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch project details:', error);
        navigate('/Dashboard/projects');
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  const handleAddCard = async () => {
    if (newCardName.trim() && projectId) {
      const newCard: ProjectCard = {
        id: Date.now(),
        name: newCardName.trim(),
        tasks: [],
        color: cardColors[cards.length % cardColors.length],
      };

      setCards((prevCards) => [...prevCards, newCard]);
      setNewCardName('');
      setIsAddingCard(false);

      try {
        await addCardToProject(parseInt(projectId), newCardName);
        const data: ProjectDetails = await getProjectDetails(parseInt(projectId));
        const mappedCards: ProjectCard[] = data.cards.map((card: BackendProjectCard, index: number) => ({
          id: card.id,
          name: card.name,
          tasks: (card.tasks || []).map((backendTask: Task) => ({
            id: backendTask.id,
            name: backendTask.name,
          })),
          color: cardColors[index % cardColors.length],
        }));
        setCards(mappedCards);
      } catch (error) {
        console.error('Failed to add card:', error);
      }
    }
  };

  const handleDeleteCard = (cardId: number) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    const { source, destination } = result;
    if (!destination) return;

    const sourceCardId = parseInt(source.droppableId);
    const destCardId = parseInt(destination.droppableId);

    const updatedCards = [...cards];
    const sourceCard = updatedCards.find((card) => card.id === sourceCardId);
    const destCard = updatedCards.find((card) => card.id === destCardId);

    if (!sourceCard || !destCard) return;

    const [movedTask] = sourceCard.tasks.splice(source.index, 1);
    destCard.tasks.splice(destination.index, 0, movedTask);

    setCards(updatedCards);
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
            projectId={parseInt(projectId!)} // Pass projectId
            workspaceId={workspaceId}       // Pass workspaceId
          />

          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="flex flex-1 gap-4 overflow-x-auto p-4">
              {cards.map((card) => (
                <CardList 
                  key={card.id} 
                  card={card} 
                  onDeleteCard={handleDeleteCard} 
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
          </DragDropContext>
        </div>
      </div>

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-[2] rounded-lg bg-blue-500/10" />
      )}
    </div>
  );
};

export default ProjectStation;