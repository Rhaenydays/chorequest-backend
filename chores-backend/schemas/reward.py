from pydantic import BaseModel

# 🧾 Base shared fields
class RewardBase(BaseModel):
    title: str
    points: int

# ✍️ Schema for creating a new reward
class RewardCreate(RewardBase):
    pass

# ✏️ Schema for updating an existing reward (fields optional)
class RewardUpdate(BaseModel):
    title: str | None = None
    points: int | None = None

# 📤 Schema for returning reward data to the client
class RewardOut(RewardBase):
    id: int

    class Config:
        orm_mode = True  # ← this lets Pydantic understand SQLAlchemy models