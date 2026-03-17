import { useEffect, useState } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = 'mcp-testing-todo-app.todos';

function safeParseTodos(raw: string | null): Todo[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.text === 'string')
      .map((item) => ({
        id: String(item.id ?? crypto.randomUUID()),
        text: String(item.text),
        completed: Boolean(item.completed),
      }));
  } catch {
    return [];
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initial = safeParseTodos(window.localStorage.getItem(STORAGE_KEY));
    setTodos(initial);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Ignore write errors (e.g. storage full or disabled)
    }
  }, [todos]);

  const addTodo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
      },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, deleteTodo };
}
