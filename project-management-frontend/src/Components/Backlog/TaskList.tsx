import React, { useState } from "react";
import { Task } from "../../types/backlog";
import { Checkbox, TextInput } from "flowbite-react";

type TaskListProps = {
  tasks: Task[];
  onAddTask: (title: string) => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask }) => {
  const [newTask, setNewTask] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

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

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.taskId} className="flex items-center p-3 gap-4">
          <Checkbox />
          <span className="text-sm font-medium text-gray-700">{task.title}</span>
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
    </div>
  );
};

export default TaskList;
