/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Task } from "../types/backlog";

const API_URL = import.meta.env.VITE_API_URL;

export const createBacklog = async (): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createBacklog`);
    console.log("Backlog created:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error during backlog creation");
  }
};

export const createSprint = async (backlogId: number): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createSprint`, { backlogId });
    console.log("Sprint created:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error during sprint creation");
  }
};

export const createTask = async (title: string, label: string, backlogId?: number, sprintId?: number): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createTask`, {
      title,
      label,
      backlogId: backlogId || 0,
      sprintId: sprintId || 0,
    });
    console.log("Task created:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error during task creation");
  }
};

export const updateSprintTitle = async (sprintId: number, title: string): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/api/v1/updateSprintTitle`, { sprintId, title });
    console.log("Sprint title updated:", title);
  } catch (error) {
    throw new Error("Error updating sprint title");
  }
};

export const deleteSprint = async (sprintId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/v1/deleteSprint/${sprintId}`);
    console.log("Sprint deleted:", sprintId);
  } catch (error) {
    throw new Error("Error deleting sprint");
  }
};

export const updateTaskLabel = async (taskId: number, label: string): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/api/v1/updateTaskLabel`, { taskId, label });
    console.log("Task label updated:", label);
  } catch (error) {
    throw new Error("Error updating task label");
  }
};

export const updateTaskTitle = async (taskId: number, title: string): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/api/v1/updateTaskTitle`, { taskId, title });
    console.log("Task title updated:", title);
  } catch (error) {
    throw new Error("Error updating task title");
  }
};

export const createTicket = async (ticket: { title: string; colorCode: string }): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createTicket`, ticket);
    console.log("Ticket created:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error creating ticket");
  }
};

export const updateTicketTitle = async (ticket: { ticketId: number; title: string }): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/api/v1/updateTicketTitle`, ticket);
    console.log("Ticket title updated:", ticket.title);
  } catch (error) {
    throw new Error("Error updating ticket title");
  }
};

export const updateTicketColor = async (ticket: { ticketId: number; colorCode: string }): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/api/v1/updateTicketColor`, ticket);
    console.log("Ticket color updated:", ticket.colorCode);
  } catch (error) {
    throw new Error("Error updating ticket color");
  }
};

export const deleteTicket = async (ticketId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/v1/deleteTicket/${ticketId}`);
    console.log("Ticket deleted:", ticketId);
  } catch (error) {
    throw new Error("Error deleting ticket");
  }
};

export const addTicketToTask = async (taskTicket: { taskId: number; ticketId: number }): Promise<void> => {
  try {
    await axios.post(`${API_URL}/api/v1/addTicketToTask`, taskTicket);
    console.log("Ticket added to task:", taskTicket);
  } catch (error) {
    throw new Error("Error adding ticket to task");
  }
};

export const removeTicketFromTask = async (taskTicket: { taskId: number; ticketId: number }): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/v1/removeTicketFromTask`, { data: taskTicket });
    console.log("Ticket removed from task:", taskTicket);
  } catch (error) {
    throw new Error("Error removing ticket from task");
  }
};

export const updateTaskDescription = async (task: { taskId: number; description: string }): Promise<number> => {
  try {
    const response = await axios.patch(`${API_URL}/api/v1/updateTaskDescription`, task);
    console.log("Task description updated:", task.taskId);
    return response.data;
  } catch (error) {
    throw new Error("Error updating task description");
  }
};

export const deleteTask = async (taskId: number): Promise<number> => {
  try {
    const response = await axios.delete(`${API_URL}/api/v1/deleteTask/${taskId}`);
    console.log("Task deleted:", taskId);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting task");
  }
};

export const createComment = async (comment: { commentSectionId: number; comment: string }): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createComment`, comment);
    console.log("Comment created for comment section:", comment.commentSectionId);
    return response.data;
  } catch (error) {
    throw new Error("Error creating comment");
  }
};

export const createChecklist = async (checklist: { taskId: number; title: string }): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createChecklist`, checklist);
    console.log("Checklist created for task:", checklist.taskId);
    return response.data;
  } catch (error) {
    throw new Error("Error creating checklist");
  }
};

export const deleteChecklist = async (checklistId: number): Promise<number> => {
  try {
    const response = await axios.delete(`${API_URL}/api/v1/deleteChecklist/${checklistId}`);
    console.log("Checklist deleted:", checklistId);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting checklist");
  }
};

