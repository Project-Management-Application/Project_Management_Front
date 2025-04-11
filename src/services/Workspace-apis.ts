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