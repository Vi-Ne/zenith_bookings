import db from '../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { booking, userEmail } = req.body;
    
    await db.execute(
      'INSERT INTO bookings (id, user_email, expert_id, type, date, slot, notes, reminder_type, ai_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        booking.bookingId,
        userEmail,
        booking.expert?.id,
        booking.type,
        booking.date,
        booking.slot,
        booking.notes,
        booking.reminderType,
        booking.aiImageUrl
      ]
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
}