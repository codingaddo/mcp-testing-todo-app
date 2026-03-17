from datetime import datetime
from typing import List, Optional

from sqlmodel import select

from .database import get_session
from .models import Todo, TodoCreate, TodoRead, TodoUpdate, TodoStatusUpdate, StatusEnum, PriorityEnum


def create_todo(data: TodoCreate) -> TodoRead:
    with get_session() as session:
        todo = Todo.from_orm(data)
        now = datetime.utcnow()
        todo.created_at = now
        todo.updated_at = now
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return TodoRead.from_orm(todo)


def get_todo(todo_id: int) -> Optional[TodoRead]:
    with get_session() as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            return None
        return TodoRead.from_orm(todo)


def list_todos(
    status: Optional[StatusEnum] = None,
    priority: Optional[PriorityEnum] = None,
    sort_by: Optional[str] = None,
    order: str = "asc",
) -> List[TodoRead]:
    with get_session() as session:
        statement = select(Todo)
        if status is not None:
            statement = statement.where(Todo.status == status)
        if priority is not None:
            statement = statement.where(Todo.priority == priority)

        sort_attr_map = {
            "due_date": Todo.due_date,
            "created_at": Todo.created_at,
            "priority": Todo.priority,
        }
        if sort_by in sort_attr_map:
            sort_column = sort_attr_map[sort_by]
            if order == "desc":
                statement = statement.order_by(sort_column.desc())
            else:
                statement = statement.order_by(sort_column.asc())

        results = session.exec(statement).all()
        return [TodoRead.from_orm(todo) for todo in results]


def update_todo(todo_id: int, data: TodoUpdate) -> Optional[TodoRead]:
    with get_session() as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            return None
        for field, value in data.dict().items():
            setattr(todo, field, value)
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return TodoRead.from_orm(todo)


def update_todo_status(todo_id: int, data: TodoStatusUpdate) -> Optional[TodoRead]:
    with get_session() as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            return None
        todo.status = data.status
        todo.updated_at = datetime.utcnow()
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return TodoRead.from_orm(todo)


def delete_todo(todo_id: int) -> bool:
    with get_session() as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            return False
        session.delete(todo)
        session.commit()
        return True
