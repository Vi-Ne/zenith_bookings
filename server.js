import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zenith_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

const db = mysql.createPool(dbConfig);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});