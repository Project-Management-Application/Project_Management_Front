export interface Backlog{
  backlogId?: number;
  tasks?: Task[];
  Sprints?: Sprint[];
}
  
export interface Sprint {
  sprintId?: number; 
  backlog: Backlog;  
  tasks?: Task[];    
}

export interface Task {
  taskId?: number; 
  title: string;  
  label: string;    
  description?: string;
  tickets?: Ticket[];
  backlog?: Backlog;
  sprint?: Sprint;
  checklists?: Checklist[];
  commentSection?: CommentSection;
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
  