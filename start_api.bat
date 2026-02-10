@echo off
echo ============================================================
echo      DEMARRAGE API NER - Named Entity Recognition
echo ============================================================
echo.
echo Demarrage de l'API FastAPI sur http://localhost:8000
echo.
echo Documentation disponible sur: http://localhost:8000/docs
echo Interface web disponible sur: http://localhost:5173
echo.
echo Appuyez sur CTRL+C pour arreter l'API
echo.
echo ============================================================
echo.

cd /d "%~dp0"
python -m uvicorn src.api:app --reload --port 8000
