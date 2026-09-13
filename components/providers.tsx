"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomCursor } from "@/components/shared/custom-cursor";

export type ThemeMode = "light" | "dark";

interface AppContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType>({
  soundEnabled: true,
  setSoundEnabled: () => {},
  reducedMotion: false,
  setReducedMotion: () => {},
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useAppPreferences = () => useContext(AppContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 30, // 30 seconds
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [reducedMotion, setReducedMotionState] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  const applyThemeToDOM = useCallback((mode: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (mode === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Restore sound preference
      const savedSound = localStorage.getItem("life_rpg_sound");
      if (savedSound !== null) {
        setSoundEnabledState(savedSound === "true");
      }

      // Restore motion preference
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotionState(mediaQuery.matches);

      // Restore theme preference
      const savedTheme = localStorage.getItem("life_rpg_theme") as ThemeMode | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        applyThemeToDOM(savedTheme);
      } else {
        // Check initial document attribute or fallback to dark
        const initialAttr = document.documentElement.getAttribute("data-theme") as ThemeMode | null;
        const initialMode = initialAttr === "light" ? "light" : "dark";
        setThemeState(initialMode);
        applyThemeToDOM(initialMode);
      }
    }
  }, [applyThemeToDOM]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem("life_rpg_sound", String(enabled));
  };

  const setReducedMotion = (reduced: boolean) => {
    setReducedMotionState(reduced);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    localStorage.setItem("life_rpg_theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider
        value={{
          soundEnabled,
          setSoundEnabled,
          reducedMotion,
          setReducedMotion,
          theme,
          setTheme,
          toggleTheme,
        }}
      >
        {/* Custom RPG cursor */}
        {!reducedMotion && <CustomCursor />}
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
