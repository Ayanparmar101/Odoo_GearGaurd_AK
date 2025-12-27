@echo off
echo ========================================
echo GearGuard - Automated Setup Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd gearguard-backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend dependency installation failed!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/4] Installing Frontend Dependencies...
cd ..\gearguard-frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo [3/4] Seeding Database with Demo Data...
cd ..\gearguard-backend
call npm run db:seed
if errorlevel 1 (
    echo ERROR: Database seeding failed!
    echo Make sure PostgreSQL is running and database 'gearguard' exists
    pause
    exit /b 1
)
echo ✓ Database seeded successfully
echo.

echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Open two terminal windows
echo 2. In terminal 1: cd gearguard-backend ^&^& npm run dev
echo 3. In terminal 2: cd gearguard-frontend ^&^& npm run dev
echo 4. Open browser to http://localhost:3000
echo.
echo Demo accounts are ready to use!
echo.
pause
