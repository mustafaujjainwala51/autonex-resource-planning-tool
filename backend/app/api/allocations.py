from fastapi import APIRouter
from typing import List
from app.schemas.allocation import Allocation, AllocationCreate
from app.services.allocation_service import create_allocation, list_allocations

router = APIRouter(prefix="/allocations", tags=["allocations"])

@router.get("/", response_model=List[Allocation])
async def get_all_allocations():
    return list_allocations()

@router.post("/", response_model=Allocation, status_code=201)
async def create_allocation_api(allocation: AllocationCreate):
    return create_allocation(allocation)
