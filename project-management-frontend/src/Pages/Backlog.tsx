import React, { useEffect, useState } from "react";
import SprintBoard from "../Components/Backlog/SprintBoard";
import type { Sprint, Backlog } from "../types/backlog";
import Navbar from "../Components/Backlog/Navbar";
import { createBacklog } from "../services/backlogApi";
import { useRef } from "react";


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
  }, []);

  const handleCreateSprint = () => {
    if (!backlog) return;

    const newSprint: Sprint = {
      sprintId: Date.now(), 
      backlog: backlog, 
      tasks: [],
    };

    setSprints((prevSprints) => [...prevSprints, newSprint]);
    setBacklog((prev) => prev ? { ...prev, Sprints: [...(prev.Sprints || []), newSprint] } : null);
  };

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        {backlog && <SprintBoard backlog={backlog} onCreateSprint={handleCreateSprint} />}
        {sprints.map((sprint) => (
          <SprintBoard key={sprint.sprintId} sprint={sprint} />
        ))}
      </div>
    </div>
  );
};

export default Backlog;
