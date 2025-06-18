#!/bin/bash

# 데이터베이스 설정 스크립트
# 이 스크립트는 환경에 따라 적절한 데이터베이스를 설정합니다.

echo "🔧 Setting up database environment..."

# 환경 변수 확인
if [ -f .env ]; then
    echo "✅ .env file found"
    source .env
else
    echo "❌ .env file not found. Please create one based on .env.example"
    exit 1
fi

# Replit 환경 감지
if [ ! -z "$REPLIT" ] || [ ! -z "$REPL_ID" ] || [ ! -z "$REPL_SLUG" ]; then
    echo "🔧 Detected Replit environment - using SQLite"
    echo "📁 SQLite database will be created at: ${DB_STORAGE:-./vietnam_visa.db}"
    
    # SQLite는 별도 설정이 필요 없음 - Sequelize가 자동으로 파일 생성
    echo "✅ SQLite setup complete"
    
elif [ "$DB_FORCE_SQLITE" = "true" ]; then
    echo "🔧 Force SQLite mode enabled - using SQLite"
    echo "📁 SQLite database will be created at: ${DB_STORAGE:-./vietnam_visa.db}"
    echo "✅ SQLite setup complete"
    
else
    echo "🔧 Local environment detected - setting up MySQL"
    
    # MySQL 서비스 상태 확인 (Windows)
    if command -v net &> /dev/null; then
        echo "🔍 Checking MySQL service status on Windows..."
        if net start | grep -i mysql > /dev/null; then
            echo "✅ MySQL service is running"
        else
            echo "⚠️  MySQL service is not running. Please start MySQL service:"
            echo "   - Open Services (services.msc)"
            echo "   - Find MySQL service and start it"
            echo "   - Or run: net start mysql"
        fi
    fi
    
    # MySQL이 설치되어 있는지 확인
    if command -v mysql &> /dev/null; then
        echo "✅ MySQL client found"
        
        # 데이터베이스 생성
        echo "🗄️  Creating MySQL database..."
        mysql -u${DB_USER:-root} -p${DB_PASSWORD} -h${DB_HOST:-localhost} -P${DB_PORT:-3306} < scripts/create-mysql-db.sql
        
        if [ $? -eq 0 ]; then
            echo "✅ MySQL database setup complete"
        else
            echo "❌ Failed to create MySQL database"
            echo "   Please check your MySQL credentials and ensure MySQL is running"
            echo "   You can manually run: mysql -u${DB_USER:-root} -p < scripts/create-mysql-db.sql"
        fi
    else
        echo "⚠️  MySQL client not found. Please install MySQL:"
        echo "   - Download from: https://dev.mysql.com/downloads/mysql/"
        echo "   - Or use XAMPP/WAMP for easy setup"
    fi
fi

echo ""
echo "🚀 Database setup complete! You can now start the server with:"
echo "   npm start"
