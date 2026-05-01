"use client";
import { LocalStorageProvider } from "@/context/LocalStorageContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }) {
  return (
    <LocalStorageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LocalStorageProvider>
  );
}