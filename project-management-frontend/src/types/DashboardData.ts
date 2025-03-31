export interface DashboardData {
  workspace: {
    id: number;
    name: string;
  };
  members: Array<{
    id: number;
    fullName: string;
    email: string;
  }>;
  projects: Array<{
    createdAt: string;
    id: number;
    name: string;
    visibility: 'PUBLIC' | 'PRIVATE';
    backgroundImage: string | null;
    backgroundColor: string | null;
    modelId: number | null;
    modelBackgroundImage: string | null;
  }>;
}