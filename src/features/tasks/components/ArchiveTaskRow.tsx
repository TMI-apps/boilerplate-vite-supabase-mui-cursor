import { useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  MenuItem,
  Paper,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
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
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 2,
        transition: "box-shadow 0.15s ease",
        "&:hover": { boxShadow: 1 },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.25 }}>
          <Typography
            variant="body1"
            onClick={() => setExpanded((v) => !v)}
            sx={{ cursor: "pointer", fontWeight: 500, lineHeight: 1.4, wordBreak: "break-word" }}
          >
            {task.title}
          </Typography>
          <Chip label="Done" size="small" color="success" variant="outlined" sx={{ height: 22 }} />
        </Box>

        <Collapse in={expanded}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
            {task.description || "No description"}
          </Typography>
        </Collapse>

        {!task.description && !expanded && (
          <Typography variant="caption" color="text.disabled">
            Click title to view details
          </Typography>
        )}
      </Box>

      <Select
        size="small"
        value={restoreStatus}
        onChange={handleStatusPick}
        displayEmpty
        renderValue={() => "Restore"}
        sx={{ minWidth: "7.5rem", flexShrink: 0, "& .MuiSelect-select": { py: 0.75 } }}
      >
        <MenuItem value="to-do">As to-do</MenuItem>
        <MenuItem value="in-progress">As active</MenuItem>
      </Select>
    </Paper>
  );
};
