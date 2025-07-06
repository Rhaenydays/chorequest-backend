from pydantic import BaseModel
from .room import RoomOut

class TaskBase(BaseModel):
    title: str
    points: int
    room_id: int

class TaskCreate(TaskBase):
    pass

class TaskOut(TaskBase):
    id: int
    room: RoomOut  # <- include full room info

    class Config:
        orm_mode = True