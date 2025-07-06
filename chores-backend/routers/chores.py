# routers/chores.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/chores")
def get_chores():
    return [{"id": 1, "task": "Take out trash"}]