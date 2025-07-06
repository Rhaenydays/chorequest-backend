from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Association table
user_rewards = Table(
    'user_rewards',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('reward_id', Integer, ForeignKey('rewards.id'), primary_key=True)
)

class Reward(Base):
    __tablename__ = 'rewards'

    id = Column(Integer, primary_key=True, index=True)
    reward = Column(String, nullable=False)
    points_required = Column(Integer, nullable=False)
    redeemed = Column(Boolean, default=False)
    users = relationship("User", secondary=user_rewards, back_populates="rewards")

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    points = Column(Integer, default=0)
    rewards = relationship("Reward", secondary=user_rewards, back_populates="users")
