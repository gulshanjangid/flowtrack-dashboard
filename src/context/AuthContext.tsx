import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

// Mock users for demo
const MOCK_ACCOUNTS: (AuthUser & { password: string })[] = [
  { id: "u1", name: "Alex Rivera", email: "admin@flowtrack.io", password: "admin123", role: "admin", avatar: "" },
  { id: "u4", name: "Priya Patel", email: "manager@flowtrack.io", password: "manager123", role: "manager", avatar: "" },
  { id: "u2", name: "Sarah Chen", email: "member@flowtrack.io", password: "member123", role: "member", avatar: "" },
];

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
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const persist = (u: AuthUser, t: string) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    setUser(u);
    setToken(t);
  };

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 600));
    const account = MOCK_ACCOUNTS.find((a) => a.email === email && a.password === password);
    if (!account) throw new Error("Invalid email or password");
    const { password: _, ...userData } = account;
    const mockToken = `mock-jwt-${Date.now()}`;
    persist(userData, mockToken);
    toast.success(`Welcome back, ${userData.name}!`);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    if (MOCK_ACCOUNTS.some((a) => a.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: AuthUser = {
      id: `u${Date.now()}`,
      name,
      email,
      role: "member",
      avatar: "",
    };
    const mockToken = `mock-jwt-${Date.now()}`;
    MOCK_ACCOUNTS.push({ ...newUser, password });
    persist(newUser, mockToken);
    toast.success("Account created successfully!");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
    toast.info("Logged out");
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
