import React, { useEffect, useState, useRef } from "react";
import SprintBoard from "../Components/Backlog/SprintBoard";
import type { Sprint, Backlog, Task } from "../types/backlog";
import Navbar from "../Components/Backlog/Navbar";
import { createBacklog, createSprint } from "../services/backlogApi";

const Backlog: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [backlog, setBacklog] = useState<Backlog | null>(null);
  const isBacklogCreated = useRef(false);

  useEffect(() => {
    const initializeBacklog = async () => {
      if (isBacklogCreated.current) return; // Prevent multiple calls
      isBacklogCreated.current = true;

      try {
        const backlogId = await createBacklog();
        setBacklog({ backlogId, tasks: [], Sprints: [] });
      } catch (error) {
        console.error("Error creating backlog:", error);
      }
    };

    if (!backlog) {
      initializeBacklog();
    }
  }, [backlog]);

  const handleCreateSprint = async () => {
    if (!backlog) return;
    try {
      const sprintId = await createSprint(backlog.backlogId!);

      const newSprint: Sprint = {
        sprintId,
        backlog: backlog,
        tasks: [],
      };

      setSprints((prevSprints) => [...prevSprints, newSprint]);
      setBacklog((prev) =>
        prev ? { ...prev, Sprints: [...(prev.Sprints || []), newSprint] } : null
      );
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  const handleAddTaskToSprint = (sprintId: number, newTask: Task) => {
    setSprints((prevSprints) =>
      prevSprints.map((sprint) =>
        sprint.sprintId === sprintId
          ? { ...sprint, tasks: [...(sprint.tasks || []), newTask] }
          : sprint
      )
    );
  };

  const handleAddTaskToBacklog = (newTask: Task) => {
    setBacklog((prev) =>
      prev ? { ...prev, tasks: [...(prev.tasks || []), newTask] } : null
    );
  };

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        {backlog && (
          <SprintBoard
            backlog={backlog}
            onCreateSprint={handleCreateSprint}
            onTaskCreate={handleAddTaskToBacklog}
          />
        )}
        {sprints.map((sprint) => (
          <SprintBoard
            key={sprint.sprintId}
            sprint={sprint}
            onTaskCreate={(newTask) => handleAddTaskToSprint(sprint.sprintId!, newTask)}
          />
        ))}
      </div>
    </div>
  );
};

export default Backlog;
