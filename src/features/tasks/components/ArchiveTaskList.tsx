import { Stack } from "@mui/material";
import type { ActiveTaskStatus, AppTask } from "@/features/tasks/types/appTask.types";
import { ArchiveTaskRow } from "./ArchiveTaskRow";
import { TasksListEmptyState } from "./TasksListEmptyState";

interface ArchiveTaskListProps {
  tasks: AppTask[];
  onRestore: (displayIndex: number, status: ActiveTaskStatus) => void;
}

export const ArchiveTaskList = ({ tasks, onRestore }: ArchiveTaskListProps) => {
  if (tasks.length === 0) {
    return <TasksListEmptyState variant="archive" />;
  }

  return (
    <Stack spacing={1.5}>
      {tasks.map((task, displayIndex) => (
        <ArchiveTaskRow
          key={`${task.title}-${displayIndex}`}
          task={task}
          displayIndex={displayIndex}
          onRestore={onRestore}
        />
      ))}
    </Stack>
  );
};
