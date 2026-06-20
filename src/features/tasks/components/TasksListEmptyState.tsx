import { ArchiveOutlined, AssignmentOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

type EmptyVariant = "active" | "archive";

const COPY: Record<EmptyVariant, { icon: typeof AssignmentOutlined; title: string; hint: string }> =
  {
    active: {
      icon: AssignmentOutlined,
      title: "No active tasks",
      hint: "Add a task to start tracking dev work in this repo.",
    },
    archive: {
      icon: ArchiveOutlined,
      title: "No archived tasks",
      hint: "Completed tasks appear here when you mark them done.",
    },
  };

interface TasksListEmptyStateProps {
  variant: EmptyVariant;
}

export const TasksListEmptyState = ({ variant }: TasksListEmptyStateProps) => {
  const { icon: Icon, title, hint } = COPY[variant];

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        textAlign: "center",
        border: 1,
        borderColor: "divider",
        borderStyle: "dashed",
        borderRadius: 2,
        bgcolor: "action.hover",
      }}
    >
      <Icon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hint}
      </Typography>
    </Box>
  );
};
