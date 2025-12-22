import { Typography, Container, Alert } from "@mui/material";
import { TodoForm } from "@features/todos/components/TodoForm";
import { TodoList } from "@features/todos/components/TodoList";
import { useTodos } from "@features/todos/hooks/useTodos";
import { useAuthContext } from "@store/contexts/AuthContext";
import { isSupabaseConfigured } from "@shared/services/supabaseService";

export const TodosPage = () => {
  const { user } = useAuthContext();
  const { todos, loading, error, createTodo, updateTodo, deleteTodo } = useTodos(user?.id || null);
  const supabaseConfigured = isSupabaseConfigured();

  const handleCreateTodo = async (input: Parameters<typeof createTodo>[0]) => {
    // Use empty string for userId when Supabase is not configured (browser storage)
    const userId = user?.id || "";
    await createTodo(input, userId);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Todos
      </Typography>
      {!supabaseConfigured && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Todos are saved in your browser. Connect Supabase to sync your
            todos across devices.
          </Typography>
        </Alert>
      )}
      <TodoForm onSubmit={handleCreateTodo} loading={loading} error={error} />
      <TodoList
        todos={todos}
        loading={loading}
        error={error}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </Container>
  );
};
