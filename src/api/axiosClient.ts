import { API_BASE_URL } from "@/utils/constants";
import type { Project, Task, User } from "@/utils/constants";
import { mockProjects, mockTasks, mockUsers } from "@/utils/mockData";

// In production, replace mock implementations with actual axios calls:
// import axios from "axios";
// const api = axios.create({ baseURL: API_BASE_URL });

// For now, simulate API with delays and mock data
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

let projects = [...mockProjects];
let tasks = [...mockTasks];
let users = [...mockUsers];

export const api = {
  // Projects
  async getProjects(): Promise<Project[]> {
    await delay();
    return [...projects];
  },
  async createProject(data: Omit<Project, "id" | "createdAt" | "taskCount">): Promise<Project> {
    await delay();
    const p: Project = { ...data, id: `p${Date.now()}`, createdAt: new Date().toISOString(), taskCount: 0 };
    projects.push(p);
    return p;
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    await delay();
    return [...tasks];
  },
  async getTaskById(id: string): Promise<Task | undefined> {
    await delay();
    return tasks.find((t) => t.id === id);
  },
  async createTask(data: Omit<Task, "id" | "createdAt" | "comments" | "history">): Promise<Task> {
    await delay();
    const t: Task = { ...data, id: `t${Date.now()}`, createdAt: new Date().toISOString(), comments: [], history: [] };
    tasks.push(t);
    return t;
  },
  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await delay();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    tasks[idx] = { ...tasks[idx], ...data };
    return tasks[idx];
  },
  async deleteTask(id: string): Promise<void> {
    await delay();
    tasks = tasks.filter((t) => t.id !== id);
  },

  // Users
  async getUsers(): Promise<User[]> {
    await delay();
    return [...users];
  },
};
