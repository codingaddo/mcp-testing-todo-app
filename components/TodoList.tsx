import React from 'react';
import type { Todo } from '../hooks/useTodos';
import { TodoListItem } from './TodoListItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <ul className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
