@echo off
title CampusLink ZIP Packager
echo =================================================================
echo   Packaging CampusLink into campuslink.zip
echo =================================================================
echo.
set "DEST=%USERPROFILE%\Downloads\campuslink.zip"
echo Target: %DEST%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%~dp0*' -DestinationPath '%USERPROFILE%\Downloads\campuslink.zip' -Force"

echo.
echo [SUCCESS] campuslink.zip is ready in your Downloads folder!
echo.
explorer.exe /select,"%USERPROFILE%\Downloads\campuslink.zip"
pause
