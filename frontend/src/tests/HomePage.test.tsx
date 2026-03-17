import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HomePage from "@/app/page";
import * as api from "@/lib/api";
import { Todo } from "@/lib/types";

jest.mock("@/lib/api");

const mockTodos: Todo[] = [
  {
    id: 1,
    title: "Existing todo",
    description: "Existing description",
    status: "pending",
    priority: "medium",
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe("HomePage", () => {
  beforeEach(() => {
    (api.listTodos as jest.Mock).mockResolvedValue(mockTodos);
    (api.createTodo as jest.Mock).mockResolvedValue(mockTodos[0]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders list and allows creating a todo", async () => {
    render(<HomePage />);

    expect(api.listTodos).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText("Existing todo")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "New todo" } });
    fireEvent.click(screen.getByText("Add TODO"));

    await waitFor(() => {
      expect(api.createTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New todo",
        })
      );
    });
  });

  it("shows error when listTodos fails", async () => {
    (api.listTodos as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });
});
