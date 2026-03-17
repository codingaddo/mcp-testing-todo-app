import React from 'react';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';

export function TodoApp() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">To-do list</h1>
          <p className="text-sm text-slate-400 mt-1">
            Simple browser-only tasks. Data is stored locally in your browser.
          </p>
        </header>

        <TodoInput onAdd={addTodo} />

        <section className="mt-2">
          {todos.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6 border border-dashed border-slate-700 rounded-lg">
              No tasks yet. Add your first one!
            </p>
          ) : (
            <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
        </section>
      </div>
    </main>
  );
}
