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
): Promise<number> => {
  const response = await api.post(
    `/api/v1/projects/${projectId}/addCard`,
    { name: cardName },
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    }
  );

  const newCardId = response.data?.cardId;
  if (!newCardId) throw new Error("No cardId returned from server");

  return newCardId;
};

