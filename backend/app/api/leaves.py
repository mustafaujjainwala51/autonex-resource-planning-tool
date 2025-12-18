from fastapi import APIRouter
from typing import List
from app.schemas.leave import Leave, LeaveCreate
from app.services.leave_service import create_leave, list_leaves

router = APIRouter(prefix="/leaves", tags=["leaves"])

@router.get("/", response_model=List[Leave])
async def get_all_leaves():
    return list_leaves()

@router.post("/", response_model=Leave, status_code=201)
async def create_leave_api(leave: LeaveCreate):
    return create_leave(leave)
