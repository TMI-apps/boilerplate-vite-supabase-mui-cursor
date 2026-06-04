import { Box, Stack } from "@mui/material";
import type { ActiveTaskStatus, AppTask } from "../types/appTask.types";
import { ArchiveTaskRow } from "./ArchiveTaskRow";

interface ArchiveTaskListProps {
  tasks: AppTask[];
  onRestore: (displayIndex: number, status: ActiveTaskStatus) => void;
}

export const ArchiveTaskList = ({ tasks, onRestore }: ArchiveTaskListProps) => (
  <Stack spacing={0}>
    {tasks.map((task, displayIndex) => (
      <ArchiveTaskRow
        key={`${task.title}-${displayIndex}`}
        task={task}
        displayIndex={displayIndex}
        onRestore={onRestore}
      />
    ))}
    {tasks.length === 0 && (
      <Box sx={{ color: "text.secondary", py: 2 }}>No archived tasks yet.</Box>
    )}
  </Stack>
);
