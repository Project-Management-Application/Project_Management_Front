import React, { useState } from "react";
import { Checkbox, Button, Badge, TextInput, Dropdown } from "flowbite-react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import { Sprint, Backlog, Ticket } from "../../types/backlog";

type SprintBoardProps = {
  sprint?: Sprint;   // Optional Sprint
  backlog?: Backlog; // Optional Backlog
  onCreateSprint?: () => void;
};

const statusOptions = [
  { label: "À FAIRE", color: "gray" },
  { label: "EN COURS", color: "blue" },
  { label: "TERMINÉ", color: "green" },
];

const SprintBoard: React.FC<SprintBoardProps> = ({ sprint, onCreateSprint }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const isSprint = !!sprint; // Check if it's a sprint

  const handleAddTicket = () => {
    if (newTicket.trim() === "") return;
    const newEntry: Ticket = {
      ticketId: Date.now(), 
      title: newTicket,
      colorCode: "gray",
    };
    setTickets([...tickets, newEntry]);
    setNewTicket("");
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTicket();
    }
  };

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    const statusData = statusOptions.find((s) => s.label === newStatus);
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticketId === ticketId
          ? { ...ticket, status: newStatus, colorCode: statusData?.color || "gray" }
          : ticket
      )
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiChevronDown className="w-5 h-5" /> : <HiChevronRight className="w-5 h-5" />}
          <h2 className="text-lg font-semibold">
            {isSprint ? `Sprint ${sprint?.sprintId}` : "Backlog"}
          </h2>
        </div>
        {isSprint ? (
          <Button color="gray">Commencer le sprint</Button>
        ) : (
          <Button color="blue" onClick={onCreateSprint}>Créer un sprint</Button>
        )}
      </div>

      {isOpen && (
        <div className="border rounded-md divide-y">
          {tickets.map((ticket) => (
            <div key={ticket.ticketId} className="flex items-center p-3 gap-4">
              <Checkbox />
              <span className="text-sm font-medium text-gray-700">{ticket.title}</span>

              <Dropdown label="Status" size="xs" color="light" className="text-sm">
                {statusOptions.map((option) => (
                  <Dropdown.Item
                    key={option.label}
                    onClick={() => handleStatusChange(ticket.ticketId!, option.label)}
                  >
                    <Badge color={option.color} className="px-2 py-1 text-xs">
                      {option.label}
                    </Badge>
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="mt-4">
          {isCreating ? (
            <TextInput 
              value={newTicket} 
              onChange={(e) => setNewTicket(e.target.value)} 
              onKeyPress={handleKeyPress}
              placeholder="Qu'est-ce qui doit être fait ?" 
              className="mb-2 w-full" 
              autoFocus
            />
          ) : (
            <button 
              onClick={() => setIsCreating(true)} 
              className="text-blue-500 text-sm w-full text-left"
            >
              + Créer un ticket
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SprintBoard;
