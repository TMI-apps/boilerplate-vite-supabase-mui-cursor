import { getDataProvider } from "@shared/services/dataProviders/providerFactory";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo.types";

// Get the appropriate data provider (Supabase → Airtable → Browser Storage)
const provider = getDataProvider();

/**
 * Create a new todo
 */
export const createTodo = async (
  input: CreateTodoInput,
  userId: string
): Promise<{ todo: Todo | null; error: Error | null }> => {
  return provider.createTodo(input, userId);
};

/**
 * Get all todos for a user
 */
export const getTodos = async (userId: string): Promise<{ todos: Todo[]; error: Error | null }> => {
  return provider.getTodos(userId);
};

/**
 * Update an existing todo
 */
export const updateTodo = async (
  todoId: string,
  input: UpdateTodoInput
): Promise<{ todo: Todo | null; error: Error | null }> => {
  return provider.updateTodo(todoId, input);
};

/**
 * Delete a todo
 */
export const deleteTodo = async (todoId: string): Promise<{ error: Error | null }> => {
  return provider.deleteTodo(todoId);
};
