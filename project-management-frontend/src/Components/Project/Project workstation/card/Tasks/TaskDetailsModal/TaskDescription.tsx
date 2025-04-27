/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { Textarea } from 'flowbite-react';

interface TaskDescriptionProps {
  description: string;
  isEditing: boolean;
  isLoading: boolean;
  error: string | null;
  onStartEdit: () => void;
  onSave: (description: string) => void;
  onCancel: () => void;
}

export const TaskDescription: React.FC<TaskDescriptionProps> = ({
  description,
  isEditing,
  isLoading,
  error,
  onStartEdit,
  onSave,
  onCancel,
}) => {
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    onSave(editedDescription);
  };

  return (
    <div className="rounded-xl bg-slate-800/80 p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-indigo-300">Description</h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onStartEdit}
            className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
          >
            <Edit className="mr-2 size-4" />
            Edit
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="min-h-[120px] w-full rounded-lg border-indigo-500/20 bg-slate-900/50 text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
            placeholder="Add a description..."
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div className="flex gap-2">
            <Button
              
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
            >
              <Save className="mr-2 size-4" />
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              <X className="mr-2 size-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p
          className="text-indigo-200"
          onClick={onStartEdit}
        >
          {description || 'No description provided. Click to add one.'}
        </p>
      )}
    </div>
  );
};