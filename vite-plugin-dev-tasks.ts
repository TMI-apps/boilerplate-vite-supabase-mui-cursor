import type { Plugin, ViteDevServer } from "vite";
import fs from "fs";
import path from "path";
import {
  completeActiveTaskAtIndex,
  parseActiveTasks,
  parseArchiveTasks,
  orderArchiveNewestFirst,
  restoreFromArchiveDisplayIndex,
} from "./src/features/tasks/services/appTasksDomain";
import type { ActiveTaskStatus } from "./src/features/tasks/types/appTask.types";

const ACTIVE_REL = "src/config/app-tasks.json";
const ARCHIVE_REL = "src/config/app-tasks-archive.json";

function resolveAllowlistedPath(root: string, relative: string): string {
  const resolved = path.resolve(root, relative);
  const normalized = path.normalize(resolved);
  const active = path.normalize(path.resolve(root, ACTIVE_REL));
  const archive = path.normalize(path.resolve(root, ARCHIVE_REL));
  if (normalized !== active && normalized !== archive) {
    throw new Error("Path not allowlisted");
  }
  return normalized;
}

function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as unknown;
}

function writeJsonAtomic(filePath: string, data: unknown): void {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, content, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

function readBody(req: import("http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res: import("http").ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function loadActive(root: string) {
  const filePath = resolveAllowlistedPath(root, ACTIVE_REL);
  const data = readJsonFile(filePath);
  return { filePath, tasks: parseActiveTasks(data) };
}

function loadArchive(root: string) {
  const filePath = resolveAllowlistedPath(root, ARCHIVE_REL);
  const data = readJsonFile(filePath);
  return { filePath, tasks: parseArchiveTasks(data) };
}

function writePair(
  root: string,
  active: ReturnType<typeof parseActiveTasks>,
  archive: ReturnType<typeof parseArchiveTasks>
): void {
  writeJsonAtomic(resolveAllowlistedPath(root, ACTIVE_REL), active);
  writeJsonAtomic(resolveAllowlistedPath(root, ARCHIVE_REL), archive);
}

function registerDevTasksMiddleware(server: ViteDevServer): void {
  const root = server.config.root;

  server.middlewares.use("/__dev/tasks", async (req, res, next) => {
    const url = req.url ?? "";
    if (url !== "" && url !== "/") {
      next();
      return;
    }

    try {
      if (req.method === "GET") {
        const { tasks } = loadActive(root);
        sendJson(res, 200, { tasks });
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { tasks?: unknown };
        if (!payload || !Array.isArray(payload.tasks)) {
          sendJson(res, 400, { error: "Body must include tasks array" });
          return;
        }
        const tasks = parseActiveTasks(payload.tasks);
        writeJsonAtomic(resolveAllowlistedPath(root, ACTIVE_REL), tasks);
        sendJson(res, 200, { success: true, tasks });
        return;
      }

      sendJson(res, 405, { error: "Method not allowed" });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  server.middlewares.use("/__dev/tasks/archive", async (req, res, next) => {
    const url = req.url ?? "";
    if (url !== "" && url !== "/") {
      next();
      return;
    }

    try {
      if (req.method === "GET") {
        const { tasks } = loadArchive(root);
        sendJson(res, 200, { tasks: orderArchiveNewestFirst(tasks) });
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        const payload = JSON.parse(body) as { index?: number };
        if (typeof payload.index !== "number") {
          sendJson(res, 400, { error: "Body must include index" });
          return;
        }
        const activeState = loadActive(root);
        const archiveState = loadArchive(root);
        const result = completeActiveTaskAtIndex(
          activeState.tasks,
          archiveState.tasks,
          payload.index
        );
        writePair(root, result.active, result.archive);
        sendJson(res, 200, { success: true, ...result });
        return;
      }

      sendJson(res, 405, { error: "Method not allowed" });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  server.middlewares.use("/__dev/tasks/restore", async (req, res) => {
    try {
      if (req.method !== "POST") {
        sendJson(res, 405, { error: "Method not allowed" });
        return;
      }
      const body = await readBody(req);
      const payload = JSON.parse(body) as { displayIndex?: number; status?: string };
      if (typeof payload.displayIndex !== "number") {
        sendJson(res, 400, { error: "Body must include displayIndex" });
        return;
      }
      if (payload.status !== "to-do" && payload.status !== "in-progress") {
        sendJson(res, 400, { error: "status must be to-do or in-progress" });
        return;
      }
      const activeState = loadActive(root);
      const archiveState = loadArchive(root);
      const result = restoreFromArchiveDisplayIndex(
        activeState.tasks,
        archiveState.tasks,
        payload.displayIndex,
        payload.status as ActiveTaskStatus
      );
      writePair(root, result.active, result.archive);
      sendJson(res, 200, { success: true, ...result });
    } catch (error) {
      sendJson(res, 500, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

/**
 * Dev-only middleware for in-repo task backlog (app-tasks.json + archive).
 * apply: "serve" — not registered for production builds or preview writes.
 */
export function devTasksPlugin(): Plugin {
  return {
    name: "dev-tasks-api",
    apply: "serve",
    configureServer(server) {
      registerDevTasksMiddleware(server);
    },
  };
}
