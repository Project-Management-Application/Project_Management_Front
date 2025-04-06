import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { ProjectDetails, BackendProjectCard } from '../../types/ProjectDetails';
import { ProjectCard } from '../../types/ProjectCard';
import { addCardToProject, getProjectDetails } from '../../services/project-apis';
import { Task } from '../../types/Task';

const cardColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-emerald-500 to-emerald-600',
];

const ProjectStation: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(true);
  const [newCardName, setNewCardName] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        navigate('/Dashboard/projects');
        return;
      }

      try {
        const data: ProjectDetails = await getProjectDetails(parseInt(projectId));
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

        // Set background style
        if (data.backgroundImage) {
          setBackgroundStyle({ background: `url(${data.backgroundImage}) center/cover no-repeat` });
        } else if (data.backgroundColor) {
          setBackgroundStyle({ backgroundColor: data.backgroundColor });
        } else if (data.modelBackgroundImage) {
          setBackgroundStyle({ background: `url(${data.modelBackgroundImage}) center/cover no-repeat` });
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
        // If desired, we can remove the card from the local state
        // setCards((prevCards) => prevCards.filter((card) => card.id !== newCard.id));
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
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <div className="size-12 animate-spin rounded-full border-y-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto" style={backgroundStyle}>
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4">
          {/* Cards */}
          {cards.map((card) => (
            <Droppable droppableId={card.id.toString()} key={card.id}>
              {(provided, snapshot) => (
                <div
                  className={`flex w-64 shrink-0 flex-col rounded-lg bg-gray-800 bg-opacity-80 transition-all duration-300 ${
                    snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* Card Header */}
                  <div
                    className={`rounded-t-lg bg-gradient-to-r px-3 py-2 ${card.color} flex items-center justify-between`}
                  >
                    <h3 className="text-sm font-semibold uppercase text-white">{card.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="rounded-full bg-white bg-opacity-20 px-2 py-0.5 text-xs font-medium text-white">
                        {card.tasks.length}
                      </span>
                      <div className="group relative">
                        <button className="text-white transition-colors duration-200 hover:text-gray-200">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                        <div className="absolute right-0 z-20 mt-1 w-32 origin-top-right scale-0 rounded-lg bg-gray-700 shadow-lg transition-transform duration-200 ease-out group-hover:scale-100">
                          <div className="py-1">
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="flex w-full items-center px-3 py-1 text-xs text-white hover:bg-gray-600"
                            >
                              <svg
                                className="mr-1 size-3 text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
                                />
                              </svg>
                              Delete Card
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Container */}
                  <div className="space-y-2 p-2">
                    {card.tasks.map((task, index) => (
                      <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`rounded-lg bg-gray-700 p-3 text-white transition-all duration-300 ${
                              snapshot.isDragging
                                ? 'scale-105 shadow-xl ring-2 ring-blue-500'
                                : 'hover:-translate-y-1 hover:shadow-lg'
                            }`}
                          >
                            <p className="text-sm">{task.name}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}

          {/* Add Another Card */}
          <div className="w-64 shrink-0">
            {isAddingCard ? (
              <div className="h-min rounded-lg bg-gray-800 bg-opacity-80 p-2">
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Enter card title..."
                  className="w-full rounded-lg bg-gray-600 p-2 text-sm text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={handleAddCard}
                    className="flex items-center rounded-lg bg-blue-600 px-3 py-1 text-sm text-white transition-all duration-200 hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingCard(false)}
                    className="rounded-lg bg-gray-600 px-3 py-1 text-sm text-white transition-all duration-200 hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="flex h-12 w-full items-center justify-center gap-1 rounded-lg bg-gray-700 bg-opacity-50 p-2 text-sm text-white transition-all duration-300 hover:bg-opacity-70"
              >
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add another card
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Loading overlay when dragging */}
      {isDragging && <div className="pointer-events-none fixed inset-0 z-30 bg-blue-500 bg-opacity-5" />}
    </div>
  );
};

export default ProjectStation;
