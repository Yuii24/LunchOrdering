#!/bin/sh

set -e  # 當有錯誤就中斷腳本

echo "🧱 Running database migrations..."
npx sequelize-cli db:migrate || {
  echo "❌ Migration failed"
  exit 1
}

echo "🌱 Running seeders..."
npx sequelize-cli db:seed:all || {
  echo "❌ Seeder failed"
  exit 1
}

echo "🚀 Starting the server..."
exec node app.js
