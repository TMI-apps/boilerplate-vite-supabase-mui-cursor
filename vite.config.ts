import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { devApiPlugin } from "./vite-plugin-dev-api";
import { devTasksPlugin } from "./vite-plugin-dev-tasks";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin(), devTasksPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
