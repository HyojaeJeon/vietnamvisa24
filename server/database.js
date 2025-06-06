
const mysql = require('mysql2/promise');

let connection = null;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vietnam_visa',
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ MySQL Connected Successfully');
    
    // Create tables if they don't exist
    await createTables();
    
    return connection;
  } catch (error) {
    console.error('❌ MySQL Connection Error:', error);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Visa applications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visa_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        visa_type VARCHAR(100) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        passport_number VARCHAR(100) NOT NULL,
        nationality VARCHAR(100) NOT NULL,
        birth_date DATE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        arrival_date DATE NOT NULL,
        departure_date DATE NOT NULL,
        purpose VARCHAR(500),
        status ENUM('pending', 'processing', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
};

const getDB = () => {
  if (!connection) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return connection;
};

module.exports = {
  connectDB,
  getDB
};
