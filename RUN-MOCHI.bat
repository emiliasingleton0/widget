@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing Mochi dependencies...
  call npm.cmd install
)
call npm.cmd start
pause
