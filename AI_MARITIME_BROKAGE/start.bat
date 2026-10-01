@echo off
echo ====================================================
echo Starting Agentic Maritime Brokerage Platform
echo ====================================================
echo.

echo [1/2] Starting Backend (FastAPI on Port 8000)...
start "Maritime Backend" cmd /c "cd backend && .\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

:: Wait 3 seconds to ensure backend has a head start
ping 127.0.0.1 -n 4 >nul

echo [2/2] Starting Frontend (React/Vite on Port 5173)...
start "Maritime Frontend" cmd /c "cd frontend && npm run dev"

echo.
echo Both servers have been launched in background windows!
echo - Frontend is running at: http://localhost:5173
echo - Backend API is running at: http://127.0.0.1:8000
echo.
echo You can close this window now. The servers will continue running in the newly opened windows.
pause

