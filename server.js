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
  dbConfig = {
    uri: process.env.MYSQL_URL,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
  };
  console.log('🔗 Using MYSQL_URL connection');
} else {
  dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zenith_db',
    port: parseInt(process.env.DB_PORT || '3306'),
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
  };
  console.log('🔍 Database config:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port,
    hasPassword: !!dbConfig.password
  });
}

const db = mysql.createPool({
  uri: process.env.MYSQL_URL,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables with graceful fallback
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
    return true;
  } catch (error) {
    console.error('❌ Database init failed:', error);
    return false;
  }
}

let dbConnected = false;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize database on startup with retry logic
async function initDBWithRetry(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await initDB();
      return;
    } catch (error) {
      console.log(`⚠️ Database init attempt ${i + 1} failed, retrying...`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

setTimeout(async () => {
  dbConnected = await initDB();
  if (!dbConnected) {
    console.log('⚠️ App running without database - using fallback data');
  } else {
    // Auto-populate experts if table is empty
    try {
      const [rows] = await db.execute('SELECT COUNT(*) as count FROM experts');
      if (rows[0].count === 0) {
        console.log('📝 Populating experts...');
        const experts = [
          { id: 'exp-001', name: 'Dr. Sarah Chen', title: 'Senior Business Strategist', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150', specialty: 'Strategic Planning & Growth', rating: '4.9', field: 'Business Consultation', bio: 'Former McKinsey partner with 15+ years helping Fortune 500 companies scale operations.', keyAreas: ['Strategic Planning', 'Market Analysis', 'Growth Strategy', 'Digital Transformation'] },
          { id: 'exp-002', name: 'Dr. Michael Rodriguez', title: 'Chief Medical Officer', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150', specialty: 'Preventive Medicine', rating: '4.8', field: 'Health Checkup', bio: 'Board-certified physician specializing in comprehensive health assessments and preventive care.', keyAreas: ['Preventive Care', 'Health Screening', 'Wellness Planning', 'Risk Assessment'] },
          { id: 'exp-003', name: 'Alex Thompson', title: 'Lead Solutions Architect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', specialty: 'Cloud Infrastructure', rating: '4.9', field: 'Technical Support', bio: 'AWS certified architect with expertise in scalable cloud solutions and system optimization.', keyAreas: ['Cloud Architecture', 'System Design', 'Performance Optimization', 'DevOps'] },
          { id: 'exp-004', name: 'Emma Wilson', title: 'Creative Director', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', specialty: 'UX/UI Design', rating: '4.7', field: 'Design Review', bio: 'Award-winning designer with 12+ years creating user-centered digital experiences.', keyAreas: ['User Experience', 'Interface Design', 'Design Systems', 'Prototyping'] },
          { id: 'exp-005', name: 'James Parker', title: 'Senior Legal Counsel', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', specialty: 'Corporate Law', rating: '4.8', field: 'Legal Advice', bio: 'Corporate attorney with extensive experience in business law, contracts, and compliance.', keyAreas: ['Contract Law', 'Corporate Governance', 'Compliance', 'Risk Management'] }
        ];
        
        for (const expert of experts) {
          await db.execute(
            'INSERT INTO experts (id, name, title, avatar, specialty, rating, field, bio, key_areas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [expert.id, expert.name, expert.title, expert.avatar, expert.specialty, expert.rating, expert.field, expert.bio, JSON.stringify(expert.keyAreas)]
          );
        }
        console.log('✅ Experts populated!');
      }
    } catch (error) {
      console.error('Error populating experts:', error);
    }
  }
}, 2000);

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

// Get experts by field with fallback
app.get('/api/experts/:field', async (req, res) => {
  const fallbackExperts = [
    {
      id: 'exp-001',
      name: 'Dr. Sarah Chen',
      title: 'Senior Business Strategist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150',
      specialty: 'Strategic Planning & Growth',
      rating: '4.9',
      field: 'Business Consultation',
      bio: 'Former McKinsey partner with 15+ years helping Fortune 500 companies scale operations.',
      keyAreas: ['Strategic Planning', 'Market Analysis', 'Growth Strategy', 'Digital Transformation']
    },
    {
      id: 'exp-002',
      name: 'Dr. Michael Rodriguez',
      title: 'Chief Medical Officer',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150',
      specialty: 'Preventive Medicine',
      rating: '4.8',
      field: 'Health Checkup',
      bio: 'Board-certified physician specializing in comprehensive health assessments and preventive care.',
      keyAreas: ['Preventive Care', 'Health Screening', 'Wellness Planning', 'Risk Assessment']
    },
    {
      id: 'exp-003',
      name: 'Alex Thompson',
      title: 'Lead Solutions Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      specialty: 'Cloud Infrastructure',
      rating: '4.9',
      field: 'Technical Support',
      bio: 'AWS certified architect with expertise in scalable cloud solutions and system optimization.',
      keyAreas: ['Cloud Architecture', 'System Design', 'Performance Optimization', 'DevOps']
    },
    {
      id: 'exp-004',
      name: 'Emma Wilson',
      title: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      specialty: 'UX/UI Design',
      rating: '4.7',
      field: 'Design Review',
      bio: 'Award-winning designer with 12+ years creating user-centered digital experiences.',
      keyAreas: ['User Experience', 'Interface Design', 'Design Systems', 'Prototyping']
    },
    {
      id: 'exp-005',
      name: 'James Parker',
      title: 'Senior Legal Counsel',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      specialty: 'Corporate Law',
      rating: '4.8',
      field: 'Legal Advice',
      bio: 'Corporate attorney with extensive experience in business law, contracts, and compliance.',
      keyAreas: ['Contract Law', 'Corporate Governance', 'Compliance', 'Risk Management']
    }
  ];

  try {
    const { field } = req.params;
    if (dbConnected) {
      const [rows] = await db.execute('SELECT * FROM experts WHERE field = ?', [field]);
      const experts = rows.map(expert => {
        let keyAreas = [];
        try {
          keyAreas = JSON.parse(expert.key_areas || '[]');
        } catch (e) {
          keyAreas = [];
        }
        return {
          ...expert,
          keyAreas
        };
      });
      res.json(experts);
    } else {
      const experts = fallbackExperts.filter(expert => expert.field === field);
      res.json(experts);
    }
  } catch (error) {
    console.error('Error fetching experts:', error);
    const experts = fallbackExperts.filter(expert => expert.field === req.params.field);
    res.json(experts);
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
