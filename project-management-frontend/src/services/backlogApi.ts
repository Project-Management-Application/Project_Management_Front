import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;


export const createBacklog= async (): Promise<number> => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/backlog`);
        return response.data.backlogId;
    } catch (error) {
        throw new Error("Error during backlog creation");
      }
};