import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Container, Link, Typography } from "@mui/material";
import { TasksBacklogPanel } from "@/features/tasks/components/TasksBacklogPanel";

export const TasksPage = () => {
  const isDev = import.meta.env.DEV;

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          py: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            flexShrink: 0,
          }}
        >
          <Typography variant="h5" component="h1">
            Dev task backlog
          </Typography>
          <Link component={RouterLink} to="/" underline="hover">
            Back to app
          </Link>
        </Box>

        {!isDev ? (
          <Alert severity="info">
            Dev-only — task management is not available in production builds. The backlog files live
            in the repo at <code>src/config/app-tasks.json</code> and{" "}
            <code>src/config/app-tasks-archive.json</code> for local development and coding agents.
          </Alert>
        ) : (
          <TasksBacklogPanel />
        )}
      </Container>
    </Box>
  );
};
