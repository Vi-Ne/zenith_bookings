import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  // In production, Railway provides env vars directly
  console.log('🚀 Production mode - using Railway env vars');
} else {
  dotenv.config({ path: '.env.local' });
  dotenv.config();
}

console.log('🔍 Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  MYSQL_URL: process.env.MYSQL_URL ? 'present' : 'missing'
});

// Use MYSQL_URL if available (Railway's preferred method)
let dbConfig;
if (process.env.MYSQL_URL) {
  dbConfig = process.env.MYSQL_URL;
  console.log('🔗 Using MYSQL_URL connection');
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zenith_db',
    port: parseInt(process.env.DB_PORT || '3306')
  };
  console.log('🔍 Database config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    hasPassword: !!dbConfig.password
  });
}

const db = mysql.createPool(dbConfig);

// Initialize database tables
async function initDB() {
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    await db.execute(`CREATE TABLE IF NOT EXISTS experts (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255),
      avatar TEXT,
      specialty VARCHAR(255),
      rating DECIMAL(3,2),
      field VARCHAR(255),
      bio TEXT,
      key_areas JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    await db.execute(`CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(255) PRIMARY KEY,
      user_email VARCHAR(255) NOT NULL,
      expert_id VARCHAR(255),
      type VARCHAR(255),
      date VARCHAR(255),
      slot VARCHAR(255),
      notes TEXT,
      reminder_type VARCHAR(255),
      ai_image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database init failed:', error);
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize database on startup
setTimeout(() => {
  initDB();
}, 2000); // Wait 2 seconds for DB to be ready

// Save user endpoint
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    await db.execute(
      'INSERT INTO users (name, email) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?',
      [name, email, name]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// Save booking endpoint
app.post('/api/bookings', async (req, res) => {
  try {
    const { booking, userEmail } = req.body;
    await db.execute(
      'INSERT INTO bookings (id, user_email, expert_id, type, date, slot, notes, reminder_type, ai_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        booking.bookingId,
        userEmail,
        booking.expert?.id || null,
        booking.type,
        booking.date,
        booking.slot,
        booking.notes || null,
        booking.reminderType || 'Email Only',
        booking.aiImageUrl || null
      ]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// Get experts by field
app.get('/api/experts/:field', async (req, res) => {
  try {
    const { field } = req.params;
    const [rows] = await db.execute('SELECT * FROM experts WHERE field = ?', [field]);
    const experts = rows.map(expert => ({
      ...expert,
      keyAreas: JSON.parse(expert.key_areas || '[]')
    }));
    res.json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({ error: 'Failed to fetch experts' });
  }
});

// Add new expert
app.post('/api/experts', async (req, res) => {
  try {
    const { id, name, title, avatar, specialty, rating, field, bio, keyAreas } = req.body;
    await db.execute(
      'INSERT INTO experts (id, name, title, avatar, specialty, rating, field, bio, key_areas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, title, avatar, specialty, rating, field, bio, JSON.stringify(keyAreas)]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding expert:', error);
    res.status(500).json({ error: 'Failed to add expert' });
  }
});

// Serve React app for all other routes
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});