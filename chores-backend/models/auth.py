from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from models import User
from schemas import UserCreate, UserLogin
from database import SessionLocal

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
def register(user: UserCreate):
    db = SessionLocal()
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_pw = pwd_context.hash(user.password)
    new_user = User(username=user.username, password_hash=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": "User registered"}

@router.post("/login")
def login(user: UserLogin):
    db = SessionLocal()
    existing_user = db.query(User).filter(User.username == user.username).first()
    if not existing_user or not pwd_context.verify(user.password, existing_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": existing_user.id}