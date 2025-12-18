from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date

class AllocationBase(BaseModel):
    employee_id: int = Field(..., gt=0)
    project_id: int = Field(..., gt=0)
    weekly_hours_allocated: float = Field(..., gt=0)
    weekly_tasks_allocated: int = Field(..., ge=0)
    productivity_override: Optional[float] = Field(None, gt=0)
    effective_week: date

class AllocationCreate(AllocationBase):
    pass

class AllocationUpdate(AllocationBase):
    pass

class Allocation(AllocationBase):
    allocation_id: int
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
