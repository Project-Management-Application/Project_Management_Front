// src/components/ProjectStation/CardList.tsx
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ProjectCard } from '../../../../types/ProjectCard';
import CardHeader from './CardHeader';
import TaskItem from './TaskItem';
import EmptyTasksList from './EmptyTasksList';


interface CardListProps {
  card: ProjectCard;
  onDeleteCard: (cardId: number) => void;
}

const CardList: React.FC<CardListProps> = ({ card, onDeleteCard }) => {
  return (
    <Droppable droppableId={card.id.toString()}>
      {(provided, snapshot) => (
        <div
          className={`flex w-64 shrink-0 flex-col rounded-xl bg-gray-800/80 shadow-lg ${
            snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''
          }`}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <CardHeader card={card} onDeleteCard={onDeleteCard} />

          {/* Tasks Container - Dynamic height */}
          <div className="flex flex-col gap-3 overflow-y-auto p-3">
            {card.tasks.map((task, index) => (
              <Draggable draggableId={task.id.toString()} index={index} key={task.id}>
                {(provided, snapshot) => (
                  <TaskItem task={task} provided={provided} snapshot={snapshot} />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {card.tasks.length === 0 && <EmptyTasksList />}
            
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
  );
};

export default CardList;