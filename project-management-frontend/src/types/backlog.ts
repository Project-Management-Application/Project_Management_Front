export interface Task {
  taskId: number;
  title: string;
  label: string; // Assuming Label is a string like "TODO", "INPROGRESS", "DONE"
  backlogId?: number; // Direct ID from TaskResponseDTO
  sprintId?: number;  // Direct ID from TaskResponseDTO
  description?: string; // Optional, not in DTO but might be added later
  tickets?: Ticket[];
  checklists?: Checklist[];
  commentSection?: CommentSection;
  backlog?: Backlog; // Optional reference
  sprint?: Sprint;   // Optional reference
}

export interface Backlog {
  backlogId?: number;
  tasks: Task[]; // Updated to use Task[]
  Sprints?: Sprint[];
}

export interface Sprint {
  sprintId: number;
  title: string;
  backlog: Backlog;
  tasks: Task[];
  started?: boolean; // Add this new property
}

export interface Ticket{
  ticketId?: number;
  title: string;
  colorCode: string;
  tasks?: Task[];
}

export interface Checklist{
  checklistId?: number;
  title: string;
  cheklistItems?: ChecklistItem[];
  task?: Task;
}

export interface ChecklistItem{
  checklistItemId?: number;
  title: string;
  checked: boolean
  checklist?: Checklist;
}

export interface CommentSection{
  commentSectionId?: number;
  comments?: Comment[];
  task?: Task;
}

export interface Comment {
  commentId?: number;
  comment: string;
  commentSection?: CommentSection;
}
  