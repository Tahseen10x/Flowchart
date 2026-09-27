@echo off
echo Starting TreeFlow Studio...
start http://localhost:5173
python -m http.server 5173
pause
