from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from models.task import Task              # ✅ Correct direct import from models/task.py
from database import get_db
from schemas.task import TaskOut  # ✅ actual defined schema

router = APIRouter()

@router.get("/tasks", response_model=List[TaskOut])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()