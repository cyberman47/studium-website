@echo off
setlocal
cd /d "%~dp0"
set "GIT=C:\Users\marti\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
set "GH=C:\Program Files\GitHub CLI\gh.exe"
set "LOG=%~dp0github-upload-log.txt"

echo Publishing Studium website to GitHub...
echo Upload started. > "%LOG%"
"%GH%" auth setup-git >> "%LOG%" 2>&1
"%GIT%" init >> "%LOG%" 2>&1
"%GIT%" branch -M main >> "%LOG%" 2>&1
"%GIT%" add . >> "%LOG%" 2>&1
"%GIT%" commit -m "Initial Studium website" >> "%LOG%" 2>&1
"%GIT%" remote remove origin >> "%LOG%" 2>&1
"%GIT%" remote add origin https://github.com/cyberman47/studium-website.git >> "%LOG%" 2>&1
"%GIT%" push -u origin main >> "%LOG%" 2>&1

if errorlevel 1 (
  echo.
  echo The upload did not complete. Opening the error log now.
  notepad "%LOG%"
) else (
  echo.
  echo Success! Your website is now on GitHub.
)
pause
