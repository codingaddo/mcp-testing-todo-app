export type Status = "pending" | "in_progress" | "completed";

export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoCreateInput {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
}

export interface TodoUpdateInput {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
  status: Status;
}

export interface TodoStatusUpdateInput {
  status: Status;
}

export type SortBy = "due_date" | "created_at" | "priority";
export type SortOrder = "asc" | "desc";
