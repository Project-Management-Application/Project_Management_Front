import React from 'react';
import { Plus, X } from 'lucide-react';

interface AddCardSectionProps {
  isAddingCard: boolean;
  setIsAddingCard: (value: boolean) => void;
  newCardName: string;
  setNewCardName: (value: string) => void;
  handleAddCard: () => void;
  isSubmitting?: boolean;
}

const AddCardSection: React.FC<AddCardSectionProps> = ({
  isAddingCard,
  setIsAddingCard,
  newCardName,
  setNewCardName,
  handleAddCard,
  isSubmitting = false,
}) => {
  if (isAddingCard) {
    return (
      <div className="flex w-64 shrink-0 flex-col rounded-xl bg-gray-800/80 p-3 shadow-lg">
        <input
          type="text"
          placeholder="Enter card name..."
          value={newCardName}
          onChange={(e) => setNewCardName(e.target.value)}
          className="mb-3 w-full rounded-lg bg-gray-700 p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setIsAddingCard(false);
              setNewCardName('');
            }}
            className="flex items-center gap-1 rounded-lg p-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
            disabled={isSubmitting}
          >
            <X className="size-4" />
            Cancel
          </button>
          <button
            onClick={handleAddCard}
            disabled={!newCardName.trim() || isSubmitting}
            className="flex items-center gap-1 rounded-lg bg-blue-600 p-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-600/50 disabled:text-white/50"
          >
            <Plus className="size-4" />
            {isSubmitting ? 'Adding...' : 'Add Card'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAddingCard(true)}
      className="flex w-64 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-700 p-6 text-gray-400 transition-colors hover:border-gray-600 hover:bg-gray-800/50 hover:text-white"
    >
      <Plus className="size-5" />
      <span>Add new card</span>
    </button>
  );
};

export default AddCardSection;