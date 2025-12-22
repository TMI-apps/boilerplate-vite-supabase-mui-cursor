import { useState } from "react";
import { Box, Alert } from "@mui/material";
import { Button } from "@common/Button";
import { Input } from "@common/Input";
import type { CreateTodoInput } from "../types/todo.types";

interface TodoFormProps {
  onSubmit: (input: CreateTodoInput) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const TodoForm = ({ onSubmit, loading, error }: TodoFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const input: CreateTodoInput = {
      title: title.trim(),
      description: description.trim() || undefined,
    };

    await onSubmit(input);
    setTitle("");
    setDescription("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Input
        label="Todo Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        required
        fullWidth
        margin="normal"
        placeholder="What needs to be done?"
      />
      <Input
        label="Description (optional)"
        value={description}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />
      <Button type="submit" variant="contained" disabled={loading || !title.trim()} sx={{ mt: 1 }}>
        {loading ? "Adding..." : "Add Todo"}
      </Button>
    </Box>
  );
};
