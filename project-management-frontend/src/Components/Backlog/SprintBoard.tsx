/* eslint-disable tailwindcss/migration-from-tailwind-2 */
/* eslint-disable tailwindcss/enforces-shorthand */
/* eslint-disable tailwindcss/classnames-order */
import React, { useState } from "react";
import { HiTrash } from "react-icons/hi";
import { Button } from "flowbite-react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import type { Sprint, Backlog, Task } from "../../types/backlog";
import { createTask, updateSprintTitle, deleteSprint, startSprint, terminateSprint } from "../../services/backlogApi";
import TaskList from "./TaskList";
import { motion } from "framer-motion";

type SprintBoardProps = {
  sprint?: Sprint;
  backlog?: Backlog;
  onTaskCreate?: (newTask: Task) => void;
  onDeleteSprint?: (sprintId: number) => void;
  isBacklog?: boolean;
};

const SprintBoard: React.FC<SprintBoardProps> = ({
  sprint,
  backlog,
  onTaskCreate,
  onDeleteSprint,
  isBacklog = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [tasks, setTasks] = useState<Task[]>(sprint?.tasks || backlog?.tasks || []);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(sprint ? `Sprint ${sprint.sprintId}` : "Backlog");
  const [isStarted, setIsStarted] = useState<boolean>(sprint?.started || false);
  const [isCompleted, setIsCompleted] = useState<boolean>(sprint?.completed || false);

  const handleDeleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
  };

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
        backlogId: backlog?.backlogId,
        sprintId: sprint?.sprintId,
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
      onDeleteSprint?.(sprint.sprintId!);
    } catch (error) {
      console.error("Error deleting sprint:", error);
    }
  };

  const handleStartSprint = async () => {
    if (!sprint) return;
    try {
      const response = await startSprint(sprint.sprintId!);
      setIsStarted(true);
      console.log(response); // "Sprint started successfully"
    } catch (error) {
      console.error("Error starting sprint:", error);
      alert("Failed to start sprint. Another sprint might already be active.");
    }
  };

  const handleTerminateSprint = async () => {
    if (!sprint) return;
    try {
      const response = await terminateSprint(sprint.sprintId!);
      setIsStarted(false);
      setIsCompleted(true);
      console.log(response); // "Sprint terminated successfully"
    } catch (error) {
      console.error("Error terminating sprint:", error);
      alert("Failed to terminate sprint.");
    }
  };

  const handleUpdateTaskLabel = (taskId: number, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, label: newStatus } : task
      )
    );
  };

  const handleUpdateTaskTitle = (taskId: number, newTitle: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, title: newTitle } : task
      )
    );
  };

  const handleUpdateTaskDescription = (taskId: number, newDescription: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, description: newDescription } : task
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`bg-dark-card backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-neon-purple/30 hover:shadow-neon-purple/50 transition-all duration-500 font-poppins ${
        isBacklog ? "w-full max-w-5xl mx-auto" : "w-full max-w-md"
      }`}
    >
      <div
        className={`flex ${
          isBacklog ? "flex-col items-center" : "justify-between items-center"
        } mb-6`}
      >
        <div className="flex items-center gap-4">
          {isOpen ? (
            <HiChevronDown
              className="w-6 h-6 text-neon-blue cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          ) : (
            <HiChevronRight
              className="w-6 h-6 text-neon-blue cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
          {backlog && !sprint ? (
            <h2 className="text-2xl font-semibold text-white">Backlog</h2>
          ) : isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleTitleBlur()}
              autoFocus
              className={`text-2xl font-semibold text-white bg-transparent border-none focus:ring-0 placeholder-gray-400 ${
                isBacklog ? "text-center" : ""
              }`}
            />
          ) : (
            <h2
              className="text-2xl font-semibold text-white cursor-pointer hover:text-neon-blue transition-colors duration-300"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}{" "}
              {isStarted && !isCompleted && <span className="text-green-400 text-sm ml-2">[Active]</span>}
              {isCompleted && <span className="text-red-400 text-sm ml-2">[Completed]</span>}
            </h2>
          )}
        </div>
        {sprint && (
          <div className={`${isBacklog ? "mt-4" : ""} flex gap-3`}>
            {isStarted && !isCompleted ? (
              <Button
                size="sm"
                pill
                onClick={handleTerminateSprint}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white border-none hover:shadow-red-500/50 transition-all duration-300"
              >
                Terminate Sprint
              </Button>
            ) : (
              <Button
                size="sm"
                pill
                onClick={handleStartSprint}
                disabled={isStarted || isCompleted}
                className={`bg-gradient-to-r from-neon-blue to-neon-purple text-white border-none hover:shadow-neon-blue-glow transition-all duration-300 ${
                  isStarted || isCompleted ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCompleted ? "Sprint Completed" : isStarted ? "Sprint Active" : "Start Sprint"}
              </Button>
            )}
            <Button
              size="sm"
              pill
              onClick={handleDeleteSprint}
              className="bg-neon-pink hover:bg-neon-pink/80 transition-all duration-300"
            >
              <HiTrash className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {isOpen && (
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTaskLabel={handleUpdateTaskLabel}
            onUpdateTaskTitle={handleUpdateTaskTitle}
            onUpdateTaskDescription={handleUpdateTaskDescription}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default SprintBoard;