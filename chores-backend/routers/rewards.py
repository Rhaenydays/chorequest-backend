from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.reward import Reward            # ✅ Direct import from models.reward
from schemas.reward import RewardCreate, RewardOut, RewardUpdate  # ✅ Schema contract

router = APIRouter(prefix="/rewards", tags=["Rewards"])

# ---------------------------------------------------------
# 🏆 Read All Rewards
# Returns a list of all rewards stored in the database.
# ---------------------------------------------------------
@router.get("/", response_model=List[RewardOut])
def read_rewards(db: Session = Depends(get_db)):
    return db.query(Reward).all()

# ---------------------------------------------------------
# 🆕 Create a New Reward
# Accepts a RewardCreate payload and returns the created reward.
# ---------------------------------------------------------
@router.post("/", response_model=RewardOut)
def create_reward(reward: RewardCreate, db: Session = Depends(get_db)):
    db_reward = Reward(**reward.dict())
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward

# ---------------------------------------------------------
# ✏️ Update an Existing Reward
# Partially updates a reward by ID using PATCH semantics.
# ---------------------------------------------------------
@router.patch("/{reward_id}", response_model=RewardOut)
def update_reward(reward_id: int, reward: RewardUpdate, db: Session = Depends(get_db)):
    db_reward = db.query(Reward).filter(Reward.id == reward_id).first()

    if not db_reward:
        raise HTTPException(status_code=404, detail="Reward not found")

    for key, value in reward.dict(exclude_unset=True).items():
        setattr(db_reward, key, value)

    db.commit()
    db.refresh(db_reward)
    return db_reward