import { Add } from "@mui/icons-material";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import { useAppTasksBacklog } from "@/features/tasks/hooks/useAppTasksBacklog";
import { ActiveTaskList } from "./ActiveTaskList";
import { ArchiveTaskList } from "./ArchiveTaskList";
import { TasksAutosaveIndicator } from "./TasksAutosaveIndicator";
import { TasksFeedback } from "./TasksFeedback";

export const TasksBacklogPanel = () => {
  const {
    view,
    activeTasks,
    archiveTasks,
    feedback,
    textAutosaveStatus,
    errorMessage,
    changeView,
    updateRowText,
    flushRowText,
    setStatusAt,
    reorderActive,
    deleteActiveAt,
    addTask,
    restoreAt,
    clearFeedback,
  } = useAppTasksBacklog(true);

  const tabIndex = view === "active" ? 0 : 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <TasksFeedback
        feedback={feedback}
        errorMessage={errorMessage}
        onDismiss={() => clearFeedback()}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          flexShrink: 0,
          px: { xs: 1.5, sm: 2 },
          pt: 1,
          pb: 0,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(_, index) => {
            void changeView(index === 0 ? "active" : "archive");
          }}
          sx={{ minHeight: 40 }}
        >
          <Tab label={`Active (${activeTasks.length})`} sx={{ minHeight: 40, py: 1 }} />
          <Tab label={`Archive (${archiveTasks.length})`} sx={{ minHeight: 40, py: 1 }} />
        </Tabs>

        {view === "active" && (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", pb: { xs: 0.5, sm: 0 } }}>
            <TasksAutosaveIndicator status={textAutosaveStatus} />
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => void addTask()}
            >
              Add task
            </Button>
          </Stack>
        )}
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          px: { xs: 1.5, sm: 2 },
          py: 2,
        }}
      >
        {view === "active" ? (
          <ActiveTaskList
            tasks={activeTasks}
            onTextChange={updateRowText}
            onFlush={flushRowText}
            onStatusChange={(index, status) => void setStatusAt(index, status)}
            onReorder={(from, to) => void reorderActive(from, to)}
            onDelete={(index) => void deleteActiveAt(index)}
          />
        ) : (
          <ArchiveTaskList tasks={archiveTasks} onRestore={restoreAt} />
        )}
      </Box>
    </Box>
  );
};
