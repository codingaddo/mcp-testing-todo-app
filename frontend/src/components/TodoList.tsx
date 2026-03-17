"use client";

import React, { useMemo } from "react";
import { Status, Todo } from "@/lib/types";

export interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error?: string | null;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onStatusChange: (todo: Todo, status: Status) => void;
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export const TodoList: React.FC<TodoListProps> = ({ todos, loading, error, onEdit, onDelete, onStatusChange }) => {
  const hasTodos = todos.length > 0;

  const rows = useMemo(
    () =>
      todos.map((todo) => (
        <tr key={todo.id}>
          <td>
            <div className="todo-title">{todo.title}</div>
            {todo.description && <div className="todo-description">{todo.description}</div>}
          </td>
          <td>
            <select
              aria-label={`Status for ${todo.title}`}
              value={todo.status}
              onChange={(e) => onStatusChange(todo, e.target.value as Status)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </td>
          <td className={`priority-${todo.priority}`}>{todo.priority}</td>
          <td>{formatDate(todo.due_date)}</td>
          <td>{formatDate(todo.created_at)}</td>
          <td>
            <div className="row-actions">
              <button type="button" onClick={() => onEdit(todo)}>
                Edit
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this TODO?")) {
                    onDelete(todo);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      )),
    [todos, onEdit, onDelete, onStatusChange]
  );

  return (
    <section className="card">
      <div className="card-header">
        <h2>TODOs</h2>
      </div>
      {loading && <p>Loading todos...</p>}
      {error && !loading && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!loading && !hasTodos && !error && <p>No todos yet. Add your first one!</p>}
      {hasTodos && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due date</th>
                <th>Created at</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      )}
    </section>
  );
};
