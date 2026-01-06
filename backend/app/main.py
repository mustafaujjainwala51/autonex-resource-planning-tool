from app.db.database import Base, engine
from app.models import project, allocation, leave
from fastapi import FastAPI
from app.api.projects import router as project_router
from app.api.allocations import router as allocation_router
from app.api.leaves import router as leave_router
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Autonex Resource Planning Tool")

app.include_router(project_router)
app.include_router(allocation_router)
app.include_router(leave_router)
