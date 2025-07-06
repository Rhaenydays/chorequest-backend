from sqlalchemy import Column, Integer, String
from database import Base

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    points = Column(Integer, nullable=False)