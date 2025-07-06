# init_db.py
from database import Base, engine
from models import task, room  # make sure all models are imported

# Create all tables
Base.metadata.create_all(bind=engine)
print("✅ Tables created.")