import { useEffect, useRef, useState } from "react";
import { Delete, DragIndicator } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { AppTask } from "@/features/tasks/types/appTask.types";
import {
  TASK_STATUS_COLOR,
  TASK_STATUS_LABEL,
  TASK_STATUS_OPTIONS,
  TASK_STATUS_SELECT_MIN_WIDTH,
} from "./taskStatusUi";

type FocusedField = "title" | "description" | null;

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
  const rowRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [focusedField, setFocusedField] = useState<FocusedField>(null);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [descriptionDraft, setDescriptionDraft] = useState(task.description);

  useEffect(() => {
    if (focusedField !== "title") {
      setTitleDraft(task.title);
    }
  }, [task.title, focusedField]);

  useEffect(() => {
    if (focusedField !== "description") {
      setDescriptionDraft(task.description);
    }
  }, [task.description, focusedField]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `active-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const commitRow = () => {
    setExpanded(false);
    setEditingTitle(false);
    setFocusedField(null);
    void onFlush({ title: titleDraft, description: descriptionDraft });
  };

  const handleRowBlur = (event: React.FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && rowRef.current?.contains(next)) {
      return;
    }
    commitRow();
  };

  const handleStatus = (event: SelectChangeEvent) => {
    onStatusChange(event.target.value as AppTask["status"]);
  };

  return (
    <Paper
      ref={(node: HTMLDivElement | null) => {
        setNodeRef(node);
        rowRef.current = node;
      }}
      variant="outlined"
      style={style}
      onBlur={handleRowBlur}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `28px ${TASK_STATUS_SELECT_MIN_WIDTH} auto`,
          sm: `32px ${TASK_STATUS_SELECT_MIN_WIDTH} minmax(0, 1fr) 40px`,
        },
        gridTemplateRows: { xs: "auto auto", sm: "auto" },
        alignItems: "start",
        gap: { xs: 1, sm: 1.5 },
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 2,
        opacity: isDragging ? 0.75 : 1,
        boxShadow: isDragging ? 4 : 0,
        transition: "box-shadow 0.15s ease, opacity 0.15s ease",
        "&:hover": {
          boxShadow: isDragging ? 4 : 1,
          "& .task-delete": { opacity: 1 },
        },
      }}
    >
      <IconButton
        size="small"
        aria-label="Drag to reorder"
        sx={{
          cursor: "grab",
          mt: 0.25,
          color: "text.disabled",
          gridColumn: { xs: 1, sm: 1 },
          gridRow: { xs: 1, sm: 1 },
        }}
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
          width: TASK_STATUS_SELECT_MIN_WIDTH,
          minWidth: TASK_STATUS_SELECT_MIN_WIDTH,
          maxWidth: TASK_STATUS_SELECT_MIN_WIDTH,
          flexShrink: 0,
          gridColumn: { xs: 2, sm: 2 },
          gridRow: { xs: 1, sm: 1 },
          color: TASK_STATUS_COLOR[task.status],
          "& .MuiOutlinedInput-root": { width: TASK_STATUS_SELECT_MIN_WIDTH },
          "& .MuiSelect-select": {
            py: 0.75,
            overflow: "visible",
            textOverflow: "clip",
          },
          "& .MuiSelect-icon": { display: "none" },
        }}
      >
        {TASK_STATUS_OPTIONS.map((status) => (
          <MenuItem key={status} value={status} sx={{ color: TASK_STATUS_COLOR[status] }}>
            {TASK_STATUS_LABEL[status]}
          </MenuItem>
        ))}
      </Select>

      <Box
        sx={{
          minWidth: 0,
          gridColumn: { xs: "1 / -1", sm: 3 },
          gridRow: { xs: 2, sm: 1 },
        }}
      >
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
            onFocus={() => setFocusedField("title")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitRow();
              }
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
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
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
            onFocus={() => {
              setFocusedField("description");
              setExpanded(true);
            }}
          />
        </Collapse>
      </Box>

      <IconButton
        className="task-delete"
        size="small"
        aria-label="Delete task"
        color="error"
        onMouseDown={(event) => {
          event.preventDefault();
        }}
        onClick={() => {
          if (window.confirm(`Delete "${task.title}" from the active backlog?`)) {
            onDelete();
          }
        }}
        sx={{
          gridColumn: { xs: 3, sm: 4 },
          gridRow: 1,
          justifySelf: "center",
          opacity: { xs: 1, sm: 0 },
          transition: "opacity 0.15s ease",
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Paper>
  );
};
