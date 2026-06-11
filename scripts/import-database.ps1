# Import legacy saraswat_db into WAMP MySQL
# Usage: npm run db:import
# Prerequisite: WAMP MySQL service must be running (green icon in WAMP tray)

$ErrorActionPreference = "Stop"

# Auto-detect WAMP MySQL (version folder may differ)
$mysqlExe = $null
$wampMysqlRoot = "C:\wamp\bin\mysql"
if (Test-Path $wampMysqlRoot) {
    $candidate = Get-ChildItem $wampMysqlRoot -Directory |
        ForEach-Object { Join-Path $_.FullName "bin\mysql.exe" } |
        Where-Object { Test-Path $_ } |
        Select-Object -First 1
    if ($candidate) { $mysqlExe = $candidate }
}
if (-not $mysqlExe) {
    $mysqlExe = "C:\wamp\bin\mysql\mysql5.6.12\bin\mysql.exe"
}

# SQL dump lives in the legacy backup folder (two levels up from scripts/)
$sqlFile = Join-Path $PSScriptRoot "..\..\backup-6.3.2026_23-25-52_saraswat\mysql\saraswat_db.sql"
$sqlFile = (Resolve-Path $sqlFile -ErrorAction SilentlyContinue).Path

if (-not (Test-Path $mysqlExe)) {
    Write-Host "MySQL not found. Start WAMP, then import from MySQL console:"
    Write-Host '  CREATE DATABASE saraswat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'
    Write-Host '  USE saraswat_db;'
    Write-Host '  SOURCE path/to/backup-.../mysql/saraswat_db.sql;'
    exit 1
}

if (-not $sqlFile -or -not (Test-Path $sqlFile)) {
    Write-Host "SQL dump not found. Expected:"
    Write-Host "  backup-6.3.2026_23-25-52_saraswat\backup-6.3.2026_23-25-52_saraswat\mysql\saraswat_db.sql"
    exit 1
}

Write-Host "Creating database saraswat_db..."
& $mysqlExe -u root -e "CREATE DATABASE IF NOT EXISTS saraswat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

Write-Host "Importing $sqlFile ..."
Get-Content $sqlFile | & $mysqlExe -u root saraswat_db

Write-Host "Done. Run: npm run db:generate"
