"use client";
import { DEFAULT_STORAGE } from "@/types";
import useLocalStorage from "@/hooks/context/useLocalStorage";
import { createContext, useContext, useEffect, useState } from "react";

const LocalStorageContext = createContext(undefined);

export const LocalStorageProvider = ({ children }) => {
  const settingsStorage = useLocalStorage("settings");
  const profileStorage = useLocalStorage("profile");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  const value = {
    settings: { ...DEFAULT_STORAGE.settings, ...settingsStorage.data },
    setSettings: settingsStorage.set,
    updateSettings: settingsStorage.update,
    removeSettings: settingsStorage.remove,
    resetSettings: settingsStorage.reset,
    profile: { ...DEFAULT_STORAGE.profile, ...profileStorage.data },
    setProfile: profileStorage.set,
    updateProfile: profileStorage.update,
    removeProfile: profileStorage.remove,
    resetProfile: profileStorage.reset,
    ready,
  };

  return (
    <LocalStorageContext.Provider value={value}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export function useLocalStorageContext() {
  const context = useContext(LocalStorageContext);
  if (!context)
    throw new Error(
      "LocalStorageContext must be used within LocalStorageProvider",
    );
  return context;
}