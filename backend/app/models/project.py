from sqlalchemy import Column, Integer, String, Date, Float, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func

from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(Text, nullable=False)
    client = Column(Text, nullable=False)
    project_type = Column(Text, nullable=False)

    total_tasks = Column(Integer, nullable=False)
    estimated_time_per_task = Column(Float, nullable=False)

    required_expertise = Column(ARRAY(Text), nullable=True)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    daily_target = Column(Integer, default=0)
    project_duration_weeks = Column(Integer, nullable=True)
    project_duration_days = Column(Integer, nullable=True)

    allocated_employees = Column(Integer, default=0)

    priority = Column(Text, default="medium")
    project_status = Column(Text, default="active")

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()
    )
