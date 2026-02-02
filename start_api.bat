@echo off
echo ============================================================
echo      DEMARRAGE API NER - MultiCoNER v2
echo ============================================================
echo.
echo Demarrage de l'API FastAPI sur http://localhost:8000
echo.
echo Documentation disponible sur: http://localhost:8000/docs
echo Interface web disponible sur: file:///C:/Users/hp/OneDrive/Bureau/NLP/ner-multiconer/web/index.html
echo.
echo Appuyez sur CTRL+C pour arreter l'API
echo.
echo ============================================================
echo.

cd /d "%~dp0"
.venv\Scripts\python.exe -m uvicorn src.api:app --reload --port 8000
