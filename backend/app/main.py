from fastapi import FastAPI
from app.api.projects import router as project_router

app = FastAPI(title="Autonex Resource Planning API")

app.include_router(project_router)
