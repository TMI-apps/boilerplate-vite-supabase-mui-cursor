import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * Vite plugin that adds a dev-only API endpoint to write environment variables to .env file
 * This is safe because it only works in dev mode and only writes to .env
 */
export function envWriterPlugin(): Plugin {
  return {
    name: "env-writer",
    configureServer(server) {
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
    },
  };
}

