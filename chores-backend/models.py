from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

user_rewards = Table(
    "user_rewards", Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id")),
    Column("reward_id", Integer, ForeignKey("rewards.id"))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    avatar_url = Column(String, nullable=True)
    points = Column(Integer, default=0)
    rewards = relationship("Reward", secondary=user_rewards, back_populates="users")

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(Integer, primary_key=True, index=True)
    reward = Column(String)
    points_required = Column(Integer)
    redeemed = Column(Boolean, default=False)
    users = relationship("User", secondary=user_rewards, back_populates="rewards")