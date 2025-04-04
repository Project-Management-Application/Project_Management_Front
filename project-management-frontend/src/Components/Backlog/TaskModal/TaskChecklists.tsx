/* eslint-disable tailwindcss/no-contradicting-classname */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Checkbox } from "flowbite-react";
import { HiClipboard, HiTrash, HiPencil } from "react-icons/hi";
import { getTaskDetails, createChecklist, deleteChecklist, updateChecklistTitle, createChecklistItem, deleteChecklistItem, updateChecklistItemTitle, checkItem } from "../../../services/backlogApi";

type ChecklistItem = {
  checklistItemId: number;
  text: string;
  checked: boolean;
  isEditing?: boolean;
};

type Checklist = {
  checklistId: number;
  title: string;
  items: ChecklistItem[];
  isEditing?: boolean;
};

type TaskChecklistsProps = {
  taskId: number;
  showChecklistForm: boolean;
  setShowChecklistForm: (show: boolean) => void;
};

const TaskChecklists: React.FC<TaskChecklistsProps> = ({
  taskId,
  showChecklistForm,
  setShowChecklistForm,
}) => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [activeChecklistIndex, setActiveChecklistIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        const taskDetails = await getTaskDetails(taskId);
        setChecklists(
          taskDetails.checklists.map((c) => ({
            checklistId: c.checklistId,
            title: c.title,
            items: c.checklistItems.map((ci) => ({
              checklistItemId: ci.checklistItemId,
              text: ci.title,
              checked: ci.checked,
            })),
          }))
        );
      } catch (error) {
        console.error("Error fetching checklists:", error);
      }
    };
    fetchChecklists();
  }, [taskId]);

  const handleAddChecklist = async () => {
    if (!newChecklistTitle.trim()) return;
    try {
      const checklistId = await createChecklist({ taskId, title: newChecklistTitle });
      const newChecklist = { checklistId, title: newChecklistTitle, items: [] };
      setChecklists([...checklists, newChecklist]);
      setNewChecklistTitle("");
      setShowChecklistForm(false);
    } catch (error) {
      console.error("Error adding checklist:", error);
    }
  };

  const handleDeleteChecklist = async (checklistIndex: number) => {
    const checklistId = checklists[checklistIndex].checklistId;
    try {
      await deleteChecklist(checklistId);
      setChecklists(checklists.filter((_, index) => index !== checklistIndex));
    } catch (error) {
      console.error("Error deleting checklist:", error);
    }
  };

  const handleEditChecklistTitle = (checklistIndex: number) => {
    const updatedChecklists = [...checklists];
    updatedChecklists[checklistIndex].isEditing = true;
    setChecklists(updatedChecklists);
  };

  const handleSaveChecklistTitle = async (checklistIndex: number) => {
    const checklist = checklists[checklistIndex];
    try {
      await updateChecklistTitle({ checklistId: checklist.checklistId, title: checklist.title });
      const updatedChecklists = [...checklists];
      updatedChecklists[checklistIndex].isEditing = false;
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error("Error updating checklist title:", error);
    }
  };

  const handleAddChecklistItem = async (checklistIndex: number) => {
    if (!newChecklistItem.trim()) return;
    try {
      const checklistId = checklists[checklistIndex].checklistId;
      const checklistItemId = await createChecklistItem({ checklistId, title: newChecklistItem });
      const updatedChecklists = [...checklists];
      updatedChecklists[checklistIndex].items.push({
        checklistItemId,
        text: newChecklistItem,
        checked: false,
      });
      setChecklists(updatedChecklists);
      setNewChecklistItem("");
      setActiveChecklistIndex(null);
    } catch (error) {
      console.error("Error adding checklist item:", error);
    }
  };

  const handleToggleChecklistItem = async (checklistIndex: number, itemIndex: number) => {
    const checklistItemId = checklists[checklistIndex].items[itemIndex].checklistItemId;
    try {
      const newCheckedStatus = await checkItem(checklistItemId);
      const updatedChecklists = [...checklists];
      updatedChecklists[checklistIndex].items[itemIndex].checked = newCheckedStatus;
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error("Error toggling checklist item:", error);
    }
  };

  const handleDeleteChecklistItem = async (checklistIndex: number, itemIndex: number) => {
    const checklistItemId = checklists[checklistIndex].items[itemIndex].checklistItemId;
    try {
      await deleteChecklistItem(checklistItemId);
      const updatedChecklists = [...checklists];
      updatedChecklists[checklistIndex].items.splice(itemIndex, 1);
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error("Error deleting checklist item:", error);
    }
  };

  const handleEditChecklistItem = (checklistIndex: number, itemIndex: number) => {
    const updatedChecklists = [...checklists];
    updatedChecklists[checklistIndex].items[itemIndex].isEditing = true;
    setChecklists(updatedChecklists);
  };

  const handleSaveChecklistItemTitle = async (checklistIndex: number, itemIndex: number) => {
    const item = checklists[checklistIndex].items[itemIndex];
    try {
      await updateChecklistItemTitle({ checklistItemId: item.checklistItemId, title: item.text });
      const updatedChecklists = [...checklists];
      updatedChecklists[checklistIndex].items[itemIndex].isEditing = false;
      setChecklists(updatedChecklists);
    } catch (error) {
      console.error("Error updating checklist item title:", error);
    }
  };

  return (
    <div className="space-y-6">
      {checklists.map((checklist, checklistIndex) => (
        <motion.div
          key={checklist.checklistId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HiClipboard className="w-6 h-6 text-neon-blue" />
              {checklist.isEditing ? (
                <input
                  type="text"
                  value={checklist.title}
                  onChange={(e) => {
                    const updatedChecklists = [...checklists];
                    updatedChecklists[checklistIndex].title = e.target.value;
                    setChecklists(updatedChecklists);
                  }}
                  onBlur={() => handleSaveChecklistTitle(checklistIndex)}
                  onKeyPress={(e) => e.key === "Enter" && handleSaveChecklistTitle(checklistIndex)}
                  className="text-lg font-extrabold text-gray-200 bg-dark-bg border border-neon-purple/50 rounded p-2 focus:ring-neon-purple focus:border-neon-purple"
                  autoFocus
                />
              ) : (
                <h3 className="text-lg font-extrabold text-gray-200 tracking-wide bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  {checklist.title}
                </h3>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditChecklistTitle(checklistIndex)}
                className="text-neon-blue hover:text-neon-blue/80 transition-colors duration-300"
              >
                <HiPencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDeleteChecklist(checklistIndex)}
                className="text-gray-400 hover:text-neon-pink transition-colors duration-300"
              >
                <HiTrash className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {checklist.items.map((item, itemIndex) => (
              <motion.div
                key={item.checklistItemId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-dark-bg p-2 rounded-lg border border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-300"
              >
                <Checkbox
                  checked={item.checked}
                  onChange={() => handleToggleChecklistItem(checklistIndex, itemIndex)}
                  className="text-neon-blue focus:ring-neon-blue"
                />
                {item.isEditing ? (
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const updatedChecklists = [...checklists];
                      updatedChecklists[checklistIndex].items[itemIndex].text = e.target.value;
                      setChecklists(updatedChecklists);
                    }}
                    onBlur={() => handleSaveChecklistItemTitle(checklistIndex, itemIndex)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSaveChecklistItemTitle(checklistIndex, itemIndex)
                    }
                    className="text-sm text-gray-200 bg-dark-bg border border-neon-purple/50 rounded p-1 focus:ring-neon-purple focus:border-neon-purple flex-1"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`text-sm text-gray-200 font-medium flex-1 ${
                      item.checked ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                )}
                <button
                  onClick={() => handleEditChecklistItem(checklistIndex, itemIndex)}
                  className="text-neon-blue hover:text-neon-blue/80 transition-colors duration-300"
                >
                  <HiPencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteChecklistItem(checklistIndex, itemIndex)}
                  className="text-red-500 hover:text-red-400 transition-colors duration-300"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
          {activeChecklistIndex === checklistIndex ? (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddChecklistItem(checklistIndex)}
                placeholder="Add an item"
                className="flex-1 p-2 bg-dark-bg text-white border-neon-purple/30 rounded focus:ring-neon-purple focus:border-neon-purple/50"
              />
              <Button
                color="purple"
                size="sm"
                onClick={() => handleAddChecklistItem(checklistIndex)}
                className="bg-neon-purple hover:bg-neon-purple/80"
              >
                Add
              </Button>
              <Button
                color="gray"
                size="sm"
                onClick={() => setActiveChecklistIndex(null)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setActiveChecklistIndex(checklistIndex)}
              className="mt-3 text-sm font-semibold text-neon-blue hover:text-neon-blue/80 transition-colors duration-300 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent"
            >
              Add an Item
            </button>
          )}
        </motion.div>
      ))}
      {showChecklistForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <input
            type="text"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddChecklist()}
            placeholder="Checklist title"
            className="w-full p-2 bg-dark-bg text-white border-neon-purple/30 rounded focus:ring-neon-purple focus:border-neon-purple/50"
          />
          <div className="flex gap-2 mt-2">
            <Button
              color="purple"
              size="sm"
              onClick={handleAddChecklist}
              className="bg-neon-purple hover:bg-neon-purple/80"
            >
              Add Checklist
            </Button>
            <Button
              color="gray"
              size="sm"
              onClick={() => setShowChecklistForm(false)}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TaskChecklists;