export const updateChecklistTitle = async (checklist: { checklistId: number; title: string }): Promise<number> => {
  try {
    const response = await axios.patch(`${API_URL}/api/v1/updateChecklistTitle`, checklist);
    console.log("Checklist title updated:", checklist.checklistId);
    return response.data;
  } catch (error) {
    throw new Error("Error updating checklist title");
  }
};

export const createChecklistItem = async (checklistItem: { checklistId: number; title: string }): Promise<number> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/createChecklistItem`, checklistItem);
    console.log("Checklist item created for checklist:", checklistItem.checklistId);
    return response.data;
  } catch (error) {
    throw new Error("Error creating checklist item");
  }
};

export const deleteChecklistItem = async (checklistItemId: number): Promise<number> => {
  try {
    const response = await axios.delete(`${API_URL}/api/v1/deleteChecklistItem/${checklistItemId}`);
    console.log("Checklist item deleted:", checklistItemId);
    return response.data;
  } catch (error) {
    throw new Error("Error deleting checklist item");
  }
};

export const updateChecklistItemTitle = async (checklistItem: { checklistItemId: number; title: string }): Promise<number> => {
  try {
    const response = await axios.patch(`${API_URL}/api/v1/updateChecklistItemTitle`, checklistItem);
    console.log("Checklist item title updated:", checklistItem.checklistItemId);
    return response.data;
  } catch (error) {
    throw new Error("Error updating checklist item title");
  }
};

export const checkItem = async (checklistItemId: number): Promise<boolean> => {
  try {
    const response = await axios.patch(`${API_URL}/api/v1/checkItem/${checklistItemId}`);
    console.log("Checklist item checked:", checklistItemId);
    return response.data;
  } catch (error) {
    throw new Error("Error checking checklist item");
  }
};

export const getAllTickets = async (): Promise<{ ticketId: number; title: string; color: string }[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/getAllTickets`);
    return response.data.map((t: any) => ({
      ticketId: t.ticketId,
      title: t.title,
      color: t.colorCode,
    }));
  } catch (error) {
    throw new Error("Error fetching all tickets");
  }
};

export const getTaskDetails = async (taskId: number): Promise<{
  taskId: number;
  title: string;
  description: string;
  label: string;
  tickets: { ticketId: number; title: string; color: string }[];
  checklists: { checklistId: number; title: string; checklistItems: { checklistItemId: number; title: string; checked: boolean }[] }[];
  commentSection: { commentSectionId: number; comments: { commentId: number; comment: string }[] };
}> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/getTaskDetails/${taskId}`);
    console.log("Task details fetched:", response.data);
    return {
      taskId: response.data.taskId,
      title: response.data.title,
      description: response.data.description || "",
      label: response.data.label || "TODO",
      tickets: response.data.tickets.map((t: any) => ({
        ticketId: t.ticketId,
        title: t.title,
        color: t.colorCode,
      })),
      checklists: response.data.checklists.map((c: any) => ({
        checklistId: c.checklistId,
        title: c.title,
        checklistItems: c.checklistItems.map((ci: any) => ({
          checklistItemId: ci.checklistItemId,
          title: ci.title,
          checked: ci.checked,
        })),
      })),
      commentSection: {
        commentSectionId: response.data.commentSection.commentSectionId,
        comments: response.data.commentSection.comments.map((com: any) => ({
          commentId: com.commentId,
          comment: com.comment,
        })),
      },
    };
  } catch (error) {
    throw new Error("Error fetching task details");
  }
};


export const getBacklog = async (projectId: number): Promise<number> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/getBacklog/${projectId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching backlog for project ${projectId}`);
  }
};

export const getSprints = async (backlogId: number): Promise<{ sprintId: number; title: string }[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/getSprints/${backlogId}`);
    return response.data.map((s: any) => ({
      sprintId: s.sprintId,
      title: s.title,
    }));
  } catch (error) {
    throw new Error(`Error fetching sprints for backlog ${backlogId}`);
  }
};

export const getBacklogTasks = async (backlogId: number): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/getBacklogTasks/${backlogId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching backlog tasks for backlog ${backlogId}`);
  }
};

export const getSprintTasks = async (sprintId: number): Promise<Task[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/getSprintTasks/${sprintId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching sprint tasks for sprint ${sprintId}`);
  }
};

export const startSprint = async (sprintId: number): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/startSprint/${sprintId}`);
    console.log("Sprint started:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Error starting sprint");
  }
};

