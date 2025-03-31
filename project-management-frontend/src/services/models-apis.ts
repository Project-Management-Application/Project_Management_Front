/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ProjectModel {
  id: number;
  name: string;
  backgroundImage: string;
}

export const getAllModels = async (): Promise<ProjectModel[]> => {
  try {
    const response = await api.get("/api/v1/models/all");
    return response.data as ProjectModel[];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching models"
      );
    }
    throw new Error("Error fetching models");
  }
};

export const getBackgroundImages = async (): Promise<string[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get("/api/v1/storage/backgrounds", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as string[];
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.message || "Error fetching background images"
      );
    }
    throw new Error("Error fetching background images");
  }
};