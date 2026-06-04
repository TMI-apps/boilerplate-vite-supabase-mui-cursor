import type { ActiveTaskStatus, AppTask } from "../types/appTask.types";

const TASK_KEYS = new Set(["title", "description", "status"]);

function assertPlainTask(value: unknown, index: number): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Invalid task at index ${index}`);
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!TASK_KEYS.has(key)) {
      throw new Error(`Unknown key "${key}" at index ${index}`);
    }
  }
  return record;
}

function readTaskFields(record: Record<string, unknown>, index: number): AppTask {
  const { title, description, status } = record;
  if (typeof title !== "string" || typeof description !== "string" || typeof status !== "string") {
    throw new Error(`Invalid task fields at index ${index}`);
  }
  return { title, description, status: status as AppTask["status"] };
}

export function parseActiveTasks(data: unknown): AppTask[] {
  if (!Array.isArray(data)) {
    throw new Error("Active tasks must be an array");
  }
  return data.map((item, index) => {
    const record = assertPlainTask(item, index);
    const task = readTaskFields(record, index);
    if (task.status !== "to-do" && task.status !== "in-progress") {
      throw new Error(
        `Active task at index ${index} must be to-do or in-progress, got ${task.status}`
      );
    }
    return task;
  });
}

export function parseArchiveTasks(data: unknown): AppTask[] {
  if (!Array.isArray(data)) {
    throw new Error("Archive tasks must be an array");
  }
  return data.map((item, index) => {
    const record = assertPlainTask(item, index);
    const task = readTaskFields(record, index);
    if (task.status !== "done") {
      throw new Error(`Archive task at index ${index} must have status done`);
    }
    return task;
  });
}

/** Append order = completion timeline (oldest → newest on disk). */
export function orderArchiveNewestFirst(archive: AppTask[]): AppTask[] {
  return [...archive].reverse();
}

export function displayIndexToArchiveIndex(displayIndex: number, archiveLength: number): number {
  return archiveLength - 1 - displayIndex;
}

export function completeActiveTaskAtIndex(
  active: AppTask[],
  archive: AppTask[],
  index: number
): { active: AppTask[]; archive: AppTask[] } {
  if (index < 0 || index >= active.length) {
    throw new Error("Active index out of range");
  }
  const task = active[index];
  const nextActive = active.filter((_, i) => i !== index);
  const archived: AppTask = {
    title: task.title,
    description: task.description,
    status: "done",
  };
  return { active: nextActive, archive: [...archive, archived] };
}

export function restoreFromArchiveDisplayIndex(
  active: AppTask[],
  archive: AppTask[],
  displayIndex: number,
  status: ActiveTaskStatus
): { active: AppTask[]; archive: AppTask[] } {
  if (displayIndex < 0 || displayIndex >= archive.length) {
    throw new Error("Archive display index out of range");
  }
  const archiveIndex = displayIndexToArchiveIndex(displayIndex, archive.length);
  const task = archive[archiveIndex];
  const nextArchive = archive.filter((_, i) => i !== archiveIndex);
  const restored: AppTask = {
    title: task.title,
    description: task.description,
    status,
  };
  return { active: [restored, ...active], archive: nextArchive };
}

export function serializeTasksBaseline(tasks: AppTask[]): string {
  return JSON.stringify(tasks);
}

/** Apply pending row edits before an immediate flush (text-save flush rule). */
export function applyPendingRowEdit(
  tasks: AppTask[],
  rowIndex: number,
  patch: Partial<Pick<AppTask, "title" | "description">>
): AppTask[] {
  return tasks.map((task, index) => (index === rowIndex ? { ...task, ...patch } : task));
}

export function tasksMatchBaseline(diskTasks: AppTask[], baseline: string): boolean {
  return serializeTasksBaseline(diskTasks) === baseline;
}
