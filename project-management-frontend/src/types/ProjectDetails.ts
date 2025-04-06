import { Task } from '../types/Task'

export interface ProjectDetails {
  id: number;
  name: string;
  backgroundImage?: string;
  backgroundColor?: string;
  modelBackgroundImage?: string;
  cards: BackendProjectCard[];
}

export interface BackendProjectCard {
  id: number;
  name: string;
  tasks?: Task[];
}