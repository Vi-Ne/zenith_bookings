import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zenith_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

async function setupDatabase() {
  try {
    const db = mysql.createPool(dbConfig);

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create experts table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS experts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        avatar TEXT,
        specialty VARCHAR(255) NOT NULL,
        rating VARCHAR(10) NOT NULL,
        field ENUM('Business Consultation', 'Health Checkup', 'Technical Support', 'Design Review', 'Legal Advice') NOT NULL,
        bio TEXT,
        key_areas JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        expert_id VARCHAR(255),
        type ENUM('Business Consultation', 'Health Checkup', 'Technical Support', 'Design Review', 'Legal Advice') NOT NULL,
        date DATE NOT NULL,
        slot VARCHAR(50) NOT NULL,
        notes TEXT,
        reminder_type ENUM('Email Only', 'SMS & Email', 'No Reminders') DEFAULT 'Email Only',
        ai_image_url TEXT,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully!');
    await db.end();
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
  }
}

setupDatabase();