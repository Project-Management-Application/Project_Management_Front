import React, { useState } from "react";
import SprintBoard from "../Components/Backlog/SprintBoard";
import { Sprint } from "../types/sprints";
import Navbar from "../Components/Backlog/Navbar"

const Backlog: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const handleCreateSprint = () => {
    const newSprint: Sprint = { id: Date.now(), title: `Tableau Sprint ${sprints.length + 1}` };
    setSprints((prevSprints) => [...prevSprints, newSprint]);
  };

  return (
    
    <div>
      <Navbar/>
      <div className="pt-16">
        <SprintBoard title="Backlog" isSprint={false} onCreateSprint={handleCreateSprint} />
        {sprints.map((sprint) => (
          <SprintBoard key={sprint.id} title={sprint.title} isSprint={true} />
        ))}
      </div>
    </div>
  );
};

export default Backlog;
