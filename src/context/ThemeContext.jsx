"use client";
import { createContext, useContext } from "react";
import { useLocalStorageContext } from "@/context/LocalStorageContext";

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const { settings, updateSettings } = useLocalStorageContext();

  const theme = settings.theme;
  const setTheme = (theme) => updateSettings({ theme });
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
