
import axios from "axios";

import { CreateProjectRequest } from "../types/CreateProjectRequest";

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