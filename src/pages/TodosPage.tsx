import { Typography, Container } from "@mui/material";
import { TodoForm } from "@features/todos/components/TodoForm";
import { TodoList } from "@features/todos/components/TodoList";
import { useTodos } from "@features/todos/hooks/useTodos";
import { useAuthContext } from "@store/contexts/AuthContext";

export const TodosPage = () => {
  const { user } = useAuthContext();
  const { todos, loading, error, createTodo, updateTodo, deleteTodo } = useTodos(user?.id || null);

  const handleCreateTodo = async (input: Parameters<typeof createTodo>[0]) => {
    if (user?.id) {
      await createTodo(input, user.id);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Todos
      </Typography>
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
