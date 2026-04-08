@echo off
setlocal

set "APP=%~dp0index.html"

if not exist "%APP%" (
  echo index.html not found next to this script.
  pause
  exit /b 1
)

start "" "%APP%"
