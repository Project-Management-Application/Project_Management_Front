/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Workspace } from "../types/workspace";
import { DashboardData } from "../types/DashboardData";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to get the token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create Workspace
export const createWorkspace = async (name: string): Promise<Workspace> => {
  try {
    const response = await api.post(
      "/api/v1/workspace/createWorkspace",
      { name },
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return response.data as Workspace;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error creating workspace"
      );
    }
    throw new Error("Error creating workspace");
  }
};

// Check if User Has Workspace
export const checkUserWorkspace = async (): Promise<boolean> => {
  try {
    const response = await api.get("/api/v1/workspace/my-workspace", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    
    // Check if the response has a workspace object with an id
    return response.data.workspace?.id !== undefined;
  } catch (error: any) {
    // If the error is a 404 or any other error, return false
    if (error.response && error.response.status === 404) {
      return false;
    }
    return false;
  }
};

// Invite Members
export const inviteUser = async (workspaceId: number, email: string): Promise<void> => {
  try {
    await api.post(
      `/api/v1/workspace/${workspaceId}/invite`,
      { email },
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error inviting user"
      );
    }
    throw new Error("Error inviting user");
  }
};

export const getPendingInvitations = async (): Promise<{ id: number; workspaceName: string; expiresAt: string }[]> => {
  const response = await api.get('/api/v1/workspace/invitations/pending', {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

// acceptInvitation and rejectInvitation remain unchanged

export const acceptInvitation = async (invitationId: number): Promise<WorkspaceDTO> => {
  const response = await api.post(`/api/v1/workspace/invitations/accept/${invitationId}`, {}, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return response.data;
};

export const rejectInvitation = async (invitationId: number): Promise<void> => {
  await api.post(`/api/v1/workspace/invitations/reject/${invitationId}`, {}, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
};


export interface WorkspaceDTO {
  id: number;
  name: string;
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get("/api/v1/workspace/my-workspace", {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data as DashboardData;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching dashboard data"
      );
    }
    throw new Error("Error fetching dashboard data");
  }
};


export const getMyWorkspace = async (): Promise<WorkspaceDTO | null> => {
  try {
    const dashboardData = await getDashboardData();
    return dashboardData.workspace || null;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        return null; // User doesn't have a workspace
      }
      throw new Error(error.response.data?.message || "Error fetching my workspace");
    }
    throw new Error("Error fetching my workspace");
  }
};


export const getWorkspaceMembers = async (workspaceId: number): Promise<{ id: number; firstName: string; lastName: string; email: string }[]> => {
  try {
    const response = await api.get(`/api/v1/workspace/${workspaceId}/members`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching members");
    }
    throw new Error("Error fetching members");
  }
};

export const removeMember = async (workspaceId: number, memberId: number): Promise<void> => {
  try {
    await api.delete(`/api/v1/workspace/${workspaceId}/members/${memberId}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error removing member");
    }
    throw new Error("Error removing member");
  }
};

export const getJoinedWorkspaces = async (): Promise<WorkspaceDTO[]> => {
  try {
    const response = await api.get(`/api/v1/workspace/joined-workspaces`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Error fetching joined workspaces");
    }
    throw new Error("Error fetching joined workspaces");
  }
};