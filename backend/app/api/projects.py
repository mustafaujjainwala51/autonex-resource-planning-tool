from fastapi import APIRouter
from typing import List

from app.schemas.project import Project, ProjectCreate
from app.services.project_service import create_project, list_projects

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post("/", response_model=Project)
def create_project_api(project: ProjectCreate):
    return create_project(project)


@router.get("/", response_model=List[Project])
def list_projects_api():
    return list_projects()

