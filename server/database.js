
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const connectDB = async () => {
  try {
    const dbPath = path.join(__dirname, 'vietnam_visa.db');
    
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ SQLite Connection Error:', err);
        throw err;
      }
      console.log('✅ Connected to SQLite database');
    });

    // Create tables if they don't exist
    await createTables();
    
    return db;
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    throw error;
  }
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS visa_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        visa_type VARCHAR(50) NOT NULL,
        purpose VARCHAR(100),
        duration INTEGER,
        entry_date DATE,
        passport_number VARCHAR(50),
        nationality VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
    ];

    let completed = 0;
    queries.forEach((query, index) => {
      db.run(query, (err) => {
        if (err) {
          console.error(`Error creating table ${index}:`, err);
          reject(err);
        } else {
          completed++;
          if (completed === queries.length) {
            console.log('✅ Database tables created successfully');
            resolve();
          }
        }
      });
    });
  });
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

module.exports = {
  connectDB,
  getDB
};
