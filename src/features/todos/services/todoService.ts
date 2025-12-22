import { getSupabase } from "@shared/services/supabaseService";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo.types";

const TABLE_NAME = "todos";

export const createTodo = async (
  input: CreateTodoInput,
  userId: string
): Promise<{ todo: Todo | null; error: Error | null }> => {
  try {
    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .insert({
        title: input.title,
        description: input.description || null,
        status: input.status || "pending",
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      return { todo: null, error };
    }

    return { todo: data as Todo, error: null };
  } catch (error) {
    return {
      todo: null,
      error: error instanceof Error ? error : new Error("Create todo failed"),
    };
  }
};

export const getTodos = async (userId: string): Promise<{ todos: Todo[]; error: Error | null }> => {
  try {
    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { todos: [], error };
    }

    return { todos: (data as Todo[]) || [], error: null };
  } catch (error) {
    return {
      todos: [],
      error: error instanceof Error ? error : new Error("Get todos failed"),
    };
  }
};

export const updateTodo = async (
  todoId: string,
  input: UpdateTodoInput
): Promise<{ todo: Todo | null; error: Error | null }> => {
  try {
    const updateData: Partial<Todo> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.status !== undefined) updateData.status = input.status;

    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .update(updateData)
      .eq("id", todoId)
      .select()
      .single();

    if (error) {
      return { todo: null, error };
    }

    return { todo: data as Todo, error: null };
  } catch (error) {
    return {
      todo: null,
      error: error instanceof Error ? error : new Error("Update todo failed"),
    };
  }
};

export const deleteTodo = async (todoId: string): Promise<{ error: Error | null }> => {
  try {
    const { error } = await getSupabase().from(TABLE_NAME).delete().eq("id", todoId);

    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Delete todo failed"),
    };
  }
};
