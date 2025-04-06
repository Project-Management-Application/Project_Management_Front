import { ProjectFormData } from "./ProjectDetails";

export interface CreateProjectRequest extends ProjectFormData {
  workspaceId: number;
  modelId?: number | null;
  backgroundImage?: string | null;
  backgroundColor?: string | null;
}
