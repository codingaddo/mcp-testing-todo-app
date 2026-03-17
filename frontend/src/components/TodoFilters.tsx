"use client";

import React from "react";
import { Priority, SortBy, SortOrder, Status } from "@/lib/types";

export interface TodoFiltersProps {
  status?: Status;
  priority?: Priority;
  sortBy?: SortBy;
  order?: SortOrder;
  onChange: (filters: {
    status?: Status;
    priority?: Priority;
    sortBy?: SortBy;
    order?: SortOrder;
  }) => void;
}

const statusOptions: (Status | "all")[] = ["all", "pending", "in_progress", "completed"];
const priorityOptions: (Priority | "all")[] = ["all", "low", "medium", "high"];

export const TodoFilters: React.FC<TodoFiltersProps> = ({ status, priority, sortBy, order, onChange }) => {
  return (
    <section className="card filters">
      <h2>Filters & Sorting</h2>
      <div className="filters-grid">
        <div className="field">
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={status ?? "all"}
            onChange={(e) =>
              onChange({
                status: e.target.value === "all" ? undefined : (e.target.value as Status),
                priority,
                sortBy,
                order,
              })
            }
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All" : s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="priorityFilter">Priority</label>
          <select
            id="priorityFilter"
            value={priority ?? "all"}
            onChange={(e) =>
              onChange({
                status,
                priority: e.target.value === "all" ? undefined : (e.target.value as Priority),
                sortBy,
                order,
              })
            }
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sortBy">Sort by</label>
          <select
            id="sortBy"
            value={sortBy ?? "due_date"}
            onChange={(e) =>
              onChange({
                status,
                priority,
                sortBy: e.target.value as SortBy,
                order,
              })
            }
          >
            <option value="due_date">Due date</option>
            <option value="created_at">Created at</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="order">Order</label>
          <select
            id="order"
            value={order ?? "asc"}
            onChange={(e) =>
              onChange({
                status,
                priority,
                sortBy,
                order: e.target.value as SortOrder,
              })
            }
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </section>
  );
};
