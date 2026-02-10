@echo off
echo Démarrage du projet NER...

echo.
echo 1. Démarrage de l'API...
start cmd /k "cd /d %~dp0 && python -m uvicorn src.api:app --reload --port 8000"

timeout /t 3

echo.
echo 2. Démarrage du frontend React...
start cmd /k "cd /d %~dp0\web-react && npm run dev"

echo.
echo URLs:
echo - API: http://localhost:8000
echo - Frontend: http://localhost:5173
echo - Documentation API: http://localhost:8000/docs