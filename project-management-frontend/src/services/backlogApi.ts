import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;


export const createBacklog= async (): Promise<number> => {
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
            backlogId: backlogId || 0, // Send 0 if not linked to backlog
            sprintId: sprintId || 0,  // Send 0 if not linked to sprint
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

