export type TodoStatus = "pending" | "completed";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  created_at?: string;
  updated_at?: string;
  user_id: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  status?: TodoStatus;
}
