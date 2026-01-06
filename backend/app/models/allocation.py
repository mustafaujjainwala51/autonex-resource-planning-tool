from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from app.db.database import Base

class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    weekly_hours_allocated = Column(Float)
    weekly_tasks_allocated = Column(Integer)
    productivity_override = Column(Float, default=1.0)
    effective_week = Column(Date)
