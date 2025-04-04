import React, { useState } from "react";
import { Task } from "../../types/backlog";
import { updateTaskLabel } from "../../services/backlogApi";
import TaskModal from "./TaskModal/TaskModal";
import { motion } from "framer-motion";

const TASK_STATUSES = [
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "INPROGRESS" },
  { label: "Done", value: "DONE" },
];

type TaskListProps = {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onUpdateTaskLabel: (taskId: number, newStatus: string) => void;
  onUpdateTaskTitle: (taskId: number, newTitle: string) => void;
  onUpdateTaskDescription: (taskId: number, newDescription: string) => void;
  onDeleteTask?: (taskId: number) => void;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskLabel,
  onUpdateTaskTitle,
  onUpdateTaskDescription,
  onDeleteTask,
}) => {
  const [newTask, setNewTask] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    onAddTask(newTask);
    setNewTask("");
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTask();
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await updateTaskLabel(taskId, newStatus);
      onUpdateTaskLabel(taskId, newStatus);
    } catch (error) {
      console.error("Error updating task label:", error);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <motion.div
          key={task.taskId}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center p-4 gap-4 bg-gray-700 rounded-lg border border-indigo-500/30 hover:border-indigo-500/70 transition-all duration-300 cursor-pointer"
          onClick={() => setSelectedTask(task)}
        >
          <span className="text-lg font-semibold text-white flex-1">{task.title}</span>
          <select
            value={task.label}
            onChange={(e) => handleStatusChange(task.taskId!, e.target.value)}
            className="w-40 text-lg bg-gray-800 text-white border border-indigo-500/50 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.value} value={status.value} className="bg-gray-800 text-white">
                {status.label}
              </option>
            ))}
          </select>
        </motion.div>
      ))}

      {isCreating ? (
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a task..."
          className="w-full rounded-lg bg-gray-800 text-white border-indigo-500/50 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-lg"
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="text-indigo-400 text-lg font-semibold w-full text-left py-2 hover:text-indigo-300 transition-colors duration-300"
        >
          + Add a Task
        </button>
      )}

      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          taskId={selectedTask.taskId!}
          taskTitle={selectedTask.title}
          taskDescription={selectedTask.description || ""}
          initialStatus={selectedTask.label}
          onSaveTitle={(newTitle) => {
            onUpdateTaskTitle(selectedTask.taskId!, newTitle);
            setSelectedTask({ ...selectedTask, title: newTitle });
          }}
          onSaveDescription={(newDesc) => {
            onUpdateTaskDescription(selectedTask.taskId!, newDesc);
            setSelectedTask({ ...selectedTask, description: newDesc });
          }}
          onUpdateStatus={(newStatus) => {
            onUpdateTaskLabel(selectedTask.taskId!, newStatus);
            setSelectedTask({ ...selectedTask, label: newStatus });
          }}
          onDeleteTask={(taskId) => {
            onDeleteTask?.(taskId);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;