import React, { useState } from "react";
import { Task } from "../../types/backlog";
import { Checkbox, TextInput, Select } from "flowbite-react";
import { updateTaskLabel } from "../../services/backlogApi";
import TaskModal from "./TaskModal";

const TASK_STATUSES = [
  { label: "TO DO", value: "TODO" },
  { label: "IN PROGRESS", value: "INPROGRESS" },
  { label: "DONE", value: "DONE" }
];

type TaskListProps = {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onUpdateTaskLabel: (taskId: number, newStatus: string) => void;
  onUpdateTaskTitle: (taskId: number, newTitle: string) => void;
  onUpdateTaskDescription: (taskId: number, newDescription: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskLabel,
  onUpdateTaskTitle,
  onUpdateTaskDescription,
}) => {
  const [newTask, setNewTask] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    onAddTask(newTask);
    setNewTask("");
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
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
    <div>
      {tasks.map((task) => (
        <div key={task.taskId} className="flex items-center p-3 gap-4">
          <Checkbox />

          <span
            className="text-sm font-medium text-gray-700 flex-1 cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            {task.title}
          </span>

          <Select
            value={task.label}
            onChange={(e) => handleStatusChange(task.taskId!, e.target.value)}
            className="w-40 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ml-auto"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      ))}

      {isCreating ? (
        <TextInput
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nom du task"
          className="mb-2 w-full"
          autoFocus
        />
      ) : (
        <button onClick={() => setIsCreating(true)} className="text-blue-500 text-sm w-full text-left">
          + Créer un task
        </button>
      )}

      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          taskId={selectedTask.taskId!}
          taskTitle={selectedTask.title}
          taskDescription={selectedTask.description || ""}
          onSaveTitle={(newTitle) => onUpdateTaskTitle(selectedTask.taskId!, newTitle)}
          onSaveDescription={(newDesc) => onUpdateTaskDescription(selectedTask.taskId!, newDesc)}
        />
      )}
    </div>
  );
};

export default TaskList;
