from pydantic import BaseModel
from typing import Optional, List

class RewardCreate(BaseModel):
    reward: str
    points_required: int
    redeemed: bool = False

class RewardOut(RewardCreate):
    id: int
    class Config:
        orm_mode = True

class RewardUpdate(BaseModel):
    reward: Optional[str]
    points_required: Optional[int]
    redeemed: Optional[bool]

class UserCreate(BaseModel):
    username: str
    email: str
    avatar_url: Optional[str] = None
    points: int = 0

class UserOut(UserCreate):
    id: int
    class Config:
        orm_mode = True