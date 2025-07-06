import os
import shutil

# Paths
source = "C:/Dev/chores-frontend"
destination = "C:/Dev/chores-backend"

# Files and folders that are definitely backend-related
backend_items = [
    "main.py",
    "models.py",
    "database.db",
    "test.db",
    "requirements.txt",  # if it exists
    "__pycache__",
    ".env",  # if you're using environment variables
    "schemas.py",
    "database.py",
    "routers",  # assuming you have a routers/ folder
]

# Create destination if it doesn't exist
os.makedirs(destination, exist_ok=True)

for item in backend_items:
    src_path = os.path.join(source, item)
    dest_path = os.path.join(destination, item)

    if os.path.exists(src_path):
        try:
            shutil.move(src_path, dest_path)
            print(f"✅ Moved {item} to backend.")
        except Exception as e:
            print(f"❌ Failed to move {item}: {e}")
    else:
        print(f"⚠️  Skipped {item} (not found).")

print("🚀 Backend migration complete!")