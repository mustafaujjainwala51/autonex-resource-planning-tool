from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.allocation import AllocationCreate, Allocation, AllocationUpdate

router = APIRouter(prefix="/allocations", tags=["Allocations"])

allocations_db: List[dict] = []
allocation_id_counter = 1

@router.post("", response_model=Allocation)
def create_allocation(data: AllocationCreate):
    global allocation_id_counter
    allocation = data.dict()
    allocation["allocation_id"] = allocation_id_counter
    allocations_db.append(allocation)
    allocation_id_counter += 1
    return allocation

@router.get("", response_model=List[Allocation])
def get_allocations():
    return allocations_db

@router.put("/{allocation_id}", response_model=Allocation)
def update_allocation(allocation_id: int, data: AllocationUpdate):
    for allocation in allocations_db:
        if allocation["allocation_id"] == allocation_id:
            allocation.update(data.dict(exclude_unset=True))
            return allocation
    raise HTTPException(status_code=404, detail="Allocation not found")

@router.delete("/{allocation_id}")
def delete_allocation(allocation_id: int):
    global allocations_db
    allocation = next((a for a in allocations_db if a["allocation_id"] == allocation_id), None)

    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")

    allocations_db = [a for a in allocations_db if a["allocation_id"] != allocation_id]
    return {"message": "Allocation removed"}
