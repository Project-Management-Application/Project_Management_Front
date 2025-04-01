import React, { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { Button } from "flowbite-react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import { Sprint, Backlog, Task } from "../../types/backlog";
import { createTask, updateSprintTitle, deleteSprint } from "../../services/backlogApi";
import TaskList from "./TaskList"; // ✅ Import TaskList

type SprintBoardProps = {
  sprint?: Sprint;
  backlog?: Backlog;
  onCreateSprint?: () => void;
  onTaskCreate?: (newTask: Task) => void;
  onDeleteSprint?: (sprintId: number) => void; // ✅ Added prop for deleting sprint
};

const SprintBoard: React.FC<SprintBoardProps> = ({
  sprint,
  backlog,
  onCreateSprint,
  onTaskCreate,
  onDeleteSprint,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>(sprint?.tasks || backlog?.tasks || []);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(sprint ? `Sprint ${sprint.sprintId}` : "Backlog");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (sprint) {
      try {
        await updateSprintTitle(sprint.sprintId!, title);
      } catch (error) {
        console.error("Error updating sprint title:", error);
      }
    }
    setIsEditingTitle(false);
  };

  const handleAddTask = async (title: string) => {
    try {
      const taskId = await createTask(title, "TODO", backlog?.backlogId, sprint?.sprintId);
      const newEntry: Task = {
        taskId,
        title,
        label: "TODO",
        backlog: backlog || undefined,
        sprint: sprint || undefined,
      };

      setTasks([...tasks, newEntry]);
      onTaskCreate?.(newEntry);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteSprint = async () => {
    if (!sprint) return;
    try {
      await deleteSprint(sprint.sprintId!);
      console.log(`Sprint ${sprint.sprintId} deleted!`);
      onDeleteSprint?.(sprint.sprintId!); // Notify parent component
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  const handleUpdateTaskLabel = (taskId: number, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, label: newStatus } : task
      )
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiChevronDown className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
          
          {backlog && !sprint ? (
            <h2 className="text-lg font-semibold">Backlog</h2>
          ) : (
            isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
                autoFocus
                className="border border-gray-300 rounded px-2 py-1 w-auto"
              />
            ) : (
              <h2
                className="text-lg font-semibold cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </h2>
            )
          )}
        </div>
      { sprint ? (
        <div className="flex gap-2">
          <Button color="gray" size="sm">Commencer le sprint</Button>
          <Button color="red" size="xs" pill onClick={handleDeleteSprint}>
            <HiTrash className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button color="blue" onClick={onCreateSprint}>Créer un sprint</Button>
      )}
      </div>

      {isOpen && <TaskList tasks={tasks} onAddTask={handleAddTask} onUpdateTaskLabel={handleUpdateTaskLabel} />}
    </div>
  );
};

export default SprintBoard;
