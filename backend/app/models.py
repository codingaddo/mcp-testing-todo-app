from __future__ import annotations

from datetime import datetime, date
from enum import Enum
from typing import Optional

from sqlmodel import SQLModel, Field


class StatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TodoBase(SQLModel):
    title: str = Field(index=True, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: StatusEnum = Field(default=StatusEnum.pending, index=True)
    priority: PriorityEnum = Field(default=PriorityEnum.medium, index=True)
    due_date: Optional[date] = Field(default=None, index=True)


class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, index=True)


class TodoCreate(TodoBase):
    status: Optional[StatusEnum] = Field(default=StatusEnum.pending)


class TodoRead(TodoBase):
    id: int
    created_at: datetime
    updated_at: datetime


class TodoUpdate(SQLModel):
    title: str
    description: Optional[str] = None
    status: StatusEnum
    priority: PriorityEnum
    due_date: Optional[date] = None


class TodoStatusUpdate(SQLModel):
    status: StatusEnum
