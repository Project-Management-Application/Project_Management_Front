
export interface ProjectFormData {
  name: string;
  description: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  backgroundImage?: string | null; 
  backgroundColor?: string | null; 
  modelId?: number | null; 
  workspaceId?: number; 
}