from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    points = Column(Integer, nullable=False, default=1)
    room_id = Column(Integer, ForeignKey("rooms.id"))

    room = relationship("Room")