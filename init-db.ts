import db from './db.js';

export async function initializeDatabase() {
  try {
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_email) REFERENCES users(email),
        FOREIGN KEY (expert_id) REFERENCES experts(id)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}