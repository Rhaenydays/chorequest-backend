from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.room import Room
from schemas.room import RoomCreate, RoomOut

router = APIRouter()

@router.post("/rooms", response_model=RoomOut)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    new_room = Room(**room.dict())
    db.add(new_room)
    db.commit()
    db.refresh(new_room)
    return new_room