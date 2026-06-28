import type { TextAutosaveStatus } from "@/features/tasks/types/appTask.types";

import Chip from "@mui/material/Chip";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import Sync from "@mui/icons-material/Sync";

interface TasksAutosaveIndicatorProps {
  status: TextAutosaveStatus;
}

export const TasksAutosaveIndicator = ({ status }: TasksAutosaveIndicatorProps) => {
  if (status === "idle") {
    return null;
  }

  const isSaved = status === "saved";

  return (
    <Chip
      size="small"
      variant="outlined"
      icon={isSaved ? <CheckCircleOutlined /> : <Sync />}
      label={isSaved ? "All changes saved" : "Saving…"}
      color={isSaved ? "success" : "default"}
      aria-live="polite"
      sx={{
        height: 28,
        "@keyframes taskAutosaveSpin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "& .MuiChip-icon": {
          fontSize: 16,
          ...(!isSaved && { animation: "taskAutosaveSpin 1.2s linear infinite" }),
        },
      }}
    />
  );
};
