export const API_BASE_URL = "http://localhost:5000/api";

export const TASK_STATUSES = ["To Do", "In Progress", "In Review", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  taskCount: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedUser: string;
  dueDate: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  comments: Comment[];
  history: StatusChange[];
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface StatusChange {
  from: TaskStatus;
  to: TaskStatus;
  changedAt: string;
  changedBy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}
