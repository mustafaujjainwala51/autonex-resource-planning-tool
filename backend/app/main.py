from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ← ADD THIS
from app.api.projects import router as project_router

app = FastAPI(title="Autonex Resource Planning API")

# ← ADD CORS (BEFORE ROUTER)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(project_router)

@app.get("/")
def root():
    return {"message": "Autonex API", "status": "running"}