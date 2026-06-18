import type { ActiveTaskStatus, AppTask } from "../types/appTask.types";

const ACTIVE_URL = "/__dev/tasks";
const ARCHIVE_URL = "/__dev/tasks/archive";
const RESTORE_URL = "/__dev/tasks/restore";

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? String(data.error)
        : `Request failed (${response.status})`
    );
  }
  return data;
}

export const fetchActiveTasks = async (): Promise<AppTask[]> => {
  const data = await parseJson<{ tasks: AppTask[] }>(await fetch(ACTIVE_URL));
  return data.tasks;
};

export const fetchArchiveTasks = async (): Promise<AppTask[]> => {
  const data = await parseJson<{ tasks: AppTask[] }>(await fetch(ARCHIVE_URL));
  return data.tasks;
};

export const replaceActiveTasks = async (tasks: AppTask[]): Promise<AppTask[]> => {
  const data = await parseJson<{ tasks: AppTask[] }>(
    await fetch(ACTIVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    })
  );
  return data.tasks;
};

export const archiveActiveTaskAtIndex = async (
  index: number
): Promise<{ active: AppTask[]; archive: AppTask[] }> => {
  return parseJson<{ active: AppTask[]; archive: AppTask[] }>(
    await fetch(ARCHIVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    })
  );
};

export const restoreArchiveTask = async (
  displayIndex: number,
  status: ActiveTaskStatus
): Promise<{ active: AppTask[]; archive: AppTask[] }> => {
  return parseJson<{ active: AppTask[]; archive: AppTask[] }>(
    await fetch(RESTORE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayIndex, status }),
    })
  );
};
