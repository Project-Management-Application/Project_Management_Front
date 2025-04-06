/* eslint-disable tailwindcss/classnames-order */
import React, { useEffect, useState, useRef } from "react";
import SprintBoard from "../Components/Backlog/SprintBoard";
import type { Sprint, Backlog, Task } from "../types/backlog";
import Navbar from "../Components/Backlog/Navbar";
import { createSprint, getBacklog, getSprints, getBacklogTasks, getSprintTasks } from "../services/backlogApi";
import { motion } from "framer-motion";
import { HiPlus } from "react-icons/hi";
import { useParams } from "react-router-dom";

const Backlog: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlog, setBacklog] = useState<Backlog | null>(null);
  const isDataFetched = useRef(false);
  const { projectId } = useParams<{ projectId: string }>();

  useEffect(() => {
    const fetchBacklogAndTasks = async () => {
      if (isDataFetched.current || !projectId) return;
      isDataFetched.current = true;

      try {
        const backlogId = await getBacklog(parseInt(projectId));
        const fetchedSprints = await getSprints(backlogId);
        const backlogTasks = await getBacklogTasks(backlogId);

        const sprintsWithTasks = await Promise.all(
          fetchedSprints.map(async (sprint) => {
            const sprintTasks = await getSprintTasks(sprint.sprintId);
            return {
              sprintId: sprint.sprintId,
              title: sprint.title,
              backlog: { backlogId, tasks: [] },
              tasks: sprintTasks,
              started: sprint.started,
              completed: sprint.completed,
            } as Sprint;
          })
        );

        const newBacklog: Backlog = {
          backlogId,
          tasks: backlogTasks,
          Sprints: sprintsWithTasks,
        };

        setBacklog(newBacklog);
        setSprints(sprintsWithTasks);
      } catch (error) {
        console.error("Error fetching backlog or tasks:", error);
      }
    };

    if (!backlog) fetchBacklogAndTasks();
  }, [backlog, projectId]);

  const updateTasksInState = (updatedTasks: Task[], sprintId?: number) => {
    if (sprintId) {
      setSprints((prev) =>
        prev.map((sprint) =>
          sprint.sprintId === sprintId ? { ...sprint, tasks: updatedTasks } : sprint
        )
      );
      setBacklog((prev) =>
        prev
          ? {
              ...prev,
              Sprints: prev.Sprints?.map((sprint) =>
                sprint.sprintId === sprintId ? { ...sprint, tasks: updatedTasks } : sprint
              ),
            }
          : null
      );
    } else {
      setBacklog((prev) => (prev ? { ...prev, tasks: updatedTasks } : null));
    }
  };

  const handleCreateSprint = async () => {
    if (!backlog) return;
    try {
      const sprintId = await createSprint(backlog.backlogId!);
      const newSprint: Sprint = {
        sprintId,
        backlog: { backlogId: backlog.backlogId!, tasks: [] },
        tasks: [],
        title: "New Sprint",
        started: false,
        completed: false,
      };
      setSprints((prev) => [...prev, newSprint]);
      setBacklog((prev) =>
        prev ? { ...prev, Sprints: [...(prev.Sprints || []), newSprint] } : null
      );
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const handleDeleteSprint = (sprintId: number) => {
    setSprints((prev) => prev.filter((sprint) => sprint.sprintId !== sprintId));
    setBacklog((prev) =>
      prev ? { ...prev, Sprints: prev.Sprints?.filter((s) => s.sprintId !== sprintId) } : null
    );
  };

  const handleAddTaskToSprint = async (sprintId: number, newTask: Task) => {
    setSprints((prev) =>
      prev.map((sprint) =>
        sprint.sprintId === sprintId ? { ...sprint, tasks: [...sprint.tasks, newTask] } : sprint
      )
    );
    setBacklog((prev) =>
      prev
        ? {
            ...prev,
            Sprints: prev.Sprints?.map((sprint) =>
              sprint.sprintId === sprintId ? { ...sprint, tasks: [...sprint.tasks, newTask] } : sprint
            ),
          }
        : null
    );
    if (backlog?.backlogId) {
      const updatedTasks = await getSprintTasks(sprintId);
      updateTasksInState(updatedTasks, sprintId);
    }
  };

  const handleAddTaskToBacklog = async (newTask: Task) => {
    setBacklog((prev) =>
      prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null
    );
    if (backlog?.backlogId) {
      const updatedTasks = await getBacklogTasks(backlog.backlogId);
      updateTasksInState(updatedTasks);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter">
      <Navbar />
      <div className="pt-20 px-8">
        {backlog ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <SprintBoard
              backlog={backlog}
              onTaskCreate={handleAddTaskToBacklog}
              isBacklog={true}
            />
          </motion.div>
        ) : (
          <div>Loading backlog...</div>
        )}

        <div className="space-y-16">
          {sprints.map((sprint, index) => (
            <motion.div
              key={sprint.sprintId}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`w-full max-w-lg ${index % 2 === 0 ? "ml-auto mr-12" : "mr-auto ml-12"}`}
            >
              <SprintBoard
                sprint={sprint}
                onTaskCreate={(newTask) => handleAddTaskToSprint(sprint.sprintId, newTask)}
                onDeleteSprint={handleDeleteSprint}
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={handleCreateSprint}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-10 right-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-lg font-semibold"
        >
          <HiPlus className="size-6" />
          Create Sprint
        </motion.button>
      </div>
    </div>
  );
};

export default Backlog;