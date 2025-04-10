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

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        navigate('/Dashboard/projects');
        return;
      }

      try {
        const data: ProjectDetails = await getProjectDetails(parseInt(projectId));
        setProjectName(data.name || 'Untitled Project');
        
        // Map backend ProjectCard entities to our ProjectCard interface
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

        // Set background style - adding a very slight blur only to the image
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
          setBackgroundStyle({ backgroundColor: '#1e3a8a' }); // Fallback to match preview
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
      // Create a new card object without an ID
      const newCard: ProjectCard = {
        id: Date.now(), // We can use a timestamp for temporary purposes but won't rely on it for ID
        name: newCardName.trim(),
        tasks: [],
        color: cardColors[cards.length % cardColors.length],
      };

      // Optimistically update the local state
      setCards((prevCards) => [...prevCards, newCard]);
      setNewCardName(''); // Clear the input field
      setIsAddingCard(false); // Close the input field

      try {
        // Call the API to add the new card to the project
        await addCardToProject(parseInt(projectId), newCardName); // API call
        
        // Re-fetch the project details to ensure the UI is consistent
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
        setCards(mappedCards); // Update state with fresh data
      } catch (error) {
        console.error('Failed to add card:', error);
        // Optionally show an error message to the user
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
      {/* Project Content Container with relative positioning and proper containment */}
      <div className="relative size-full overflow-hidden rounded-lg">
        {/* Background layers */}
        <div className="absolute inset-0 rounded-lg" style={backgroundStyle}></div>
        <div className="absolute inset-0 rounded-lg bg-gray-900/40"></div>

        {/* Project Content with proper z-index */}
        <div className="relative z-[1] flex h-full flex-col rounded-lg">
          {/* Project Header */}
          <ProjectHeader projectName={projectName} />

          {/* Cards Container */}
          <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <div className="flex flex-1 gap-4 overflow-x-auto p-4">
              {/* Cards */}
              {cards.map((card) => (
                <CardList 
                  key={card.id} 
                  card={card} 
                  onDeleteCard={handleDeleteCard} 
                />
              ))}

              {/* Add Another Card */}
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

      {/* Loading overlay when dragging - constrained to the main content area */}
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-[2] rounded-lg bg-blue-500/10" />
      )}
    </div>
  );
};

export default ProjectStation;