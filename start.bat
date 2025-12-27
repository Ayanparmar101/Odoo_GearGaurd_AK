@echo off
echo Starting GearGuard Backend Server...
cd gearguard-backend
start "GearGuard Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Starting GearGuard Frontend...
cd ..\gearguard-frontend
start "GearGuard Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo GearGuard is starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows will open.
echo Wait for both servers to start, then open your browser.
echo.
pause
