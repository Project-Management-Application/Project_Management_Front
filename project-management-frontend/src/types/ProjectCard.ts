import { Task } from "./Task";

export interface ProjectCard {
  id: number;
  name: string;
  tasks: Task[]; 
  color: string;
  isTemporary?: boolean;
}