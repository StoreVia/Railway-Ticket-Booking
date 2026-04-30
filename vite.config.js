import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
    process: {
      env: {}
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "next/navigation": path.resolve(__dirname, "src/shims/next-navigation.js"),
      "next/link": path.resolve(__dirname, "src/shims/next-link.jsx"),
      "next/font/google": path.resolve(__dirname, "src/shims/next-font-google.js")
    }
  },
  server: {
    port: 3000
  }
});
