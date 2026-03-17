from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from . import crud
from .models import TodoCreate, TodoRead, TodoUpdate, TodoStatusUpdate, StatusEnum, PriorityEnum

router = APIRouter(prefix="/todos", tags=["todos"])


@router.post("", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
async def create_todo(todo_in: TodoCreate) -> TodoRead:
    return crud.create_todo(todo_in)


@router.get("", response_model=List[TodoRead])
async def list_todos(
    status: Optional[StatusEnum] = Query(default=None),
    priority: Optional[PriorityEnum] = Query(default=None),
    sort_by: Optional[str] = Query(default=None, regex="^(due_date|created_at|priority)$"),
    order: str = Query(default="asc", regex="^(asc|desc)$"),
) -> List[TodoRead]:
    return crud.list_todos(status=status, priority=priority, sort_by=sort_by, order=order)


@router.get("/{todo_id}", response_model=TodoRead)
async def get_todo(todo_id: int) -> TodoRead:
    todo = crud.get_todo(todo_id)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
async def update_todo(todo_id: int, todo_in: TodoUpdate) -> TodoRead:
    todo = crud.update_todo(todo_id, todo_in)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@router.patch("/{todo_id}/status", response_model=TodoRead)
async def update_status(todo_id: int, status_in: TodoStatusUpdate) -> TodoRead:
    todo = crud.update_todo_status(todo_id, status_in)
    if not todo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: int) -> None:
    deleted = crud.delete_todo(todo_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
