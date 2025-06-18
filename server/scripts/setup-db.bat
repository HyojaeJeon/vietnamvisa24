@echo off
REM 데이터베이스 설정 스크립트 (Windows용)
REM 이 스크립트는 환경에 따라 적절한 데이터베이스를 설정합니다.

echo 🔧 Setting up database environment...

REM .env 파일 확인
if not exist .env (
    echo ❌ .env file not found. Please create one based on .env.example
    pause
    exit /b 1
)

echo ✅ .env file found

REM 환경 변수 로드 (간단한 방법)
for /f "delims== tokens=1,2" %%a in (.env) do (
    if not "%%a"=="" if not "%%a:~0,1%"=="#" (
        set "%%a=%%b"
    )
)

REM Replit 환경 감지
if defined REPLIT (
    echo 🔧 Detected Replit environment - using SQLite
    echo 📁 SQLite database will be created automatically
    echo ✅ SQLite setup complete
    goto :end
)

if defined REPL_ID (
    echo 🔧 Detected Replit environment - using SQLite
    echo 📁 SQLite database will be created automatically
    echo ✅ SQLite setup complete
    goto :end
)

if "%DB_FORCE_SQLITE%"=="true" (
    echo 🔧 Force SQLite mode enabled - using SQLite
    echo 📁 SQLite database will be created automatically
    echo ✅ SQLite setup complete
    goto :end
)

echo 🔧 Local environment detected - setting up MySQL

REM MySQL 서비스 상태 확인
echo 🔍 Checking MySQL service status...
sc query mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL service found
    sc query mysql | find "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo ✅ MySQL service is running
    ) else (
        echo ⚠️  MySQL service is not running. Starting MySQL...
        net start mysql
        if %errorlevel% neq 0 (
            echo ❌ Failed to start MySQL service
            echo    Please start MySQL manually or check your installation
        )
    )
) else (
    echo ⚠️  MySQL service not found. Please install MySQL:
    echo    - Download from: https://dev.mysql.com/downloads/mysql/
    echo    - Or use XAMPP/WAMP for easy setup
)

REM MySQL 클라이언트 확인
where mysql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MySQL client found
    
    REM 데이터베이스 생성
    echo 🗄️  Creating MySQL database...
    if "%DB_PASSWORD%"=="" (
        mysql -u%DB_USER% -h%DB_HOST% -P%DB_PORT% < scripts\create-mysql-db.sql
    ) else (
        mysql -u%DB_USER% -p%DB_PASSWORD% -h%DB_HOST% -P%DB_PORT% < scripts\create-mysql-db.sql
    )
    
    if %errorlevel% equ 0 (
        echo ✅ MySQL database setup complete
    ) else (
        echo ❌ Failed to create MySQL database
        echo    Please check your MySQL credentials and ensure MySQL is running
        echo    You can manually run the SQL script in scripts\create-mysql-db.sql
    )
) else (
    echo ⚠️  MySQL client not found in PATH
    echo    Please ensure MySQL is installed and added to PATH
)

:end
echo.
echo 🚀 Database setup complete! You can now start the server with:
echo    npm start
pause
