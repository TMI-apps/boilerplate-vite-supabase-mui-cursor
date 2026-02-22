import type { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Vite plugin that adds dev-only API endpoints for app code modification
 *
 * This plugin enables the UI to modify app code and configuration files:
 * - /api/write-env: Write environment variables to .env file
 * - /api/write-config: Write app configuration to app.config.json
 *
 * Security: These endpoints only work in development mode (Vite dev server)
 */
export function devApiPlugin(): Plugin {
  return {
    name: "dev-api",
    configureServer(server) {
      // Write env endpoint - modifies .env file
      server.middlewares.use("/api/write-env", (req, res, next) => {
        // Only allow POST requests
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const envVars = JSON.parse(body) as Record<string, string>;

            // Validate that we're only writing VITE_ prefixed vars
            const viteVars: Record<string, string> = {};
            for (const [key, value] of Object.entries(envVars)) {
              if (key.startsWith("VITE_")) {
                viteVars[key] = value;
              }
            }

            // Read existing .env file if it exists
            const envPath = path.resolve(process.cwd(), ".env");
            let existingContent = "";

            if (fs.existsSync(envPath)) {
              existingContent = fs.readFileSync(envPath, "utf-8");
            }

            // Parse existing env vars (simple parsing - handles KEY=value format)
            const existingVars: Record<string, string> = {};
            const lines = existingContent.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith("#")) {
                const match = trimmed.match(/^([^=]+)=(.*)$/);
                if (match) {
                  const key = match[1].trim();
                  const value = match[2].trim();
                  if (key.startsWith("VITE_")) {
                    existingVars[key] = value;
                  }
                }
              }
            }

            // Merge new vars with existing (new vars take precedence)
            const mergedVars = { ...existingVars, ...viteVars };

            // Build new .env content
            const newLines: string[] = [];
            const writtenKeys = new Set<string>();

            // Write existing non-VITE vars and comments first
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith("#")) {
                newLines.push(line);
              } else {
                const match = trimmed.match(/^([^=]+)=/);
                if (match) {
                  const key = match[1].trim();
                  if (!key.startsWith("VITE_")) {
                    newLines.push(line);
                  }
                }
              }
            }

            // Add a separator if we have existing content
            if (newLines.length > 0 && newLines[newLines.length - 1].trim() !== "") {
              newLines.push("");
            }

            // Write VITE_ vars
            for (const [key, value] of Object.entries(mergedVars)) {
              newLines.push(`${key}=${value}`);
              writtenKeys.add(key);
            }

            // Write to file
            fs.writeFileSync(envPath, newLines.join("\n") + "\n", "utf-8");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: true,
                message: "Environment variables written successfully",
                written: Array.from(writtenKeys),
              })
            );
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Failed to write environment variables",
                message: error instanceof Error ? error.message : String(error),
              })
            );
          }
        });
      });

      // Read env endpoint - reads .env file to get current values
      server.middlewares.use("/api/read-env", (req, res) => {
        try {
          const envPath = path.resolve(process.cwd(), ".env");
          const envVars: Record<string, string> = {};

          if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, "utf-8");
            const lines = content.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith("#")) {
                const match = trimmed.match(/^([^=]+)=(.*)$/);
                if (match) {
                  const key = match[1].trim();
                  const value = match[2].trim();
                  if (key.startsWith("VITE_")) {
                    envVars[key] = value;
                  }
                }
              }
            }
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, env: envVars }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Failed to read environment variables",
              message: error instanceof Error ? error.message : String(error),
            })
          );
        }
      });

      // Read config endpoint - reads app.config.json
      server.middlewares.use("/api/read-config", (req, res) => {
        try {
          const configPath = path.resolve(process.cwd(), "app.config.json");
          
          if (!fs.existsSync(configPath)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                error: "Configuration file not found",
              })
            );
            return;
          }

          const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, config }));
        } catch (error) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: "Failed to read configuration",
              message: error instanceof Error ? error.message : String(error),
            })
          );
        }
      });

      // Remove env vars endpoint - removes specified env variables from .env
      server.middlewares.use("/api/remove-env-vars", (req, res, next) => {
        // Only allow POST requests
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const { variables } = JSON.parse(body) as { variables: string[] };

            if (!Array.isArray(variables)) {
              throw new Error("Variables must be an array");
            }

            // Read existing .env file
            const envPath = path.resolve(process.cwd(), ".env");
            
            if (!fs.existsSync(envPath)) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: true,
                  message: "No .env file to remove variables from",
                  removed: [],
                })
              );
              return;
            }

            const existingContent = fs.readFileSync(envPath, "utf-8");
            const lines = existingContent.split("\n");
            const variablesToRemove = new Set(variables);
            const removedVars: string[] = [];
            const newLines: string[] = [];

            // Filter out lines with variables to remove
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith("#")) {
                newLines.push(line);
              } else {
                const match = trimmed.match(/^([^=]+)=/);
                if (match) {
                  const key = match[1].trim();
                  if (variablesToRemove.has(key)) {
                    removedVars.push(key);
                  } else {
                    newLines.push(line);
                  }
                } else {
                  newLines.push(line);
                }
              }
            }

            // Remove trailing empty lines
            while (newLines.length > 0 && newLines[newLines.length - 1].trim() === "") {
              newLines.pop();
            }

            // Write back to file
            const newContent = newLines.length > 0 ? newLines.join("\n") + "\n" : "";
            fs.writeFileSync(envPath, newContent, "utf-8");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: true,
                message: "Environment variables removed successfully",
                removed: removedVars,
              })
            );
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Failed to remove environment variables",
                message: error instanceof Error ? error.message : String(error),
              })
            );
          }
        });
      });

      // Write config endpoint - writes app.config.json
      server.middlewares.use("/api/write-config", (req, res, next) => {
        // Only allow POST requests
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", () => {
          try {
            const config = JSON.parse(body);

            // Validate config structure
            if (!config.version || !config.setup || !config.configurations) {
              throw new Error("Invalid configuration structure");
            }

            // Write to app.config.json
            const configPath = path.resolve(process.cwd(), "app.config.json");
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: true,
                message: "Configuration written successfully",
              })
            );
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                error: "Failed to write configuration",
                message: error instanceof Error ? error.message : String(error),
              })
            );
          }
        });
      });
    },
  };
}
