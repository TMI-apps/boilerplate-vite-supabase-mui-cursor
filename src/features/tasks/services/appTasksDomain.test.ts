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
  it("should parse active tasks when status is not done", () => {
    expect(parseActiveTasks(activeSample)).toEqual(activeSample);
    expect(() => parseActiveTasks([{ title: "x", description: "", status: "done" }])).toThrow();
  });

  it("should parse archive tasks when status is done only", () => {
    const archive = [{ title: "x", description: "", status: "done" as const }];
    expect(parseArchiveTasks(archive)).toEqual(archive);
    expect(() => parseArchiveTasks([{ title: "x", description: "", status: "to-do" }])).toThrow();
  });

  it("should reject unknown keys when parsing active tasks", () => {
    expect(() =>
      parseActiveTasks([{ title: "x", description: "", status: "to-do", id: "1" }])
    ).toThrow();
  });

  it("should preserve active order and append archive when completing a task", () => {
    const archive: AppTask[] = [];
    const result = completeActiveTaskAtIndex(activeSample, archive, 0);
    expect(result.active).toEqual([activeSample[1]]);
    expect(result.archive).toEqual([{ title: "A", description: "first", status: "done" }]);
  });

  it("should map display index to on-disk archive index when archive is ordered", () => {
    const archive = [
      { title: "old", description: "", status: "done" as const },
      { title: "new", description: "", status: "done" as const },
    ];
    expect(displayIndexToArchiveIndex(0, archive.length)).toBe(1);
    expect(orderArchiveNewestFirst(archive)[0].title).toBe("new");
  });

  it("should restore at display index and prepend active when unarchiving", () => {
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

  it("should update row for flush snapshot when applying pending edit", () => {
    const edited = applyPendingRowEdit(activeSample, 1, { title: "B edited" });
    expect(edited[1].title).toBe("B edited");
    expect(activeSample[1].title).toBe("B");
  });
});
