import React, { useState } from "react";
import { Button } from "flowbite-react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import { Sprint, Backlog, Task } from "../../types/backlog";
import { createTask,updateSprintTitle } from "../../services/backlogApi";
import TaskList from "./TaskList"; // ✅ Import new component

type SprintBoardProps = {
  sprint?: Sprint;
  backlog?: Backlog;
  onCreateSprint?: () => void;
  onTaskCreate?: (newTask: Task) => void;
};

const SprintBoard: React.FC<SprintBoardProps> = ({
  sprint,
  backlog,
  onCreateSprint,
  onTaskCreate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>(sprint?.tasks || backlog?.tasks || []);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(sprint ? `Sprint ${sprint.sprintId}` : "Backlog");


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

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiChevronDown className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
          {/* Backlog title (Fixed) */}
          {backlog && !sprint ? (
            <h2 className="text-lg font-semibold">Backlog</h2>
          ) : (
            // Sprint title (Editable)
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
        {sprint ? (
          <Button color="gray">Commencer le sprint</Button>
        ) : (
          <Button color="blue" onClick={onCreateSprint}>
            Créer un sprint
          </Button>
        )}
      </div>

      {isOpen && <TaskList tasks={tasks} onAddTask={handleAddTask} />}
    </div>
  );
};

export default SprintBoard;
