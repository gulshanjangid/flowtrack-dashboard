import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { toast } from "sonner";

export type UserRole = "admin" | "manager" | "member";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "flowtrack_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-login from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
        }
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (u: AuthUser, t: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    setUser(u);
    setToken(t);
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { access_token, refresh_token } = response.data;
      setToken(access_token);

      // Set authorization header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Fetch current user data
      const userResponse = await axios.get(`${API_BASE_URL}/users/me`);
      const userData = userResponse.data;

      const authUser: AuthUser = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role.toLowerCase() as UserRole,
        avatar: "" // Add avatar support later
      };

      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: access_token, user: authUser }));
      toast.success("Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      toast.success("Registration successful");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed");
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Logged out");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
