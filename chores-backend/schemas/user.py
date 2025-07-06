from pydantic import BaseModel

# Fields shared by all user schemas
class UserBase(BaseModel):
    username: str

# For user creation (includes password)
class UserCreate(UserBase):
    password: str

# For returning user data from the API
class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True