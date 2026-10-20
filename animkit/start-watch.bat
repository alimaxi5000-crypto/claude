@echo off
rem Starts the jj_animstudio converter (animkit watch) and restarts it if it stops.
rem Paths come from animkit.config.json next to this file (see README) or from the arguments:
rem   start-watch.bat --studio "C:\...\resources\[jj]\jj_animstudio" --stream "C:\...\resources\[jj]\jj_animstudio_stream"
title animkit watch (jj_animstudio)
cd /d "%~dp0"
:loop
node cli\animkit.mjs watch %*
echo animkit watch stopped (exit %errorlevel%). Restart in 5 seconds, close this window to stop.
timeout /t 5 /nobreak >nul
goto loop
