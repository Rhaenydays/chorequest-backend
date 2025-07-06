@echo off
echo 🚀 Starting React Native + FastAPI Environment...

:: Launch FastAPI from chores-backend
start "FastAPI" cmd /k "cd /d C:\Dev\chores-backend && uvicorn main:app --reload --port 8000"

:: Launch Expo from chores-frontend
start "Expo" cmd /k "cd /d C:\Dev\chores-frontend && npx expo start"

echo ✅ All services launched in visible terminals.
pause