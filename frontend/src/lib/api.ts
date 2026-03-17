import { Priority, SortBy, SortOrder, Status, Todo, TodoCreateInput, TodoStatusUpdateInput, TodoUpdateInput } from "./types";

const DEFAULT_BASE_URL = "http://localhost:8000";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
  }
  return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export interface ListTodosParams {
  status?: Status;
  priority?: Priority;
  sort_by?: SortBy;
  order?: SortOrder;
}

export async function listTodos(params: ListTodosParams = {}): Promise<Todo[]> {
  const baseUrl = getBaseUrl();
  const url = new URL("/todos", baseUrl);
  (Object.entries(params) as [string, string | undefined][]).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString(), { cache: "no-store" });
  return handleResponse<Todo[]>(res);
}

export async function createTodo(input: TodoCreateInput): Promise<Todo> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.title,
      description: input.description ?? undefined,
      priority: input.priority ?? "medium",
      due_date: input.due_date ?? null,
    }),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodo(id: number, input: TodoUpdateInput): Promise<Todo> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  return handleResponse<Todo>(res);
}

export async function updateTodoStatus(id: number, status: Status): Promise<Todo> {
  const baseUrl = getBaseUrl();
  const payload: TodoStatusUpdateInput = { status };
  const res = await fetch(`${baseUrl}/todos/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<Todo>(res);
}

export async function deleteTodo(id: number): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    await handleResponse(res as Response);
  }
}
