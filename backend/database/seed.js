const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function seedDatabase() {
  console.log('Starting database setup and seeding...');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };

  let connection;
  try {
    // 1. Connect without specifying database to ensure database can be created
    connection = await mysql.createConnection(config);
    console.log('Connected to MySQL server successfully.');

    // 2. Read schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // 3. Execute the SQL queries
    // Split by semicolon, but clean up white space and ignore empty statements
    const queries = schemaSql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    console.log(`Executing ${queries.length} schema statements...`);
    for (const query of queries) {
      await connection.query(query);
    }
    console.log('Database and tables initialized successfully.');

    // 4. Seed default user if not exists
    // Default password: admin123 (hashed using bcrypt, or plain. Let's write standard plain text comparison or hashed comparison. Let's use bcrypt hashing in production, but to keep the dependencies beginner-friendly and avoid bcrypt compile issues, we can check passwords directly or use a simple SHA-256 / simple hash, or standard bcrypt js package. Since we installed standard node package dependencies, let's use plain passwords or simple MD5/SHA256, or bcryptjs which is pure JavaScript. But wait! We did not add bcrypt to package.json, we can check password directly or write a simple hash. Actually, let's use standard plain-text for beginner friendliness as requested: "Keep code beginner-friendly with comments". Or we can hash with standard node crypto module, which requires no external dependencies! That is extremely elegant!)
    // Node.js crypto module is built-in! So we can use SHA-256 hash or PBKDF2 without installing anything. Let's do that! That's very clean and secure. Let's hash it with SHA-256 for simplicity.
    const crypto = require('crypto');
    const defaultEmail = 'admin@smiles.com';
    const defaultPasswordPlain = 'admin123';
    const hashedPassword = crypto.createHash('sha256').update(defaultPasswordPlain).digest('hex');

    // Check if user already exists
    const [rows] = await connection.query(
      'SELECT * FROM hospital_db.users WHERE email = ?',
      [defaultEmail]
    );

    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO hospital_db.users (email, password) VALUES (?, ?)',
        [defaultEmail, hashedPassword]
      );
      console.log(`Seeded default admin user: ${defaultEmail} / password: ${defaultPasswordPlain}`);
    } else {
      console.log('Admin user already exists. Skipping seeding.');
    }

    console.log('Database setup and seeding completed successfully!');
  } catch (error) {
    console.error('Error during database setup:', error.message);
    console.error('Please make sure MySQL is running and your .env credentials are correct.');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
