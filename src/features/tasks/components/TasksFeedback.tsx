import { Alert, Snackbar } from "@mui/material";
import type { SaveFeedback } from "../types/appTask.types";

const FEEDBACK_LABEL: Record<Exclude<SaveFeedback, "idle">, string> = {
  saving: "Saving…",
  saved: "Saved",
  archived: "Archived",
  restored: "Restored",
  error: "Error",
};

interface TasksFeedbackProps {
  feedback: SaveFeedback;
  errorMessage: string | null;
  onDismiss?: () => void;
}

export const TasksFeedback = ({ feedback, errorMessage, onDismiss }: TasksFeedbackProps) => {
  const open = feedback !== "idle" || Boolean(errorMessage);
  if (!open) {
    return null;
  }

  const severity = feedback === "error" ? "error" : feedback === "saving" ? "info" : "success";
  const message =
    feedback === "error" && errorMessage
      ? errorMessage
      : feedback !== "idle"
        ? FEEDBACK_LABEL[feedback]
        : errorMessage;

  if (!message) {
    return null;
  }

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: { xs: 16, sm: 24 }, pointerEvents: "none" }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={onDismiss}
        sx={{ pointerEvents: "auto", maxWidth: 480, width: "calc(100vw - 32px)" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
