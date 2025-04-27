/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { Checkbox } from 'flowbite-react';
import { fetchAllLabels } from '../../../../../../services/ProjectTaskApi';

interface Label {
  id: string | number;
  tagValue: string;
  color: string;
  categoryId: string | number | null;
  default: boolean;
}

interface LabelCategory {
  id: string | number;
  name: string;
  labels: Label[];
  default: boolean;
}

interface LabelSelectionModalProps {
  onClose: () => void;
  selectedLabels?: (string | number)[];
  onSave: (selectedLabels: (string | number)[]) => void;
}

export const LabelSelectionModal: React.FC<LabelSelectionModalProps> = ({
  onClose,
  selectedLabels = [],
  onSave,
}) => {
  const [categories, setCategories] = useState<LabelCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(null);
  const [selected, setSelected] = useState<(string | number)[]>(selectedLabels);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLabels = async () => {
      try {
        setLoading(true);
        const data = await fetchAllLabels();
        console.log('[LabelSelectionModal] API Response:', data); // Debug log
        // Ensure data is an array; fallback to empty array if not
        const categoriesData = Array.isArray(data) ? data : [];
        setCategories(categoriesData);
        // Default to the first category if available
        if (categoriesData.length > 0) {
          setSelectedCategoryId(categoriesData[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch labels:', err);
        setError('Failed to load labels');
        setCategories([]); // Ensure categories is an array even on error
      } finally {
        setLoading(false);
      }
    };
    loadLabels();
  }, []);

  const handleToggleLabel = (id: string | number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((labelId) => labelId !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  // Ensure categories is an array before calling .find()
  const currentLabels = Array.isArray(categories)
    ? categories.find(cat => cat.id === selectedCategoryId)?.labels || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/70 to-black/50 backdrop-blur-md transition-opacity duration-300">
      <div
        className="w-[95vw] max-w-md rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 shadow-2xl ring-1 ring-indigo-500/30 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <h2 className="text-base font-semibold text-indigo-300">Labels</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 transition-all hover:scale-110 hover:bg-slate-800 hover:text-indigo-300"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="my-3">
          <select
            value={selectedCategoryId ?? ''}
            onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
            disabled={loading || categories.length === 0}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
        </div>

        {/* Labels List */}
        <div className="scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-slate-900 mb-4 max-h-64 overflow-y-auto">
          {loading ? (
            <p className="text-xs text-indigo-200">Loading labels...</p>
          ) : error ? (
            <p className="text-xs text-rose-400">{error}</p>
          ) : currentLabels.length > 0 ? (
            <div className="space-y-2">
              {currentLabels.map((label) => (
                <div
                  key={label.id}
                  className="flex items-center gap-2 rounded-lg border border-indigo-500/20 p-2 transition-all hover:border-indigo-400/50 hover:bg-indigo-500/10"
                >
                  <Checkbox
                    checked={selected.includes(label.id)}
                    onChange={() => handleToggleLabel(label.id)}
                    className="text-indigo-400 focus:ring-indigo-400"
                  />
                  <div
                    className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium text-indigo-200"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.tagValue}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-indigo-200">No labels available for this category.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
            disabled={loading}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};