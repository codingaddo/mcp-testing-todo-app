"use client";

import React, { useEffect, useState } from "react";
import { createTodo, deleteTodo, listTodos, updateTodo, updateTodoStatus } from "@/lib/api";
import { Priority, SortBy, SortOrder, Status, Todo } from "@/lib/types";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoFilters } from "@/components/TodoFilters";

export default function HomePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status?: Status;
    priority?: Priority;
    sortBy?: SortBy;
    order?: SortOrder;
  }>({ sortBy: "due_date", order: "asc" });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTodos({
        status: filters.status,
        priority: filters.priority,
        sort_by: filters.sortBy,
        order: filters.order,
      });
      setTodos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load todos";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.priority, filters.sortBy, filters.order]);

  const handleCreate = async (data: { title: string; description?: string; priority?: Priority; due_date?: string | null }) => {
    await createTodo(data);
    await fetchTodos();
  };

  const handleUpdate = async (data: { title: string; description?: string; priority?: Priority; due_date?: string | null; status?: Status }) => {
    if (!editingTodo) return;
    await updateTodo(editingTodo.id, {
      title: data.title,
      description: data.description,
      priority: data.priority ?? editingTodo.priority,
      due_date: data.due_date ?? editingTodo.due_date ?? null,
      status: data.status ?? editingTodo.status,
    });
    setEditingTodo(null);
    await fetchTodos();
  };

  const handleStatusChange = async (todo: Todo, status: Status) => {
    await updateTodoStatus(todo.id, status);
    await fetchTodos();
  };

  const handleDelete = async (todo: Todo) => {
    await deleteTodo(todo.id);
    await fetchTodos();
  };

  return (
    <main>
      <header className="page-header">
        <h1>MCP Testing TODO App</h1>
      </header>
      <div className="layout">
        <div className="left-column">
          <TodoForm
            initialTodo={editingTodo ?? undefined}
            onSubmit={editingTodo ? handleUpdate : handleCreate}
            onCancel={() => setEditingTodo(null)}
          />
          <TodoFilters
            status={filters.status}
            priority={filters.priority}
            sortBy={filters.sortBy}
            order={filters.order}
            onChange={(next) => setFilters(next)}
          />
        </div>
        <div className="right-column">
          <TodoList
            todos={todos}
            loading={loading}
            error={error}
            onEdit={(todo) => setEditingTodo(todo)}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </main>
  );
}
