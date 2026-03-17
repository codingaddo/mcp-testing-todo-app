import React from 'react';
import type { Todo } from '../hooks/useTodos';

interface TodoListItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoListItem({ todo, onToggle, onDelete }: TodoListItemProps) {
  return (
    <li className="group flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
      <button
        type="button"
        aria-label={todo.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        onClick={() => onToggle(todo.id)}
        className="mt-0.5 h-5 w-5 flex items-center justify-center rounded border border-slate-500 bg-slate-900 text-xs text-slate-100 hover:border-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
      >
        {todo.completed ? '✓' : ''}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm break-words whitespace-pre-wrap ${
            todo.completed ? 'line-through text-slate-500' : 'text-slate-100'
          }`}
        >
          {todo.text}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="ml-2 text-xs text-slate-400 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Delete
      </button>
    </li>
  );
}
