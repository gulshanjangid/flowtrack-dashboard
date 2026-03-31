import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type ThemeMode = "light" | "dark";

interface ThemeColors {
  primary: string;
  sidebar: string;
  accent: string;
}

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleMode: () => void;
  setColors: (colors: Partial<ThemeColors>) => void;
  resetColors: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

const DEFAULT_COLORS: ThemeColors = {
  primary: "172 50% 40%",
  sidebar: "220 20% 10%",
  accent: "172 50% 94%",
};

const STORAGE_KEY = "flowtrack_theme";

function applyMode(mode: ThemeMode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

function applyColors(colors: ThemeColors) {
  const root = document.documentElement;
  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--ring", colors.primary);
  root.style.setProperty("--sidebar-background", colors.sidebar);
  root.style.setProperty("--accent", colors.accent);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [colors, setColorsState] = useState<ThemeColors>(DEFAULT_COLORS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.mode) setMode(parsed.mode);
        if (parsed.colors) setColorsState({ ...DEFAULT_COLORS, ...parsed.colors });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    applyMode(mode);
    applyColors(colors);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, colors }));
  }, [mode, colors]);

  const toggleMode = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), []);

  const setColors = useCallback((partial: Partial<ThemeColors>) => {
    setColorsState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetColors = useCallback(() => setColorsState(DEFAULT_COLORS), []);

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleMode, setColors, resetColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
