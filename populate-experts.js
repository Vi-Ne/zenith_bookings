import mysql from 'mysql2/promise';

const experts = [
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

async function populateExperts() {
  try {
    const db = mysql.createPool({
      uri: process.env.MYSQL_URL,
      waitForConnections: true,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: false }
    });
    
    for (const expert of experts) {
      await db.execute(
        'INSERT INTO experts (id, name, title, avatar, specialty, rating, field, bio, key_areas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
        [
          expert.id,
          expert.name,
          expert.title,
          expert.avatar,
          expert.specialty,
          expert.rating,
          expert.field,
          expert.bio,
          JSON.stringify(expert.keyAreas)
        ]
      );
    }
    
    console.log('✅ Experts populated successfully!');
    await db.end();
  } catch (error) {
    console.error('❌ Error populating experts:', error);
  }
}

populateExperts();