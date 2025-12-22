import Airtable from "airtable";
import { getAirtableBase, getAirtableTableId } from "@shared/services/airtableService";
import type { DataProvider } from "./types";
import type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStatus,
} from "@features/todos/types/todo.types";

type AirtableRecord = Airtable.Record<Airtable.FieldSet>;
type AirtableTable = Airtable.Table<Airtable.FieldSet>;
type AirtableFieldSet = Airtable.FieldSet;

/**
 * Map Airtable record to Todo type
 */
function mapRecordToTodo(record: AirtableRecord): Todo {
  const fields = record.fields as {
    Title: string;
    Description?: string;
    Status: TodoStatus;
    UserId: string;
    CreatedAt?: string;
    UpdatedAt?: string;
  };

  return {
    id: record.id,
    title: fields.Title,
    description: fields.Description,
    status: fields.Status,
    user_id: fields.UserId,
    created_at: fields.CreatedAt,
    updated_at: fields.UpdatedAt,
  };
}

/**
 * Map Todo to Airtable record fields
 */
function mapTodoToRecordFields(
  input: CreateTodoInput | UpdateTodoInput,
  userId: string
): AirtableFieldSet {
  const fields: AirtableFieldSet = {
    UserId: userId,
  };

  if ("title" in input && input.title !== undefined) {
    fields.Title = input.title;
  }
  if ("description" in input && input.description !== undefined) {
    fields.Description = input.description || "";
  }
  if ("status" in input && input.status !== undefined) {
    fields.Status = input.status;
  }

  return fields;
}

/**
 * Airtable implementation of DataProvider
 */
export class AirtableProvider implements DataProvider {
  private getTable(): AirtableTable {
    const base = getAirtableBase();
    const tableId = getAirtableTableId();
    return base(tableId);
  }

  async createTodo(
    input: CreateTodoInput,
    userId: string
  ): Promise<{ todo: Todo | null; error: Error | null }> {
    try {
      const table = this.getTable();
      const fields = mapTodoToRecordFields(input, userId);

      // Set defaults
      if (!fields.Status) {
        fields.Status = "pending";
      }
      if (!fields.Description) {
        fields.Description = "";
      }

      // Add timestamps
      const now = new Date().toISOString();
      fields.CreatedAt = now;
      fields.UpdatedAt = now;

      const records = await table.create([{ fields }]);
      const record = records[0];

      return { todo: mapRecordToTodo(record), error: null };
    } catch (error) {
      return {
        todo: null,
        error: error instanceof Error ? error : new Error("Create todo failed"),
      };
    }
  }

  async getTodos(userId: string): Promise<{ todos: Todo[]; error: Error | null }> {
    try {
      const table = this.getTable();
      const todos: Todo[] = [];

      await table
        .select({
          filterByFormula: `{UserId} = "${userId}"`,
          sort: [{ field: "CreatedAt", direction: "desc" }],
        })
        .eachPage((records, fetchNextPage) => {
          records.forEach((record) => {
            todos.push(mapRecordToTodo(record));
          });
          fetchNextPage();
        });

      return { todos, error: null };
    } catch (error) {
      return {
        todos: [],
        error: error instanceof Error ? error : new Error("Get todos failed"),
      };
    }
  }

  async updateTodo(
    todoId: string,
    input: UpdateTodoInput
  ): Promise<{ todo: Todo | null; error: Error | null }> {
    try {
      const table = this.getTable();
      const fields: AirtableFieldSet = mapTodoToRecordFields(input, "");

      // Remove UserId from update (shouldn't change)
      delete fields.UserId;

      // Add UpdatedAt timestamp
      fields.UpdatedAt = new Date().toISOString();

      const records = await table.update([
        {
          id: todoId,
          fields,
        },
      ]);

      const record = records[0];
      return { todo: mapRecordToTodo(record), error: null };
    } catch (error) {
      return {
        todo: null,
        error: error instanceof Error ? error : new Error("Update todo failed"),
      };
    }
  }

  async deleteTodo(todoId: string): Promise<{ error: Error | null }> {
    try {
      const table = this.getTable();
      await table.destroy([todoId]);

      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error("Delete todo failed"),
      };
    }
  }
}
