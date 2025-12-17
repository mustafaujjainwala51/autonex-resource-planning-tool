from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=3)
    client: str
    project_type: str  # PoC | Full | Side
    total_tasks: int = Field(..., ge=0)
    sla_deadline: date
    required_expertise: List[str]
    estimated_time_per_task: float = Field(..., gt=0)
    start_date: date
    end_date: date
    weekly_target: Optional[int] = 0
    priority: Optional[str] = "normal"


class Project(ProjectCreate):
    id: int
    project_status: str = "active"
