import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to get the token from localStorage
const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log the request for debugging
  console.log('[ProjectTaskApi] Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Task-related API calls
export const getTaskDetails = async (taskId: number) => {
  const response = await api.get(`/api/v1/projects/FetchTaskInfo/${taskId}`);
  return response.data;
};

export const addTaskDescription = async (taskId: number, description: string) => {
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/AddDescription`, { description });
  return response.data;
};

export const updateTaskDescription = async (taskId: number, description: string) => {
  const response = await api.patch(`/api/v1/projects/tasks/${taskId}/UpdateDescription`, { description });
  return response.data;
};

// Checklist-related API calls
export const getAllChecklists = async (taskId: number) => {
  const response = await api.get(`/api/v1/projects/tasks/${taskId}/GetAllChecklists`);
  return response.data;
};

export const createChecklist = async (taskId: number, title: string) => {
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/CreateChecklists`, { title });
  return response.data;
};

export const updateChecklistName = async (taskId: number, checklistId: number | string, title: string) => {
  const response = await api.put(`/api/v1/projects/tasks/${taskId}/UpdateChecklistName/${checklistId}`, { title });
  return response.data;
};

export const deleteChecklist = async (taskId: number, checklistId: number | string) => {
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/DeleteChecklist/${checklistId}`);
  return response.data;
};

export const addChecklistItem = async (taskId: number, checklistId: number | string, content: string) => {
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/AddChecklistItem/${checklistId}/items`, { content });
  return response.data;
};

export const updateChecklistItemName = async (taskId: number, checklistId: number | string, itemId: number | string, content: string) => {
  const response = await api.put(`/api/v1/projects/tasks/${taskId}/UpdateChecklistItemName/${checklistId}/items/${itemId}`, { content });
  return response.data;
};

export const toggleChecklistItemStatus = async (taskId: number, checklistId: number | string, itemId: number | string, isCompleted: boolean) => {
  const response = await api.patch(`/api/v1/projects/tasks/${taskId}/ToggleChecklistItemStatus/${checklistId}/items/${itemId}/status`, { isCompleted });
  return response.data;
};

export const removeChecklistItem = async (taskId: number, checklistId: number | string, itemId: number | string) => {
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/RemoveChecklistItem/${checklistId}/items/${itemId}`);
  return response.data;
};

// New label-related APIs
export const fetchAllLabels = async () => {
  const response = await api.get(`/api/v1/projects/labels/FetchAllLabels`);
  return response.data;
};

export const assignLabelsToTask = async (taskId: number, labelIds: (string | number)[]) => {
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/Assignlabels`, { labelIds });
  return response.data;
};

export const removeLabelFromTask = async (taskId: number, labelId: string | number) => {
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/RemoveLabelFromTask/${labelId}`);
  return response.data;
};