import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { devTasksPlugin } from "./vite-plugin-dev-tasks";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devTasksPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
