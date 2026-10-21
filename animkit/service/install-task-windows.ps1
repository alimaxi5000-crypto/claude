# Registers "animkit watch" as a Windows scheduled task that starts at log-on of the current
# user and restarts itself (start-watch.bat loops). Run once in PowerShell from this folder:
#   powershell -ExecutionPolicy Bypass -File .\install-task-windows.ps1
# Remove again:  Unregister-ScheduledTask -TaskName "animkit watch" -Confirm:$false
$bat = Join-Path (Split-Path $PSScriptRoot -Parent) 'start-watch.bat'
if (-not (Test-Path $bat)) { Write-Error "start-watch.bat not found next to $PSScriptRoot"; exit 1 }
$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument "/c `"$bat`"" -WorkingDirectory (Split-Path $bat -Parent)
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero)
Register-ScheduledTask -TaskName 'animkit watch' -Action $action -Trigger $trigger -Settings $settings -Description 'jj_animstudio converter (animkit watch)' -Force | Out-Null
Write-Host "Task 'animkit watch' registered. It starts at your next log-on; start it now with: Start-ScheduledTask -TaskName 'animkit watch'"
