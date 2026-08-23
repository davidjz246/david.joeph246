export enum TaskStatus {
  ToDo = 'todo',
  InProgress = 'in-progress',
  Completed = 'completed',
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

export interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: string;
}

export interface NotificationInfo {
  id: string;
  message: string;
  type: 'success' | 'error';
  isFadingOut?: boolean;
}

export const COLUMNS: ColumnConfig[] = [
  { id: TaskStatus.ToDo, title: 'To Do', icon: 'fa-solid fa-clipboard-list' },
  { id: TaskStatus.InProgress, title: 'In Progress', icon: 'fa-solid fa-spinner' },
  { id: TaskStatus.Completed, title: 'Completed', icon: 'fa-solid fa-circle-check' },
];

export const VALIDATION_RULES = {
  title: {
    minLength: 3,
    maxLength: 100,
  },
  description: {
    maxLength: 500,
  },
};
