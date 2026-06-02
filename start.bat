@echo off
setlocal

echo === Lancement Docker ===
cd /d "%~dp0"
docker compose -f "%~dp0docker-compose.yml" up -d
if errorlevel 1 goto :error_docker

echo === Installation des dependances ===
echo API...
cd /d "%~dp0api"
call bun install
if errorlevel 1 goto :error

echo Dashboard...
cd /d "%~dp0dashboard"
call npm install
if errorlevel 1 goto :error

echo Mobile...
cd /d "%~dp0mobile"
call npm install
if errorlevel 1 goto :error

echo.
echo === Lancement du projet ===
start "API" cmd /k "cd /d ""%~dp0api"" && bun run dev"
start "Dashboard" cmd /k "cd /d ""%~dp0dashboard"" && npm run dev"
start "Mobile" cmd /k "cd /d ""%~dp0mobile"" && npm run start"

echo Les 3 services sont lances dans des fenetres separees.
goto :eof

:error
echo Une erreur est survenue pendant l'installation.
exit /b 1

:error_docker
echo Une erreur est survenue pendant le lancement Docker.
echo Verifie que Docker Desktop est demarre, puis relance start.bat.
exit /b 1
