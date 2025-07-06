from fastapi import FastAPI, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from models import Reward, User
from database import SessionLocal, engine, Base
from pydantic import BaseModel
from typing import List, Optional

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RewardCreate(BaseModel):
    reward: str
    points_required: int
    redeemed: bool = False

class RewardUpdate(BaseModel):
    reward: Optional[str] = None
    points_required: Optional[int] = None
    redeemed: Optional[bool] = None

class RewardOut(RewardCreate):
    id: int

    class Config:
        orm_mode = True

@app.get("/rewards", response_model=List[RewardOut])
def read_rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()

@app.post("/rewards", response_model=RewardOut)
def create_reward(reward: RewardCreate, db: Session = Depends(get_db)):
    db_reward = Reward(**reward.dict())
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward

@app.patch("/rewards/{reward_id}", response_model=RewardOut)
def update_reward(
    reward_id: int = Path(..., description="The ID of the reward to update"),
    reward: RewardUpdate = None,
    db: Session = Depends(get_db)
):
    db_reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not db_reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    update_data = reward.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_reward, key, value)
    db.commit()
    db.refresh(db_reward)
    return db_reward

class UserCreate(BaseModel):
    username: str
    email: str
    avatar_url: Optional[str] = None
    points: int = 0

class UserOut(UserCreate):
    id: int

    class Config:
        orm_mode = True

@app.get("/users", response_model=List[UserOut])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/users/{user_id}/redeem/{reward_id}")
def redeem_reward(user_id: int, reward_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if not user or not reward:
        raise HTTPException(status_code=404, detail="User or Reward not found")
    if reward in user.rewards:
        raise HTTPException(status_code=400, detail="Reward already redeemed by user")
    if user.points < reward.points_required:
        raise HTTPException(status_code=400, detail="Not enough points")
    user.points -= reward.points_required
    user.rewards.append(reward)
    db.commit()
    return {"message": "Reward redeemed!"}
