import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { TodoItem } from "./TodoItem";
import type { Todo, UpdateTodoInput } from "../types/todo.types";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  onUpdate: (todoId: string, input: UpdateTodoInput) => Promise<void>;
  onDelete: (todoId: string) => Promise<void>;
}

export const TodoList = ({ todos, loading, error, onUpdate, onDelete }: TodoListProps) => {
  if (loading && todos.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (todos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No todos yet. Create your first todo above!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={onUpdate}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </Box>
  );
};
