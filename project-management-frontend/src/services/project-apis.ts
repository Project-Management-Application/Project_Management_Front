/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

import { CreateProjectRequest } from "../types/CreateProjectRequest";
import { ProjectDetails } from "../types/ProjectDetails";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to get the token from localStorage
const getAuthToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const createProject = async (projectData: CreateProjectRequest): Promise<void> => {
  try {
    await api.post("/api/v1/projects/createProject", projectData, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error creating project"
      );
    }
    throw new Error("Error creating project");
  }
};

export const getProjectDetails = async (projectId: number): Promise<ProjectDetails> => {
  try {
    const response = await api.get(`/api/v1/projects/FetchProject/${projectId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || 'Error fetching project details');
    }
    throw new Error('Error fetching project details');
  }
};


export const addCardToProject = async (
  projectId: number,
  cardName: string
): Promise<void> => {
  const response = await api.post(
    `/api/v1/projects/${projectId}/addCard`,
    { name: cardName },
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }
  );



};



export const inviteMemberToProject = async (projectId: number, email: string, role: string): Promise<void> => {
  try {
    await api.post(
      `/api/v1/projects/${projectId}/invite`,
      { email, role },
      {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      }
    );
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error inviting member");
    }
    throw new Error("Error inviting member");
  }
};


export const getPendingProjectInvitations = async (): Promise<{ id: number; projectName: string; role: string; invitedBy: string; expiresAt: string }[]> => {
  try {
    const response = await api.get(`/api/v1/projects/invitations/pending`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching project invitations");
    }
    throw new Error("Error fetching project invitations");
  }
};

export const acceptProjectInvitation = async (invitationId: number): Promise<void> => {
  try {
    await api.post(`/api/v1/projects/invitations/accept/${invitationId}`, null, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error accepting project invitation");
    }
    throw new Error("Error accepting project invitation");
  }
};

export const declineProjectInvitation = async (invitationId: number): Promise<void> => {
  try {
    await api.post(`/api/v1/projects/invitations/reject/${invitationId}`, null, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error declining project invitation");
    }
    throw new Error("Error declining project invitation");
  }
};

export const addTaskToCard = async (
  cardId: number,
  taskName: string
): Promise<number> => {
  try {
    console.log('Adding task:', { cardId, taskName });
    
    const response = await api.post(
      `/api/v1/projects/CreateTask/${cardId}`,
      { name: taskName },
      {
        headers: { 
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Server response:', response.data);

    if (!response.data) {
      throw new Error('No response data received from server');
    }

    const newTaskId = response.data?.id;  

    if (!newTaskId) {
      console.error('Response data:', response.data);
      throw new Error("No taskId returned from server");
    }

    return newTaskId;
  } catch (error: any) {
    console.error('Full error details:', {
      error,
      response: error.response,
      request: error.request,
      config: error.config
    });

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Axios error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw new Error(`Error creating task: ${errorMessage}`);
    }
    
    throw new Error(`Error creating task: ${error.message}`);
  }
};

// New function to move a task from one card to another
export const moveTask = async (taskId: number, newCardId: number): Promise<void> => {
  try {
    await api.patch(
      `/api/v1/projects/tasks/${taskId}/move`,
      { cardId: newCardId },
      {
        headers: { 
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error moving task:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error moving task: ${errorMessage}`);
    }
    
    throw new Error(`Error moving task: ${error.message}`);
  }
};

export const deleteCard = async (cardId: number) => {
  const response = await api.delete(`/api/v1/projects/deleteCard/${cardId}`);
  return response.data;
};

export const getProjectMembers = async (projectId: number) => {
  console.log(`[ProjectTaskApi] Fetching members for projectId: ${projectId}`);
  const response = await api.get(`/api/v1/projects/${projectId}/getProjectMembers`);
  console.log(`[ProjectTaskApi] Successfully fetched members for projectId: ${projectId}`);
  return response.data;
};