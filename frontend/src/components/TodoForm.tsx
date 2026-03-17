"use client";

import React, { useEffect, useState } from "react";
import { Priority, Status, Todo, TodoCreateInput } from "@/lib/types";

export interface TodoFormProps {
  initialTodo?: Todo;
  onSubmit: (data: TodoCreateInput & { status?: Status }) => Promise<void> | void;
  onCancel?: () => void;
}

const priorities: Priority[] = ["low", "medium", "high"];

export const TodoForm: React.FC<TodoFormProps> = ({ initialTodo, onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [status, setStatus] = useState<Status>("pending");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTodo) {
      setTitle(initialTodo.title);
      setDescription(initialTodo.description ?? "");
      setPriority(initialTodo.priority);
      setDueDate(initialTodo.due_date ? initialTodo.due_date.substring(0, 10) : "");
      setStatus(initialTodo.status);
    }
  }, [initialTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        status: initialTodo ? status : undefined,
      });
      if (!initialTodo) {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{initialTodo ? "Edit TODO" : "Create TODO"}</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="field">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      {initialTodo && (
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}
      <div className="actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="secondary">
            Cancel
          </button>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : initialTodo ? "Save changes" : "Add TODO"}
        </button>
      </div>
    </form>
  );
};
