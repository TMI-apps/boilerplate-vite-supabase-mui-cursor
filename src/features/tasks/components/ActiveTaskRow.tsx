import { useEffect, useState } from "react";
import { Delete, DragIndicator } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AppTask } from "../types/appTask.types";

const STATUS_OPTIONS: AppTask["status"][] = ["to-do", "in-progress", "done"];

const STATUS_COLOR: Record<AppTask["status"], string> = {
  "to-do": "text.secondary",
  "in-progress": "warning.main",
  done: "success.main",
};

interface ActiveTaskRowProps {
  task: AppTask;
  index: number;
  onTextChange: (patch: Partial<Pick<AppTask, "title" | "description">>) => void;
  onFlush: (patch: Partial<Pick<AppTask, "title" | "description">>) => void;
  onStatusChange: (status: AppTask["status"]) => void;
  onDelete: () => void;
}

export const ActiveTaskRow = ({
  task,
  index,
  onTextChange,
  onFlush,
  onStatusChange,
  onDelete,
}: ActiveTaskRowProps) => {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [descriptionDraft, setDescriptionDraft] = useState(task.description);

  useEffect(() => {
    setTitleDraft(task.title);
    setDescriptionDraft(task.description);
  }, [task.title, task.description]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `active-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const collapseRow = () => {
    setExpanded(false);
    setEditingTitle(false);
    void onFlush({ title: titleDraft, description: descriptionDraft });
  };

  const handleStatus = (event: SelectChangeEvent) => {
    onStatusChange(event.target.value as AppTask["status"]);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <IconButton
        size="small"
        aria-label="Drag to reorder"
        sx={{ cursor: "grab", mt: 0.5 }}
        {...attributes}
        {...listeners}
      >
        <DragIndicator fontSize="small" />
      </IconButton>

      <Select
        size="small"
        value={task.status}
        onChange={handleStatus}
        variant="outlined"
        sx={{
          minWidth: "7.5rem",
          color: STATUS_COLOR[task.status],
          "& .MuiSelect-icon": { display: "none" },
        }}
      >
        {STATUS_OPTIONS.map((status) => (
          <MenuItem key={status} value={status} sx={{ color: STATUS_COLOR[status] }}>
            {status}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {editingTitle ? (
          <TextField
            size="small"
            fullWidth
            autoFocus
            value={titleDraft}
            onChange={(e) => {
              setTitleDraft(e.target.value);
              onTextChange({ title: e.target.value });
            }}
            onBlur={collapseRow}
            onKeyDown={(e) => {
              if (e.key === "Enter") collapseRow();
            }}
          />
        ) : (
          <Typography
            variant="body1"
            onClick={() => setExpanded((v) => !v)}
            onDoubleClick={() => {
              setTitleDraft(task.title);
              setEditingTitle(true);
            }}
            sx={{ cursor: "pointer", fontWeight: 500 }}
          >
            {task.title}
          </Typography>
        )}

        <Collapse in={expanded && !editingTitle}>
          <TextField
            size="small"
            fullWidth
            multiline
            minRows={2}
            sx={{ mt: 1 }}
            placeholder="Description"
            value={descriptionDraft}
            onChange={(e) => {
              setDescriptionDraft(e.target.value);
              onTextChange({ description: e.target.value });
            }}
            onBlur={collapseRow}
          />
        </Collapse>
      </Box>

      <IconButton
        size="small"
        aria-label="Delete task"
        color="error"
        onClick={() => {
          if (window.confirm(`Delete "${task.title}" from the active backlog?`)) {
            onDelete();
          }
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};
