import { describe, it, expect } from "vitest";
import {
  applyPendingRowEdit,
  completeActiveTaskAtIndex,
  orderArchiveNewestFirst,
  parseActiveTasks,
  parseArchiveTasks,
  restoreFromArchiveDisplayIndex,
  displayIndexToArchiveIndex,
} from "./appTasksDomain";
import type { AppTask } from "@/features/tasks/types/appTask.types";

const activeSample: AppTask[] = [
  { title: "A", description: "first", status: "in-progress" },
  { title: "B", description: "second", status: "to-do" },
];

describe("appTasksDomain", () => {
  it("parses active tasks and rejects done", () => {
    expect(parseActiveTasks(activeSample)).toEqual(activeSample);
    expect(() => parseActiveTasks([{ title: "x", description: "", status: "done" }])).toThrow();
  });

  it("parses archive tasks as done only", () => {
    const archive = [{ title: "x", description: "", status: "done" as const }];
    expect(parseArchiveTasks(archive)).toEqual(archive);
    expect(() => parseArchiveTasks([{ title: "x", description: "", status: "to-do" }])).toThrow();
  });

  it("rejects unknown keys", () => {
    expect(() =>
      parseActiveTasks([{ title: "x", description: "", status: "to-do", id: "1" }])
    ).toThrow();
  });

  it("preserves active order on complete and appends archive", () => {
    const archive: AppTask[] = [];
    const result = completeActiveTaskAtIndex(activeSample, archive, 0);
    expect(result.active).toEqual([activeSample[1]]);
    expect(result.archive).toEqual([{ title: "A", description: "first", status: "done" }]);
  });

  it("maps display index to on-disk archive index", () => {
    const archive = [
      { title: "old", description: "", status: "done" as const },
      { title: "new", description: "", status: "done" as const },
    ];
    expect(displayIndexToArchiveIndex(0, archive.length)).toBe(1);
    expect(orderArchiveNewestFirst(archive)[0].title).toBe("new");
  });

  it("restores at display index and prepends active", () => {
    const archive = [
      { title: "old", description: "", status: "done" as const },
      { title: "new", description: "", status: "done" as const },
    ];
    const result = restoreFromArchiveDisplayIndex([], archive, 0, "in-progress");
    expect(result.active[0]).toEqual({
      title: "new",
      description: "",
      status: "in-progress",
    });
    expect(result.archive).toHaveLength(1);
    expect(result.archive[0].title).toBe("old");
  });

  it("applyPendingRowEdit updates row for flush snapshot", () => {
    const edited = applyPendingRowEdit(activeSample, 1, { title: "B edited" });
    expect(edited[1].title).toBe("B edited");
    expect(activeSample[1].title).toBe("B");
  });
});
