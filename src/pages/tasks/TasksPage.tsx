import { ArrowBack } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { TasksBacklogPanel } from "@/features/tasks/components/TasksBacklogPanel";

export const TasksPage = () => {
  const isDev = import.meta.env.DEV;

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: (theme) => (theme.palette.mode === "light" ? "grey.50" : "background.default"),
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            mb: 2.5,
            flexShrink: 0,
            alignItems: { xs: "stretch", sm: "flex-start" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Dev task backlog
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 520 }}>
              In-repo checklist for local development and coding agents. Changes sync to{" "}
              <code>src/config/app-tasks.json</code>.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            size="small"
            startIcon={<ArrowBack fontSize="small" />}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" }, flexShrink: 0 }}
          >
            Back to app
          </Button>
        </Stack>

        {!isDev ? (
          <Alert severity="info">
            Dev-only — task management is not available in production builds. The backlog files live
            in the repo at <code>src/config/app-tasks.json</code> and{" "}
            <code>src/config/app-tasks-archive.json</code> for local development and coding agents.
          </Alert>
        ) : (
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: { xs: "60dvh", sm: 0 },
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <TasksBacklogPanel />
          </Paper>
        )}
      </Container>
    </Box>
  );
};
