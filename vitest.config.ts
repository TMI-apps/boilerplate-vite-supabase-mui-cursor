import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    // Node test runner files under scripts/ (e.g. change-classify.test.cjs via pnpm test:classify)
    exclude: ["**/node_modules/**", "**/dist/**", "scripts/**"],
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
    },
  },
});
