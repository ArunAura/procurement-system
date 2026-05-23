const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use promise wrapper for async/await support
const promisePool = pool.promise();

console.log(`MySQL connection pool initialized for host: ${process.env.DB_HOST || 'localhost'}, db: ${process.env.DB_NAME || 'hospital_db'}`);

module.exports = promisePool;
