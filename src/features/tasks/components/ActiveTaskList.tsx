import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Stack } from "@mui/material";
import type { AppTask } from "../types/appTask.types";
import { ActiveTaskRow } from "./ActiveTaskRow";
import { TasksListEmptyState } from "./TasksListEmptyState";

interface ActiveTaskListProps {
  tasks: AppTask[];
  onTextChange: (index: number, patch: Partial<Pick<AppTask, "title" | "description">>) => void;
  onFlush: (index: number, patch: Partial<Pick<AppTask, "title" | "description">>) => void;
  onStatusChange: (index: number, status: AppTask["status"]) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (index: number) => void;
}

export const ActiveTaskList = ({
  tasks,
  onTextChange,
  onFlush,
  onStatusChange,
  onReorder,
  onDelete,
}: ActiveTaskListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = tasks.findIndex((_, i) => `active-${i}` === active.id);
    const toIndex = tasks.findIndex((_, i) => `active-${i}` === over.id);
    if (fromIndex >= 0 && toIndex >= 0) {
      void onReorder(fromIndex, toIndex);
    }
  };

  const ids = tasks.map((_, i) => `active-${i}`);

  if (tasks.length === 0) {
    return <TasksListEmptyState variant="active" />;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <Stack spacing={1.5}>
          {tasks.map((task, index) => (
            <ActiveTaskRow
              key={ids[index]}
              task={task}
              index={index}
              onTextChange={(patch) => onTextChange(index, patch)}
              onFlush={(patch) => void onFlush(index, patch)}
              onStatusChange={(status) => void onStatusChange(index, status)}
              onDelete={() => void onDelete(index)}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};
