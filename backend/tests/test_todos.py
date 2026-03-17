from datetime import date, timedelta

from fastapi.testclient import TestClient

from app.main import app
from app.database import init_db


client = TestClient(app)


def setup_module(module):  # noqa: D401
    """Initialize the database before tests run."""
    init_db()


def test_create_todo():
    payload = {
        "title": "Test TODO",
        "description": "Test description",
        "priority": "high",
    }
    response = client.post("/todos", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["status"] == "pending"


def test_list_todos_and_filters_and_sorting():
    today = date.today()
    payloads = [
        {
            "title": "Todo 1",
            "description": "First",
            "priority": "low",
            "status": "pending",
            "due_date": str(today + timedelta(days=3)),
        },
        {
            "title": "Todo 2",
            "description": "Second",
            "priority": "medium",
            "status": "in_progress",
            "due_date": str(today + timedelta(days=1)),
        },
        {
            "title": "Todo 3",
            "description": "Third",
            "priority": "high",
            "status": "completed",
            "due_date": str(today + timedelta(days=2)),
        },
    ]

    for payload in payloads:
        resp = client.post("/todos", json=payload)
        assert resp.status_code == 201

    # List all
    resp = client.get("/todos")
    assert resp.status_code == 200
    todos = resp.json()
    assert len(todos) >= 3

    # Filter by status
    resp = client.get("/todos", params={"status": "pending"})
    assert resp.status_code == 200
    todos = resp.json()
    assert all(t["status"] == "pending" for t in todos)

    # Filter by priority
    resp = client.get("/todos", params={"priority": "high"})
    assert resp.status_code == 200
    todos = resp.json()
    assert all(t["priority"] == "high" for t in todos)

    # Sort by due_date desc
    resp = client.get("/todos", params={"sort_by": "due_date", "order": "desc"})
    assert resp.status_code == 200
    todos = resp.json()
    due_dates = [t["due_date"] for t in todos if t["due_date"] is not None]
    assert due_dates == sorted(due_dates, reverse=True)


def test_get_update_and_delete_todo():
    payload = {
        "title": "To Update",
        "description": "Before update",
        "priority": "medium",
    }
    resp = client.post("/todos", json=payload)
    assert resp.status_code == 201
    todo = resp.json()
    todo_id = todo["id"]

    # Get
    resp = client.get(f"/todos/{todo_id}")
    assert resp.status_code == 200

    # Full update
    update_payload = {
        "title": "Updated title",
        "description": "Updated description",
        "status": "in_progress",
        "priority": "high",
        "due_date": str(date.today() + timedelta(days=5)),
    }
    resp = client.put(f"/todos/{todo_id}", json=update_payload)
    assert resp.status_code == 200
    updated = resp.json()
    assert updated["title"] == "Updated title"
    assert updated["status"] == "in_progress"

    # Status patch
    status_payload = {"status": "completed"}
    resp = client.patch(f"/todos/{todo_id}/status", json=status_payload)
    assert resp.status_code == 200
    patched = resp.json()
    assert patched["status"] == "completed"

    # Delete
    resp = client.delete(f"/todos/{todo_id}")
    assert resp.status_code == 204

    # Ensure 404 after delete
    resp = client.get(f"/todos/{todo_id}")
    assert resp.status_code == 404


def test_invalid_filters_and_sort_params():
    # invalid status
    resp = client.get("/todos", params={"status": "invalid"})
    assert resp.status_code == 422

    # invalid sort_by
    resp = client.get("/todos", params={"sort_by": "invalid"})
    assert resp.status_code == 422

    # invalid order
    resp = client.get("/todos", params={"order": "invalid"})
    assert resp.status_code == 422
