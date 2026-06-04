import { Box, Button, Tab, Tabs } from "@mui/material";
import { useAppTasksBacklog } from "../hooks/useAppTasksBacklog";
import { ActiveTaskList } from "./ActiveTaskList";
import { ArchiveTaskList } from "./ArchiveTaskList";
import { TasksFeedback } from "./TasksFeedback";

export const TasksBacklogPanel = () => {
  const {
    view,
    activeTasks,
    archiveTasks,
    feedback,
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
      <Tabs
        value={tabIndex}
        onChange={(_, index) => {
          void changeView(index === 0 ? "active" : "archive");
        }}
        sx={{ flexShrink: 0, mb: 1, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label={`Active (${activeTasks.length})`} />
        <Tab label={`Archive (${archiveTasks.length})`} />
      </Tabs>
      {view === "active" && (
        <Box sx={{ flexShrink: 0, mb: 1 }}>
          <Button variant="outlined" onClick={() => void addTask()}>
            Add task
          </Button>
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          pb: 2,
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
