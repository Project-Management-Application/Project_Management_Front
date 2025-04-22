export interface Workspace {
  id: number;
  name: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface WorkspaceDTO {
  id: number;
  name: string;
}