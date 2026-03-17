import React, { useState, KeyboardEvent, FormEvent } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(event as unknown as FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a task and press Enter or click Add"
        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-50 placeholder:text-slate-500 min-w-0"
      />
      <button
        type="submit"
        className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!value.trim()}
      >
        Add
      </button>
    </form>
  );
}
