// src/types/Invitations.ts
export interface WorkspaceInvitation {
  id: number;
  workspaceName: string;
  expiresAt: string;
}

export interface ProjectInvitation {
  id: number;
  projectName: string;
  role: string;
  invitedBy: string;
  expiresAt: string;
}