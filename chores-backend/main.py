from fastapi import FastAPI
from database import Base, engine
from models import task, room
from routers import rewards, users, home
from routers.auth import router as auth_router  # ✅ correct import

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router, tags=["Users"])
app.include_router(rewards.router, tags=["Rewards"])
app.include_router(home.router, tags=["Home"])
app.include_router(auth_router, tags=["Auth"])  # ✅ enable /login and /register

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chore Tracker API 👋"}