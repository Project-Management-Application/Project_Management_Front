import { Task } from '../types/Task'

export interface ProjectDetails {
  id: number;
  name: string;
  backgroundImage?: string;
  backgroundColor?: string;
  modelBackgroundImage?: string;
  cards: BackendProjectCard[];
  workspaceId: number;
}

export interface BackendProjectCard {
  id: number;
  name: string;
  tasks?: Task[];
}