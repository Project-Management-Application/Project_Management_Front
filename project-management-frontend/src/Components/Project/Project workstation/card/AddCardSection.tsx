// src/components/ProjectStation/AddCardSection.tsx
import React from 'react';

interface AddCardSectionProps {
  isAddingCard: boolean;
  setIsAddingCard: (value: boolean) => void;
  newCardName: string;
  setNewCardName: (value: string) => void;
  handleAddCard: () => void;
}

const AddCardSection: React.FC<AddCardSectionProps> = ({
  isAddingCard,
  setIsAddingCard,
  newCardName,
  setNewCardName,
  handleAddCard,
}) => {
  return (
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
  );
};

export default AddCardSection;