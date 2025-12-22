import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "../TodoItem";
import type { Todo } from "../../types/todo.types";

describe("TodoItem", () => {
  const mockTodo: Todo = {
    id: "1",
    title: "Test Todo",
    description: "Test Description",
    status: "pending",
    user_id: "user1",
  };

  it("should render todo item with title and description", () => {
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onUpdate={mockUpdate} onDelete={mockDelete} />);

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should call onUpdate when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    const mockDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onUpdate={mockUpdate} onDelete={mockDelete} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(mockUpdate).toHaveBeenCalledWith("1", { status: "completed" });
  });

  it("should call onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn().mockResolvedValue(undefined);

    render(<TodoItem todo={mockTodo} onUpdate={mockUpdate} onDelete={mockDelete} />);

    const deleteButton = screen.getByRole("button", { name: /delete todo/i });
    await user.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledWith("1");
  });
});
