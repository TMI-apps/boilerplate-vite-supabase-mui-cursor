import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyPendingRowEdit,
  orderArchiveNewestFirst,
  serializeTasksBaseline,
  tasksMatchBaseline,
} from "../services/appTasksDomain";
import {
  archiveActiveTaskAtIndex,
  fetchActiveTasks,
  fetchArchiveTasks,
  replaceActiveTasks,
  restoreArchiveTask,
} from "../services/appTasksApiService";
import type { ActiveTaskStatus, AppTask, SaveFeedback } from "../types/appTask.types";

const TEXT_SAVE_DEBOUNCE_MS = 400;

export type TasksView = "active" | "archive";

export const useAppTasksBacklog = (enabled: boolean) => {
  const [view, setView] = useState<TasksView>("active");
  const [activeTasks, setActiveTasks] = useState<AppTask[]>([]);
  const [archiveTasks, setArchiveTasks] = useState<AppTask[]>([]);
  const [feedback, setFeedback] = useState<SaveFeedback>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeBaselineRef = useRef("");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingActiveRef = useRef<AppTask[] | null>(null);

  const setFeedbackTimed = useCallback((next: SaveFeedback) => {
    setFeedback(next);
    if (next === "saved" || next === "archived" || next === "restored") {
      window.setTimeout(() => setFeedback("idle"), 2000);
    }
  }, []);

  const loadActive = useCallback(async () => {
    const tasks = await fetchActiveTasks();
    setActiveTasks(tasks);
    activeBaselineRef.current = serializeTasksBaseline(tasks);
    pendingActiveRef.current = null;
    return tasks;
  }, []);

  const loadArchive = useCallback(async () => {
    const tasks = await fetchArchiveTasks();
    setArchiveTasks(tasks);
    return tasks;
  }, []);

  const reloadForView = useCallback(async () => {
    if (!enabled) return;
    setErrorMessage(null);
    if (view === "active") {
      await loadActive();
    } else {
      await loadArchive();
    }
  }, [enabled, view, loadActive, loadArchive]);

  useEffect(() => {
    if (!enabled) return;
    void reloadForView();
  }, [enabled, reloadForView]);

  useEffect(() => {
    if (!enabled) return;
    const onFocus = () => {
      void reloadForView();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [enabled, reloadForView]);

  const assertNoConflict = useCallback(async (): Promise<boolean> => {
    const disk = await fetchActiveTasks();
    if (!tasksMatchBaseline(disk, activeBaselineRef.current)) {
      setActiveTasks(disk);
      activeBaselineRef.current = serializeTasksBaseline(disk);
      setFeedback("error");
      setErrorMessage("Backlog changed on disk. Reloaded — retry your edit.");
      return false;
    }
    return true;
  }, []);

  const persistActive = useCallback(
    async (tasks: AppTask[], successFeedback: SaveFeedback = "saved") => {
      if (!enabled) return false;
      setFeedback("saving");
      setErrorMessage(null);
      const ok = await assertNoConflict();
      if (!ok) return false;
      try {
        const saved = await replaceActiveTasks(tasks);
        setActiveTasks(saved);
        activeBaselineRef.current = serializeTasksBaseline(saved);
        pendingActiveRef.current = null;
        setFeedbackTimed(successFeedback);
        return true;
      } catch (error) {
        setFeedback("error");
        setErrorMessage(error instanceof Error ? error.message : String(error));
        await loadActive();
        return false;
      }
    },
    [enabled, assertNoConflict, loadActive, setFeedbackTimed]
  );

  const flushDebounced = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    const pending = pendingActiveRef.current;
    if (!pending) return;
    pendingActiveRef.current = null;
    await persistActive(pending);
  }, [persistActive]);

  const scheduleTextSave = useCallback(
    (tasks: AppTask[]) => {
      pendingActiveRef.current = tasks;
      setActiveTasks(tasks);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        void persistActive(tasks);
      }, TEXT_SAVE_DEBOUNCE_MS);
    },
    [persistActive]
  );

  const updateRowText = useCallback(
    (rowIndex: number, patch: Partial<Pick<AppTask, "title" | "description">>) => {
      const next = applyPendingRowEdit(activeTasks, rowIndex, patch);
      scheduleTextSave(next);
    },
    [activeTasks, scheduleTextSave]
  );

  const flushRowText = useCallback(
    async (rowIndex: number, patch: Partial<Pick<AppTask, "title" | "description">>) => {
      const snapshot = applyPendingRowEdit(
        pendingActiveRef.current ?? activeTasks,
        rowIndex,
        patch
      );
      pendingActiveRef.current = snapshot;
      setActiveTasks(snapshot);
      await flushDebounced();
    },
    [activeTasks, flushDebounced]
  );

  const changeView = useCallback(
    async (next: TasksView) => {
      await flushDebounced();
      setView(next);
      setErrorMessage(null);
      if (!enabled) return;
      if (next === "active") {
        await loadActive();
      } else {
        await loadArchive();
      }
    },
    [enabled, flushDebounced, loadActive, loadArchive]
  );

  const setStatusAt = useCallback(
    async (index: number, status: AppTask["status"]) => {
      await flushDebounced();
      if (status === "done") {
        setFeedback("saving");
        setErrorMessage(null);
        const ok = await assertNoConflict();
        if (!ok) return;
        try {
          const result = await archiveActiveTaskAtIndex(index);
          setActiveTasks(result.active);
          activeBaselineRef.current = serializeTasksBaseline(result.active);
          setFeedbackTimed("archived");
        } catch (error) {
          setFeedback("error");
          setErrorMessage(error instanceof Error ? error.message : String(error));
          await loadActive();
        }
        return;
      }
      const next = activeTasks.map((task, i) => (i === index ? { ...task, status } : task));
      await persistActive(next);
    },
    [activeTasks, assertNoConflict, flushDebounced, loadActive, persistActive, setFeedbackTimed]
  );

  const reorderActive = useCallback(
    async (fromIndex: number, toIndex: number) => {
      await flushDebounced();
      const next = [...activeTasks];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      await persistActive(next);
    },
    [activeTasks, flushDebounced, persistActive]
  );

  const deleteActiveAt = useCallback(
    async (index: number) => {
      await flushDebounced();
      const next = activeTasks.filter((_, i) => i !== index);
      await persistActive(next);
    },
    [activeTasks, flushDebounced, persistActive]
  );

  const addTask = useCallback(async () => {
    await flushDebounced();
    const next: AppTask[] = [
      ...activeTasks,
      { title: "New task", description: "", status: "to-do" },
    ];
    await persistActive(next);
  }, [activeTasks, flushDebounced, persistActive]);

  const restoreAt = useCallback(
    async (displayIndex: number, status: ActiveTaskStatus) => {
      setFeedback("saving");
      setErrorMessage(null);
      try {
        const result = await restoreArchiveTask(displayIndex, status);
        setActiveTasks(result.active);
        activeBaselineRef.current = serializeTasksBaseline(result.active);
        setArchiveTasks(orderArchiveNewestFirst(result.archive));
        setFeedbackTimed("restored");
      } catch (error) {
        setFeedback("error");
        setErrorMessage(error instanceof Error ? error.message : String(error));
        await loadArchive();
      }
    },
    [loadArchive, setFeedbackTimed]
  );

  const clearFeedback = useCallback(() => {
    setFeedback("idle");
    setErrorMessage(null);
  }, []);

  return {
    view,
    activeTasks,
    archiveTasks,
    feedback,
    errorMessage,
    clearFeedback,
    changeView,
    updateRowText,
    flushRowText,
    setStatusAt,
    reorderActive,
    deleteActiveAt,
    addTask,
    restoreAt,
    reloadForView,
  };
};
