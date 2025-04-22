export interface Task {
  id: number;
  name: string;
  description?: string;
  cover?: string;
  labels?: { category: string; tag: string; color: string }[];
  comments?: string[];
  startDate?: string;
  dueDate?: string;
  dueDateReminder?: string;
  attachments?: string[];
  checklist?: { text: string; completed: boolean; assigned?: string }[];
  assignedMembers?: string[];
  status?: 'done' | 'pending';
}
