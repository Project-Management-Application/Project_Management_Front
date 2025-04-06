import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { ProjectDetails, BackendProjectCard } from '../../types/ProjectDetails';
import { ProjectCard } from '../../types/ProjectCard';
import { addCardToProject, getProjectDetails } from '../../services/project-apis';
import { Task } from '../../types/Task';

// Enhanced card color palette with better contrast
const cardColors = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800',
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
            backdropFilter: 'blur(2px)' 
          });
        } else if (data.backgroundColor) {
          setBackgroundStyle({ backgroundColor: data.backgroundColor });
        } else if (data.modelBackgroundImage) {
          setBackgroundStyle({ 
            background: `url(${data.modelBackgroundImage}) center/cover no-repeat`,
            backdropFilter: 'blur(2px)' 
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
    return (
      <div className="flex h-full items-center justify-center bg-gray-900/90">
        <div className="flex flex-col items-center gap-4">
          <div className="size-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-lg font-medium text-white">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden" style={backgroundStyle}>
      {/* Semi-transparent overlay without blur */}
      <div className="absolute inset-0 bg-gray-900/40"></div>

      {/* Project Header - Redesigned to match reference */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-blue-900/80 px-4 py-2">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-white">{projectName}</h1>
          <div className="ml-6 flex items-center gap-4">
            <button className="flex items-center gap-1 rounded bg-blue-800 px-3 py-1 text-sm font-medium text-white">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              Board
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded bg-blue-700/60 p-2 text-white hover:bg-blue-700/80">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button className="rounded bg-blue-700/60 p-2 text-white hover:bg-blue-700/80">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013.586 6z" />
            </svg>
          </button>
          <button className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-blue-900">
            Share
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="relative z-10 flex flex-1 gap-4 overflow-x-auto p-4">
          {/* Cards - Keeping original style but smaller width */}
          {cards.map((card) => (
            <Droppable droppableId={card.id.toString()} key={card.id}>
              {(provided, snapshot) => (
                <div
                  className={`flex w-64 shrink-0 flex-col rounded-xl bg-gray-800/80 shadow-lg ${
                    snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* Card Header - Original style with gradient */}
                  <div className={`rounded-t-xl bg-gradient-to-r p-3 ${card.color}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">{card.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                          {card.tasks.length}
                        </span>
                        <div className="group relative">
                          <button className="rounded-full p-1 text-white transition-colors duration-200 hover:bg-white/10">
                            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </button>
                          <div className="absolute right-0 z-20 mt-1 w-40 origin-top-right scale-0 rounded-lg bg-gray-800 shadow-xl transition-all duration-200 ease-out group-hover:scale-100">
                            <div className="py-1">
                              <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="flex w-full items-center px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
                              >
                                <svg
                                  className="mr-2 size-4 text-red-400"
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
                  </div>

                  {/* Tasks Container - Dynamic height */}
                  <div className="flex flex-col gap-3 overflow-y-auto p-3">
                    {card.tasks.map((task, index) => (
                      <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                        {(provided, snapshot) => (
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {card.tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-4 text-center text-gray-400">
                        <svg className="mb-2 size-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">No tasks yet</p>
                      </div>
                    )}
                    <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:bg-gray-700/50 hover:text-white">
                      <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add a task
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          ))}

          {/* Add Another Card */}
          <div className="w-64 shrink-0">
            {isAddingCard ? (
              <div className="rounded-xl bg-gray-800/80 p-4 shadow-lg">
                <h3 className="mb-2 text-sm font-medium text-white">Add new card</h3>
                <input
                  type="text"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  placeholder="Enter card title..."
                  className="w-full rounded-lg bg-gray-700 p-3 text-sm text-white transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingCard(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCard}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Add Card
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCard(true)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-600/50 bg-gray-800/50 p-3 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/70 hover:text-white"
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New List
              </button>
            )}
          </div>
        </div>
      </DragDropContext>

      {/* Loading overlay when dragging */}
      {isDragging && (
        <div className="pointer-events-none fixed inset-0 z-30 bg-blue-500/10" />
      )}
    </div>
  );
};

export default ProjectStation;