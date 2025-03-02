require('dotenv').config(); // 讀取 .env 檔案

const config = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ordering',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.MYSQL_ROOT_PASSWORD || 'root',
    database: process.env.DB_NAME || 'ordering',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  }
};

module.exports = config;
