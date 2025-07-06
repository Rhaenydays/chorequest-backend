from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.reward import Reward
from schemas.user import UserCreate, UserOut  # ✅ Direct import from the correct file
from typing import List

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/users/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/users/{user_id}/redeem/{reward_id}")
def redeem_reward(user_id: int, reward_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not user or not reward:
        raise HTTPException(status_code=404, detail="User or Reward not found")
    if reward in user.rewards:
        raise HTTPException(status_code=400, detail="Reward already redeemed")
    if user.points < reward.points_required:
        raise HTTPException(status_code=400, detail="Not enough points")
    user.points -= reward.points_required
    user.rewards.append(reward)
    db.commit()
    return {"message": "Reward redeemed!"}