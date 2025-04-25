/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Checkbox, Spinner } from 'flowbite-react';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { addChecklistItem, updateChecklistItemName, toggleChecklistItemStatus, removeChecklistItem, deleteChecklist, updateChecklistName } from '../../../../../../services/ProjectTaskApi';

interface ChecklistItem {
  id: string | number;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string | number;
  title: string;
  items: ChecklistItem[];
}

interface TaskChecklistProps {
  taskId: number;
  checklists: Checklist[];
  onUpdate: () => void;
}

export const TaskChecklist: React.FC<TaskChecklistProps> = ({ taskId, checklists: initialChecklists, onUpdate }) => {
  const [checklists, setChecklists] = useState<Checklist[]>(initialChecklists);
  const [newItemText, setNewItemText] = useState<string>('');
  const [editingItem, setEditingItem] = useState<{ checklistId: string | number; itemId: string | number; text: string } | null>(null);
  const [editingChecklist, setEditingChecklist] = useState<{ checklistId: string | number; title: string } | null>(null);
  const [loadingItems, setLoadingItems] = useState<{ checklistId: string | number; itemId: string | number }[]>([]);
  const [loadingChecklists, setLoadingChecklists] = useState<(string | number)[]>([]);

  // Use a ref to track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      // Clear loading states on unmount
      setLoadingItems([]);
      setLoadingChecklists([]);
    };
  }, []);

  // Sync checklists when props change and reset loading states
  useEffect(() => {
    if (JSON.stringify(initialChecklists) !== JSON.stringify(checklists)) {
      setChecklists(initialChecklists);
      // Reset loading states to prevent stale loading indicators
      setLoadingItems([]);
      setLoadingChecklists([]);
    }
  }, [initialChecklists]);

  const isItemLoading = (checklistId: string | number, itemId: string | number) => {
    return loadingItems.some(item => item.checklistId === checklistId && item.itemId === itemId);
  };

  const isChecklistLoading = (checklistId: string | number) => {
    return loadingChecklists.includes(checklistId);
  };

  const startItemLoading = (checklistId: string | number, itemId: string | number) => {
    // Prevent duplicate entries
    if (!isItemLoading(checklistId, itemId)) {
      setLoadingItems(prev => [...prev, { checklistId, itemId }]);
    }
  };

  const stopItemLoading = (checklistId: string | number, itemId: string | number) => {
    if (isMounted.current) {
      setLoadingItems(prev => prev.filter(item => !(item.checklistId === checklistId && item.itemId === itemId)));
    }
  };

  const startChecklistLoading = (checklistId: string | number) => {
    // Prevent duplicate entries
    if (!isChecklistLoading(checklistId)) {
      setLoadingChecklists(prev => [...prev, checklistId]);
    }
  };

  const stopChecklistLoading = (checklistId: string | number) => {
    if (isMounted.current) {
      setLoadingChecklists(prev => prev.filter(id => id !== checklistId));
    }
  };

  const handleToggleItem = async (checklistId: string | number, itemId: string | number, currentCompleted: boolean) => {
    if (isItemLoading(checklistId, itemId)) return;

    startItemLoading(checklistId, itemId);
    const newCompleted = !currentCompleted;

    // Optimistic update
    setChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, completed: newCompleted } : item
              ),
            }
          : checklist
      )
    );

    try {
      await toggleChecklistItemStatus(taskId, checklistId, itemId, newCompleted);
      if (isMounted.current) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle checklist item status:', error);
      if (isMounted.current) {
        // Revert on failure
        setChecklists((prev) =>
          prev.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  items: checklist.items.map((item) =>
                    item.id === itemId ? { ...item, completed: currentCompleted } : item
                  ),
                }
              : checklist
          )
        );
      }
    } finally {
      stopItemLoading(checklistId, itemId);
    }
  };

  const handleAddItem = async (checklistId: string | number) => {
    if (!newItemText.trim() || isChecklistLoading(checklistId)) return;

    const tempId = `temp-${Date.now()}`;
    startChecklistLoading(checklistId);

    // Optimistic update
    const newItem = { id: tempId, text: newItemText, completed: false };
    setChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, items: [...checklist.items, newItem] }
          : checklist
      )
    );
    setNewItemText('');

    try {
      await addChecklistItem(taskId, checklistId, newItemText);
      if (isMounted.current) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add checklist item:', error);
      if (isMounted.current) {
        // Revert on failure
        setChecklists((prev) =>
          prev.map((checklist) =>
            checklist.id === checklistId
              ? { ...checklist, items: checklist.items.filter((item) => item.id !== tempId) }
              : checklist
          )
        );
      }
    } finally {
      stopChecklistLoading(checklistId);
    }
  };

  const handleEditItem = (checklistId: string | number, item: ChecklistItem) => {
    if (isItemLoading(checklistId, item.id)) return;
    setEditingItem({ checklistId, itemId: item.id, text: item.text });
  };

  const handleSaveEdit = async (checklistId: string | number, itemId: string | number) => {
    if (!editingItem || !editingItem.text.trim()) {
      setEditingItem(null);
      return;
    }

    if (isItemLoading(checklistId, itemId)) return;

    startItemLoading(checklistId, itemId);
    const originalText = checklists
      .find((c) => c.id === checklistId)
      ?.items.find((i) => i.id === itemId)?.text;

    // Optimistic update
    setChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map((item) =>
                item.id === itemId ? { ...item, text: editingItem.text } : item
              ),
            }
          : checklist
      )
    );
    setEditingItem(null);

    try {
      await updateChecklistItemName(taskId, checklistId, itemId, editingItem.text);
      if (isMounted.current) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update checklist item name:', error);
      if (isMounted.current) {
        // Revert on failure
        setChecklists((prev) =>
          prev.map((checklist) =>
            checklist.id === checklistId
              ? {
                  ...checklist,
                  items: checklist.items.map((item) =>
                    item.id === itemId ? { ...item, text: originalText || '' } : item
                  ),
                }
              : checklist
          )
        );
      }
    } finally {
      stopItemLoading(checklistId, itemId);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleDeleteItem = async (checklistId: string | number, itemId: string | number) => {
    if (isItemLoading(checklistId, itemId)) return;

    startItemLoading(checklistId, itemId);
    const itemToDelete = checklists
      .find((c) => c.id === checklistId)
      ?.items.find((i) => i.id === itemId);

    // Optimistic update
    setChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, items: checklist.items.filter((item) => item.id !== itemId) }
          : checklist
      )
    );

    try {
      await removeChecklistItem(taskId, checklistId, itemId);
      if (isMounted.current) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete checklist item:', error);
      if (isMounted.current && itemToDelete) {
        // Revert on failure
        setChecklists((prev) =>
          prev.map((checklist) =>
            checklist.id === checklistId
              ? { ...checklist, items: [...checklist.items, itemToDelete] }
              : checklist
          )
        );
      }
    } finally {
      stopItemLoading(checklistId, itemId);
    }
  };

  const handleEditChecklistTitle = (checklistId: string | number, title: string) => {
    setEditingChecklist({ checklistId, title });
  };

  const handleSaveChecklistTitle = async (checklistId: string | number) => {
    if (!editingChecklist || !editingChecklist.title.trim()) {
      setEditingChecklist(null);
      return;
    }

    if (isChecklistLoading(checklistId)) {
      setEditingChecklist(null);
      return;
    }

    startChecklistLoading(checklistId);
    const originalTitle = checklists.find((c) => c.id === checklistId)?.title;

    // Optimistic update
    setChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, title: editingChecklist.title }
          : checklist
      )
    );
    setEditingChecklist(null);

    try {
      await updateChecklistName(taskId, checklistId, editingChecklist.title);
      if (isMounted.current) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update checklist title:', error);
      if (isMounted.current) {
        // Revert on failure
        setChecklists((prev) =>
          prev.map((checklist) =>
            checklist.id === checklistId
              ? { ...checklist, title: originalTitle || '' }
              : checklist
          )
        );
      }
    } finally {
      stopChecklistLoading(checklistId);
    }
  };

  const handleCancelEditChecklistTitle = () => {
    setEditingChecklist(null);
  };

  const handleDeleteChecklist = async (checklistId: string | number) => {
    if (isChecklistLoading(checklistId)) return;

    startChecklistLoading(checklistId);
    const checklistToDelete = checklists.find((c) => c.id === checklistId);

    // Optimistic update
    setChecklists((prev) => prev.filter((checklist) => checklist.id !== checklistId));

    try {
      await deleteChecklist(taskId, checklistId);
      if (isMounted.current) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete checklist:', error);
      if (isMounted.current && checklistToDelete) {
        // Revert on failure
        setChecklists((prev) => [...prev, checklistToDelete]);
      }
    } finally {
      stopChecklistLoading(checklistId);
    }
  };

  const calculateProgress = (items: ChecklistItem[]) => {
    if (items.length === 0) return 0;
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };

  return (
    <div className="space-y-4">
      {checklists.map((checklist) => (
        <div key={checklist.id} className="rounded-xl bg-slate-800/80 p-4 shadow-lg backdrop-blur-md">
          {/* Checklist Title */}
          <div className="mb-2 flex items-center justify-between">
            {editingChecklist?.checklistId === checklist.id ? (
              <div className="flex w-full items-center gap-2">
                <input
                  type="text"
                  value={editingChecklist.title}
                  onChange={(e) => setEditingChecklist({ ...editingChecklist, title: e.target.value })}
                  className="flex-1 rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-base text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveChecklistTitle(checklist.id);
                    if (e.key === 'Escape') handleCancelEditChecklistTitle();
                  }}
                  onBlur={() => handleSaveChecklistTitle(checklist.id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEditChecklistTitle}
                  className="text-slate-400 hover:bg-slate-800 hover:text-indigo-300"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-indigo-300">{checklist.title}</h3>
                  {isChecklistLoading(checklist.id) && (
                    <Spinner size="sm" className="text-indigo-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-200"
                    onClick={() => handleEditChecklistTitle(checklist.id, checklist.title)}
                    disabled={isChecklistLoading(checklist.id)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-rose-500 hover:bg-rose-500/20 hover:text-rose-400"
                    onClick={() => handleDeleteChecklist(checklist.id)}
                    disabled={isChecklistLoading(checklist.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-medium text-indigo-200">
                {calculateProgress(checklist.items)}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-900/50">
              <div
                className="h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-500 ease-in-out"
                style={{ width: `${calculateProgress(checklist.items)}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            {checklist.items.map((item) => (
              <div key={item.id} className="group flex items-center gap-2">
                <div className="flex items-center">
                  <Checkbox
                    checked={item.completed}
                    onChange={() => handleToggleItem(checklist.id, item.id, item.completed)}
                    className="text-indigo-400 focus:ring-indigo-400"
                    disabled={isItemLoading(checklist.id, item.id)}
                  />
                  {isItemLoading(checklist.id, item.id) && (
                    <Spinner size="sm" className="ml-2 text-indigo-400" />
                  )}
                </div>
                {editingItem?.checklistId === checklist.id && editingItem?.itemId === item.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={editingItem.text}
                      onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                      className="flex-1 rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(checklist.id, item.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      onBlur={() => handleSaveEdit(checklist.id, item.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-slate-400 hover:bg-slate-800 hover:text-indigo-300"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 cursor-pointer text-xs ${
                        item.completed ? 'text-slate-400 line-through' : 'text-indigo-200'
                      }`}
                      onClick={() => handleEditItem(checklist.id, item)}
                    >
                      {item.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-rose-500 opacity-0 hover:bg-rose-500/20 hover:text-rose-400 group-hover:opacity-100"
                      onClick={() => handleDeleteItem(checklist.id, item.id)}
                      disabled={isItemLoading(checklist.id, item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Item Field */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add an item"
              className="flex-1 rounded-lg border-indigo-500/20 bg-slate-900/50 py-1.5 text-xs text-indigo-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-indigo-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newItemText.trim()) handleAddItem(checklist.id);
              }}
              disabled={isChecklistLoading(checklist.id)}
            />
            <Button
              size="sm"
              onClick={() => handleAddItem(checklist.id)}
              className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
              disabled={!newItemText.trim() || isChecklistLoading(checklist.id)}
            >
              Add Item
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};