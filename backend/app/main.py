from fastapi import FastAPI
from app.api.projects import router as project_router
from app.api.allocations import router as allocation_router
from app.api.leaves import router as leave_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Autonex Resource Planning API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(project_router)
app.include_router(allocation_router)
app.include_router(leave_router)
