import { useState } from "react";
import { Box, Collapse, MenuItem, Select, Typography, type SelectChangeEvent } from "@mui/material";
import type { ActiveTaskStatus, AppTask } from "../types/appTask.types";

interface ArchiveTaskRowProps {
  task: AppTask;
  displayIndex: number;
  onRestore: (displayIndex: number, status: ActiveTaskStatus) => void;
}

export const ArchiveTaskRow = ({ task, displayIndex, onRestore }: ArchiveTaskRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<ActiveTaskStatus>("to-do");

  const handleStatusPick = (event: SelectChangeEvent) => {
    const status = event.target.value as ActiveTaskStatus;
    setRestoreStatus(status);
    void onRestore(displayIndex, status);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          onClick={() => setExpanded((v) => !v)}
          sx={{ cursor: "pointer", fontWeight: 500 }}
        >
          {task.title}
        </Typography>
        <Collapse in={expanded}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {task.description || "No description"}
          </Typography>
        </Collapse>
      </Box>
      <Select
        size="small"
        value={restoreStatus}
        onChange={handleStatusPick}
        displayEmpty
        renderValue={() => "Restore"}
        sx={{ minWidth: "7.5rem" }}
      >
        <MenuItem value="to-do">Restore as to-do</MenuItem>
        <MenuItem value="in-progress">Restore as in-progress</MenuItem>
      </Select>
    </Box>
  );
};
