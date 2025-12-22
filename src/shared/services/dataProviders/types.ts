import type { Todo, CreateTodoInput, UpdateTodoInput } from "@features/todos/types/todo.types";

/**
 * Data provider interface for abstracting backend implementations
 * All data providers must implement this interface
 */
export interface DataProvider {
  /**
   * Create a new todo
   */
  createTodo(
    input: CreateTodoInput,
    userId: string
  ): Promise<{ todo: Todo | null; error: Error | null }>;

  /**
   * Get all todos for a user
   */
  getTodos(userId: string): Promise<{ todos: Todo[]; error: Error | null }>;

  /**
   * Update an existing todo
   */
  updateTodo(
    todoId: string,
    input: UpdateTodoInput
  ): Promise<{ todo: Todo | null; error: Error | null }>;

  /**
   * Delete a todo
   */
  deleteTodo(todoId: string): Promise<{ error: Error | null }>;
}
