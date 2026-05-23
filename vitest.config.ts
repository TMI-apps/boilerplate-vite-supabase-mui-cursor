import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    // Default 5000ms is too tight when the full suite warms JSDOM + MUI on slower hosts (Windows).
    testTimeout: 10_000,
    hookTimeout: 10_000,
    server: {
      deps: {
        fallbackCJS: true,
        inline: ["@mui/material", "@mui/icons-material"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@common": path.resolve(__dirname, "./src/common"),
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
