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

// Comment-related API calls
export const addComment = async (taskId: number, content: string) => {
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/addComment`, { content });
  return response.data;
};

export const updateComment = async (taskId: number, commentId: string | number, content: string) => {
  const response = await api.put(`/api/v1/projects/tasks/${taskId}/updateComment/${commentId}`, { content });
  return response.data;
};

export const getAllComments = async (taskId: number) => {
  const response = await api.get(`/api/v1/projects/tasks/${taskId}/getAllComments`);
  return response.data;
};

export const deleteComment = async (taskId: number, commentId: string | number) => {
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/deleteComment/${commentId}`);
  return response.data;
};

// Attachment-related API calls
export const uploadTaskAttachment = async (taskId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/uploadTaskAttachment`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteTaskAttachment = async (taskId: number, attachmentId: string | number) => {
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/deleteTaskAttachment/${attachmentId}`);
  return response.data;
};


// Cover-related API calls
export const updateTaskCover = async (taskId: number, coverData: { image?: string; color?: string }) => {
  const hasImage = !!coverData.image;
  const hasColor = !!coverData.color;

  if (hasImage && hasColor) {
    throw new Error('Provide either an image URL or a color, not both.');
  }

  let payload: { imageUrl?: string; color?: string; clear?: boolean };
  
  if (hasImage) {
    payload = { imageUrl: coverData.image };
  } else if (hasColor) {
    payload = { color: coverData.color };
  } else {
    // Indicate that the cover should be cleared
    payload = { clear: true };
  }

  const response = await api.post(`/api/v1/projects/tasks/${taskId}/UpdateCover`, payload);
  return response.data;
};


// Date-related API calls
export const setTaskDates = async (taskId: number, dates: { startDate: string; dueDate: string; dueDateReminder?: string }) => {
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/setTaskDates`, dates);
  return response.data;
};

export const updateTaskDates = async (taskId: number, dates: { startDate: string; dueDate: string; dueDateReminder?: string }) => {
  const response = await api.put(`/api/v1/projects/tasks/${taskId}/updateTaskDates`, dates);
  return response.data;
};

export const resetTaskDates = async (taskId: number) => {
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/resetTaskDates`);
  return response.data;
};

// New API calls for task deletion, task name update, and user info
export const deleteTask = async (taskId: number) => {
  const response = await api.delete(`/api/v1/projects/tasks/deleteTask/${taskId}`);
  return response.data;
};

export const updateTaskName = async (taskId: number, name: string) => {
  const response = await api.put(`/api/v1/projects/tasks/updateTaskName/${taskId}/name`, { name });
  return response.data;
};

export const getUserInfo = async () => {
  const response = await api.get(`/api/v1/projects/users/getUserInfo`);
  return response.data;
};

// New API calls for member management


export const assignMembersToTask = async (taskId: number, userIds: number[]) => {
  console.log(`[ProjectTaskApi] Assigning members to taskId: ${taskId}`, { userIds });
  const response = await api.post(`/api/v1/projects/tasks/${taskId}/AssignmembersToTask`, { userIds });
  console.log(`[ProjectTaskApi] Successfully assigned members to taskId: ${taskId}`);
  return response.data;
};

export const removeMemberFromTask = async (taskId: number, userId: number) => {
  console.log(`[ProjectTaskApi] Removing userId: ${userId} from taskId: ${taskId}`);
  const response = await api.delete(`/api/v1/projects/tasks/${taskId}/RemoveMembersFromTask/${userId}`);
  console.log(`[ProjectTaskApi] Successfully removed userId: ${userId} from taskId: ${taskId}`);
  return response.data;
};
