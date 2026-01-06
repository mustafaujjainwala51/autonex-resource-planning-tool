from pydantic import BaseModel, Field
from datetime import date
from typing import Optional

class AllocationCreate(BaseModel):
    employee_id: int = Field(..., gt=0)
    project_id: int = Field(..., gt=0)
    weekly_hours_allocated: float = Field(..., gt=0)
    weekly_tasks_allocated: int = Field(..., ge=0)
    productivity_override: Optional[float] = Field(1.0, gt=0)
    effective_week: date

class Allocation(AllocationCreate):
    allocation_id: int

class AllocationUpdate(BaseModel):
    weekly_hours_allocated: Optional[float] = Field(None, gt=0)
    weekly_tasks_allocated: Optional[int] = Field(None, ge=0)
    productivity_override: Optional[float] = Field(None, gt=0)
