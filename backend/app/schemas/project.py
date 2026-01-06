from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=3)
    client: str
    project_type: str

    total_tasks: int = Field(..., ge=0)
    estimated_time_per_task: float = Field(..., gt=0)

    required_expertise: List[str]

    start_date: date
    end_date: date

    daily_target: Optional[int] = Field(0, ge=0)

    project_duration_weeks: Optional[int]
    project_duration_days: Optional[int]

    priority: Optional[str] = "medium"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str]
    client: Optional[str]
    project_type: Optional[str]

    total_tasks: Optional[int]
    estimated_time_per_task: Optional[float]

    required_expertise: Optional[List[str]]

    start_date: Optional[date]
    end_date: Optional[date]

    daily_target: Optional[int]

    project_duration_weeks: Optional[int]
    project_duration_days: Optional[int]

    allocated_employees: Optional[int]

    priority: Optional[str]
    project_status: Optional[str]


class ProjectResponse(ProjectBase):
    id: int
    allocated_employees: int
    project_status: str

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
