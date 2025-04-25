/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../../UI/Button';

interface ChecklistModalProps {
  onClose: () => void;
  onSave: (checklist: { title: string; items: { id: string | number; text: string; completed: boolean }[] }) => void;
}

export const ChecklistModal: React.FC<ChecklistModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState<string>('Checklist');

  const handleSave = () => {
    if (!title.trim()) {
      return; // Prevent saving empty title
    }
    onSave({
      title,
      items: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-md transition-opacity duration-300">
      <div
        className="w-[95vw] max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-2xl ring-1 ring-indigo-500/30 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <h2 className="text-base font-semibold text-indigo-300">Add Checklist</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-all hover:scale-110 hover:bg-slate-800 hover:text-indigo-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Title Field */}
        <div className="my-4">
          <label className="mb-1 block text-xs font-medium text-indigo-300">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
            placeholder="Checklist"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:bg-slate-800 hover:text-indigo-300"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};