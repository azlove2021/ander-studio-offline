@echo off
REM Ander Biology Studio - Offline Mirror launcher
cd /d "%~dp0"

set PORT=8080
if not "%~1"=="" set PORT=%~1

echo.
echo   Ander Biology Studio - Offline Mirror
echo   ------------------------------------
echo   Models   : http://127.0.0.1:%PORT%/models.html
echo   Bank     : http://127.0.0.1:%PORT%/question-bank.html
echo   Login    : any email + a password of 6+ chars
echo   Stop     : Ctrl+C
echo.

start "" "http://127.0.0.1:%PORT%/models.html"
python server.py %PORT%
pause
