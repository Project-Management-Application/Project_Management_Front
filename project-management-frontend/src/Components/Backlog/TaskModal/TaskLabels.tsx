/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox, Button } from "flowbite-react";
import { HiPlus, HiX, HiPencil, HiTrash } from "react-icons/hi";
import { createTicket, updateTicketTitle, updateTicketColor, deleteTicket, addTicketToTask, removeTicketFromTask, getTaskDetails, getAllTickets } from "../../../services/backlogApi";

type Ticket = {
  ticketId?: number;
  title: string;
  color: string;
};

type TaskLabelsProps = {
  taskId: number;
  showLabelDropdown: boolean;
  setShowLabelDropdown: (value: boolean) => void;
};

const TaskLabels: React.FC<TaskLabelsProps> = ({ taskId, showLabelDropdown, setShowLabelDropdown }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
  const [showModifyTicketForm, setShowModifyTicketForm] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketColor, setNewTicketColor] = useState("#4CAF50");
  const [modifyTicket, setModifyTicket] = useState<Ticket | null>(null);

  const colorOptions = [
    { name: "Green", code: "#4CAF50" },
    { name: "Orange", code: "#FF9800" },
    { name: "Red", code: "#F44336" },
    { name: "Dark Red", code: "#D32F2F" },
    { name: "Blue", code: "#2196F3" },
    { name: "Purple", code: "#9C27B0" },
    { name: "Yellow", code: "#FFEB3B" },
    { name: "Pink", code: "#E91E63" },
    { name: "Cyan", code: "#00BCD4" },
    { name: "Lime", code: "#8BC34A" },
    { name: "Deep Orange", code: "#FF5722" },
    { name: "Indigo", code: "#3F51B5" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskDetails = await getTaskDetails(taskId);
        const allTickets = await getAllTickets();
        setSelectedTickets(taskDetails.tickets);
        setTickets(allTickets);
      } catch (error) {
        console.error("Error fetching ticket data:", error);
      }
    };
    fetchData();
  }, [taskId]);

  const handleToggleTicket = async (ticket: Ticket) => {
    if (!ticket.ticketId) return;
    const isSelected = selectedTickets.some((t) => t.ticketId === ticket.ticketId);
    if (isSelected) {
      try {
        await removeTicketFromTask({ taskId, ticketId: ticket.ticketId });
        setSelectedTickets(selectedTickets.filter((t) => t.ticketId !== ticket.ticketId));
      } catch (error) {
        console.error("Error removing ticket from task:", error);
      }
    } else {
      try {
        await addTicketToTask({ taskId, ticketId: ticket.ticketId });
        setSelectedTickets([...selectedTickets, ticket]);
      } catch (error) {
        console.error("Error adding ticket to task:", error);
      }
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicketTitle.trim()) return;
    try {
      const ticketId = await createTicket({ title: newTicketTitle, colorCode: newTicketColor });
      const newTicket = { ticketId, title: newTicketTitle, color: newTicketColor };
      setTickets([...tickets, newTicket]);
      setNewTicketTitle("");
      setNewTicketColor("#4CAF50");
      setShowCreateTicketForm(false);
      setShowLabelDropdown(true);
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const handleModifyTicket = async () => {
    if (!modifyTicket?.ticketId || !newTicketTitle.trim()) return;
    try {
      await updateTicketTitle({ ticketId: modifyTicket.ticketId, title: newTicketTitle });
      await updateTicketColor({ ticketId: modifyTicket.ticketId, colorCode: newTicketColor });
      const updatedTicket = { ...modifyTicket, title: newTicketTitle, color: newTicketColor };
      setTickets(tickets.map((t) => (t.ticketId === modifyTicket.ticketId ? updatedTicket : t)));
      setSelectedTickets(
        selectedTickets.map((t) => (t.ticketId === modifyTicket.ticketId ? updatedTicket : t))
      );
      setShowModifyTicketForm(false);
      setNewTicketTitle("");
      setNewTicketColor("#4CAF50");
    } catch (error) {
      console.error("Error modifying ticket:", error);
    }
  };

  const handleDeleteTicket = async (ticketId?: number) => {
    if (!ticketId) return;
    try {
      await deleteTicket(ticketId);
      setTickets(tickets.filter((t) => t.ticketId !== ticketId));
      setSelectedTickets(selectedTickets.filter((t) => t.ticketId !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-wrap">
        {selectedTickets.map((ticket) => (
          <span
            key={ticket.ticketId}
            className="px-3 py-1 rounded text-sm font-medium text-white"
            style={{ backgroundColor: ticket.color }}
          >
            {ticket.title}
          </span>
        ))}
        <HiPlus
          className="w-5 h-5 text-neon-blue cursor-pointer"
          onClick={() => setShowLabelDropdown(!showLabelDropdown)}
        />
      </div>

      <AnimatePresence mode="wait">
        {showLabelDropdown && !showCreateTicketForm && !showModifyTicketForm && (
          <motion.div
            key="ticket-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 left-0 bg-dark-bg border border-neon-blue/50 rounded-lg shadow-lg p-4 w-80 z-20"
          >
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full p-2 mb-4 bg-dark-card text-white border border-neon-blue/50 rounded focus:ring-neon-blue focus:border-neon-blue"
            />
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {tickets.map((ticket) => (
                <div key={ticket.ticketId} className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedTickets.some((t) => t.ticketId === ticket.ticketId)}
                    onChange={() => handleToggleTicket(ticket)}
                    className="text-neon-blue focus:ring-neon-blue w-5 h-5"
                  />
                  <span
                    className="flex-1 px-4 py-2 rounded-lg text-base font-semibold text-white shadow-md"
                    style={{ backgroundColor: ticket.color }}
                  >
                    {ticket.title}
                  </span>
                  <HiPencil
                    className="w-5 h-5 text-neon-blue cursor-pointer hover:text-neon-blue/80"
                    onClick={() => {
                      setModifyTicket(ticket);
                      setNewTicketTitle(ticket.title);
                      setNewTicketColor(ticket.color);
                      setShowModifyTicketForm(true);
                      setShowLabelDropdown(false);
                    }}
                  />
                  <HiTrash
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-400"
                    onClick={() => handleDeleteTicket(ticket.ticketId)}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowLabelDropdown(false);
                setShowCreateTicketForm(true);
              }}
              className="mt-4 w-full text-left text-neon-blue hover:text-neon-blue/80 transition-colors duration-300 text-sm font-medium"
            >
              Create a new ticket
            </button>
          </motion.div>
        )}

        {showCreateTicketForm && (
          <motion.div
            key="create-ticket-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 left-0 bg-dark-bg border border-neon-blue/50 rounded-lg shadow-lg p-4 w-72 z-20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-white">Create ticket</h3>
              <button
                onClick={() => {
                  setShowCreateTicketForm(false);
                  setShowLabelDropdown(true);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <div
                className="w-full h-8 rounded mb-2"
                style={{ backgroundColor: newTicketColor }}
              />
              <label className="text-sm text-gray-300">Title</label>
              <input
                type="text"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                className="w-full p-2 mt-1 bg-dark-bg text-white border border-neon-blue/50 rounded focus:ring-neon-blue focus:border-neon-blue"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-300">Select a color</label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.code}
                    className={`w-8 h-8 rounded border-2 ${
                      newTicketColor === color.code ? "border-neon-blue" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => setNewTicketColor(color.code)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <Button
              color="blue"
              size="sm"
              className="w-full bg-neon-blue hover:bg-neon-blue/80 transition-all duration-300"
              onClick={handleCreateTicket}
            >
              Create
            </Button>
          </motion.div>
        )}

        {showModifyTicketForm && modifyTicket && (
          <motion.div
            key="modify-ticket-form"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-8 left-0 bg-dark-bg border border-neon-blue/50 rounded-lg shadow-lg p-4 w-72 z-20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-white">Modify ticket</h3>
              <button
                onClick={() => {
                  setShowModifyTicketForm(false);
                  setShowLabelDropdown(true);
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <div
                className="w-full h-8 rounded mb-2"
                style={{ backgroundColor: newTicketColor }}
              />
              <label className="text-sm text-gray-300">Title</label>
              <input
                type="text"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                className="w-full p-2 mt-1 bg-dark-bg text-white border border-neon-blue/50 rounded focus:ring-neon-blue focus:border-neon-blue"
              />
            </div>
            <div className="mb-4">
              <label className="text-sm text-gray-300">Select a color</label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.code}
                    className={`w-8 h-8 rounded border-2 ${
                      newTicketColor === color.code ? "border-neon-blue" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.code }}
                    onClick={() => setNewTicketColor(color.code)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <Button
              color="blue"
              size="sm"
              className="w-full bg-neon-blue hover:bg-neon-blue/80 transition-all duration-300"
              onClick={handleModifyTicket}
            >
              Save
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskLabels;