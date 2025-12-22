import { useState } from "react";
import { Box, Card, CardContent, Typography, Checkbox, IconButton, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Todo, UpdateTodoInput } from "../types/todo.types";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todoId: string, input: UpdateTodoInput) => Promise<void>;
  onDelete: (todoId: string) => Promise<void>;
  loading?: boolean;
}

export const TodoItem = ({ todo, onUpdate, onDelete, loading }: TodoItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    await onUpdate(todo.id, { status: newStatus });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(todo.id);
    setIsDeleting(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
            <Checkbox
              checked={todo.status === "completed"}
              onChange={handleToggleStatus}
              disabled={loading}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: todo.status === "completed" ? "line-through" : "none",
                  color: todo.status === "completed" ? "text.secondary" : "text.primary",
                }}
              >
                {todo.title}
              </Typography>
              {todo.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {todo.description}
                </Typography>
              )}
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Chip
                  label={todo.status}
                  size="small"
                  color={todo.status === "completed" ? "success" : "default"}
                />
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={handleDelete}
            disabled={loading || isDeleting}
            color="error"
            aria-label="Delete todo"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};
