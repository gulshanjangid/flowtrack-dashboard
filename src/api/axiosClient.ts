import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import type { Project, Task, User } from "@/utils/constants";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("flowtrack_auth");
  if (token) {
    const parsed = JSON.parse(token);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

export const api = {
  // Projects (mapped to Workflows)
  async getProjects(): Promise<Project[]> {
    const response = await apiClient.get("/workflows/");
    return response.data.workflows.map((w: any) => ({
      id: w.id.toString(),
      name: w.name,
      description: "", // Backend doesn't have description
      createdAt: w.created_at,
      taskCount: 0, // Calculate if needed
    }));
  },
  async createProject(data: Omit<Project, "id" | "createdAt" | "taskCount">): Promise<Project> {
    const response = await apiClient.post("/workflows/", {
      name: data.name,
      team_id: 1, // Default team, adjust as needed
    });
    return {
      id: response.data.id.toString(),
      name: response.data.name,
      description: data.description,
      createdAt: response.data.created_at,
      taskCount: 0,
    };
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const response = await apiClient.get("/tasks/");
    // Get workflow stages to map stage IDs to names
    const stagesResponse = await apiClient.get("/workflows/1/stages"); // Assuming workflow ID 1 for now
    const stages = stagesResponse.data.stages;
    const stageMap = stages.reduce((map: any, stage: any) => {
      map[stage.id] = stage.name;
      return map;
    }, {});
    
    return response.data.tasks.map((t: any) => ({
      id: t.id.toString(),
      title: t.title,
      description: t.description || "",
      status: stageMap[t.workflow_stage_id] || "To Do",
      priority: t.priority.toLowerCase(),
      assignedUser: t.assigned_to?.toString() || "",
      dueDate: t.deadline || "",
      projectId: "1", // Map from workflow
      projectName: "Workflow", // Fetch workflow name
      createdAt: t.created_at,
      comments: [],
      history: [],
    }));
  },
  async getTaskById(id: string): Promise<Task | undefined> {
    const response = await apiClient.get(`/tasks/${id}/`);
    const t = response.data;
    return {
      id: t.id.toString(),
      title: t.title,
      description: t.description || "",
      status: "To Do",
      priority: t.priority.toLowerCase(),
      assignedUser: t.assigned_to?.toString() || "",
      dueDate: t.deadline || "",
      projectId: "1",
      projectName: "Workflow",
      createdAt: t.created_at,
      comments: [],
      history: [],
    };
  },
  async createTask(data: Omit<Task, "id" | "createdAt" | "comments" | "history">): Promise<Task> {
    const response = await apiClient.post("/tasks/", {
      title: data.title,
      description: data.description,
      workflow_stage_id: 1, // Default stage
      priority: data.priority.toUpperCase(),
      deadline: data.dueDate,
      assigned_to: data.assignedUser ? parseInt(data.assignedUser) : null,
    });
    const t = response.data;
    return {
      id: t.id.toString(),
      title: t.title,
      description: t.description || "",
      status: "To Do",
      priority: t.priority.toLowerCase(),
      assignedUser: t.assigned_to?.toString() || "",
      dueDate: t.deadline || "",
      projectId: "1",
      projectName: "Workflow",
      createdAt: t.created_at,
      comments: [],
      history: [],
    };
  },
  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.priority) updateData.priority = data.priority.toUpperCase();
    if (data.dueDate !== undefined) updateData.deadline = data.dueDate;
    if (data.assignedUser !== undefined) updateData.assigned_to = data.assignedUser ? parseInt(data.assignedUser) : null;

    const response = await apiClient.put(`/tasks/${id}/`, updateData);
    const t = response.data;
    return {
      id: t.id.toString(),
      title: t.title,
      description: t.description || "",
      status: "To Do",
      priority: t.priority.toLowerCase(),
      assignedUser: t.assigned_to?.toString() || "",
      dueDate: t.deadline || "",
      projectId: "1",
      projectName: "Workflow",
      createdAt: t.created_at,
      comments: [],
      history: [],
    };
  },
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}/`);
  },
};
