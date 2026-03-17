import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "@/components/TodoList";
import { Todo } from "@/lib/types";

const baseTodo: Todo = {
  id: 1,
  title: "Test todo",
  description: "Description",
  status: "pending",
  priority: "medium",
  due_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe("TodoList", () => {
  it("renders todos and triggers callbacks", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const onStatusChange = jest.fn();

    // mock confirm to always return true
    const confirmSpy = jest.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <TodoList
        todos={[baseTodo]}
        loading={false}
        error={null}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    );

    expect(screen.getByText("Test todo")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(baseTodo);

    fireEvent.change(screen.getByLabelText(/Status for/i), { target: { value: "completed" } });
    expect(onStatusChange).toHaveBeenCalledWith(baseTodo, "completed");

    fireEvent.click(screen.getByText("Delete"));
    expect(confirmSpy).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(baseTodo);

    confirmSpy.mockRestore();
  });
});
