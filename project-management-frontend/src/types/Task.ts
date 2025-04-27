import { ReactNode, Key } from "react";

export interface Task {
  id: number;
  name: string;
  description?: string;
  cardId: ReactNode;
  coverImage?: string;
  coverColor?: string;
  status?: 'done' | 'pending';
  
  // Lists and collections
  checklists?: Checklist[];
  labels?: Label[];
  comments?: Comment[];
  attachments?: Attachment[];
  assignedMemberIds?: (string | number)[];
  
  // Dates
  startDate?: Date | string;
  dueDate?: Date | string;
  dueDateReminder?: string;
}

interface Checklist {
  id: string | number;
  title: string;
  items: { id: string | number; text: string; completed: boolean }[];
}

export interface ChecklistItem {
  id: string | number;
  content: string;
  isCompleted: boolean;
  assignedToId?: string | number;
}

export interface Label {
  id: Key | null | undefined;
  tagValue: string;
  value: string;
  color: string;
}

export interface Comment {
  id: Key | null | undefined;
  userId: string | number;
  content: string;
  createdAt: Date | string;
}

interface Attachment {
  id: string | number;
  fileName: string;
  uploadedAt: Date | string;
  fileType: string; // e.g., 'image/png', 'application/pdf'
  url: string; // Data URL or file path for preview/download
}

export interface Member {
  id: string | number;
  name: string;
  avatar?: string;
}

export { Key };
