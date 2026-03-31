import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Project, Task, User } from "@/utils/constants";
import { api } from "@/api/axiosClient";
import { useAuth } from "@/context/AuthContext";

interface AppState {
  projects: Project[];
  tasks: Task[];
  users: User[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  addProject: (data: Omit<Project, "id" | "createdAt" | "taskCount">) => Promise<void>;
  addTask: (data: Omit<Task, "id" | "createdAt" | "comments" | "history">) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearError: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(() => withLoading(async () => {
    setProjects(await api.getProjects());
  }), [withLoading]);

  const fetchTasks = useCallback(() => withLoading(async () => {
    setTasks(await api.getTasks());
  }), [withLoading]);

  const fetchUsers = useCallback(() => withLoading(async () => {
    setUsers(await api.getUsers());
  }), [withLoading]);

  const addProject = useCallback(async (data: Omit<Project, "id" | "createdAt" | "taskCount">) => {
    await withLoading(async () => {
      await api.createProject(data);
      setProjects(await api.getProjects());
    });
  }, [withLoading]);

  const addTask = useCallback(async (data: Omit<Task, "id" | "createdAt" | "comments" | "history">) => {
    await withLoading(async () => {
      await api.createTask(data);
      setTasks(await api.getTasks());
    });
  }, [withLoading]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    await withLoading(async () => {
      await api.updateTask(id, data);
      setTasks(await api.getTasks());
    });
  }, [withLoading]);

  const deleteTask = useCallback(async (id: string) => {
    await withLoading(async () => {
      await api.deleteTask(id);
      setTasks(await api.getTasks());
    });
  }, [withLoading]);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchTasks();
      fetchUsers();
    }
  }, [isAuthenticated, fetchProjects, fetchTasks, fetchUsers]);

  return (
    <AppContext.Provider value={{ projects, tasks, users, loading, error, fetchProjects, fetchTasks, fetchUsers, addProject, addTask, updateTask, deleteTask, clearError }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
