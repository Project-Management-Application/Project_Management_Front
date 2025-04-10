// src/components/ProjectStation/CardHeader.tsx
import React from 'react';
import { ProjectCard } from '../../../../types/ProjectCard';
;

interface CardHeaderProps {
  card: ProjectCard;
  onDeleteCard: (cardId: number) => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({ card, onDeleteCard }) => {
  return (
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
                  onClick={() => onDeleteCard(card.id)}
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
  );
};

export default CardHeader;