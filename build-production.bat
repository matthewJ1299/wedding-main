@echo off
REM Wedding Application Production Build Script for cPanel Deployment (Windows)
REM This script prepares both frontend and backend for production deployment

echo 🚀 Starting production build for cPanel deployment...

REM Check if we're in the right directory
if not exist "Wedding" (
    echo ❌ Please run this script from the project root directory
    exit /b 1
)

REM Create deployment directories
echo 📁 Creating deployment directories...
if not exist "deployment" mkdir deployment
if not exist "deployment\frontend" mkdir deployment\frontend
if not exist "deployment\backend" mkdir deployment\backend

REM Build Frontend
echo 🔨 Building frontend for production...
cd Wedding\frontend

REM Install dependencies if needed
if not exist "node_modules" (
    echo ⚠️  Installing frontend dependencies...
    npm install
)

REM Build with production environment variables
echo ✅ Building frontend with production URLs...
set GENERATE_SOURCEMAP=false
set REACT_APP_API_URL=https://api.matthewandsydney.co.za
set REACT_APP_SITE_URL=https://matthewandsydney.co.za
npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    exit /b 1
)

echo ✅ Frontend build completed successfully

REM Copy frontend build files
echo 📦 Copying frontend build files...
xcopy /E /I build ..\..\deployment\frontend\
copy .htaccess ..\..\deployment\frontend\

cd ..\..

REM Prepare Backend (Next.js must be built locally; .next is required on the server)
echo 🔨 Preparing backend for production...
rd /s /q deployment\backend 2>nul
mkdir deployment\backend

cd Wedding\backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

echo Building backend ^(Next.js production^)...
call npm run build

if %errorlevel% neq 0 (
    echo Backend build failed
    exit /b 1
)

echo Backend build completed successfully

echo 📦 Copying backend files to deployment\backend...
xcopy /E /I /H /Y . ..\..\deployment\backend\

cd ..\..\deployment\backend

REM Drop node_modules from the deployment copy only; reinstall on the server: npm ci --omit=dev
if exist "node_modules" rmdir /S /Q "node_modules"
if exist "build" rmdir /S /Q "build"

REM Copy environment file
if exist "env.production.txt" (
    copy env.production.txt .env
    echo ✅ Environment file copied to .env
) else (
    echo ⚠️  No env.production.txt found, you'll need to create .env manually
)

cd ..\..

REM Create deployment package
echo 📦 Creating deployment package...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%-%HH%%Min%%Sec%"

powershell Compress-Archive -Path "deployment\*" -DestinationPath "wedding-deployment-%timestamp%.zip"

echo ✅ Deployment package created: wedding-deployment-%timestamp%.zip

echo.
echo 🎉 Production build completed successfully!
echo.
echo 📋 Next steps:
echo 1. Upload the contents of 'deployment\frontend\' to your frontend domain's public_html
echo 2. Upload the contents of 'deployment\backend\' to your backend domain's public_html
echo    ^(must include the .next folder from the local build^)
echo 3. On the server: cd to the app folder, run: npm ci --omit=dev   ^(or npm install --omit=dev^)
echo 4. Set up Node.js application in cPanel for the backend (Node.js 22.5+)
echo 5. Configure environment variables in the backend .env file
echo 6. Test the deployment using the URLs:
echo    - Frontend: https://matthewandsydney.co.za
echo    - Backend: https://api.matthewandsydney.co.za/health
echo.
echo Backend notes:
echo    - PostgreSQL via DATABASE_URL and npm package pg
echo    - Run npm run migrate on the server after deploy
echo    - Requires Node.js 22.5 or newer on the server
echo.
echo See CPANEL_DEPLOYMENT.md for detailed deployment instructions

pause
