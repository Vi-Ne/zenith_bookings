import db from './db.ts';
import { User, Expert, Booking } from './types';

export const saveUser = async (name: string, email: string): Promise<void> => {
  await db.execute('INSERT INTO users (name, email) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = ?', [name, email, name]);
};

export const saveBooking = async (booking: Booking, userEmail: string): Promise<void> => {
  await db.execute(
    'INSERT INTO bookings (id, user_email, expert_id, type, date, slot, notes, reminder_type, ai_image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [booking.bookingId, userEmail, booking.expert?.id, booking.type, booking.date, booking.slot, booking.notes, booking.reminderType, booking.aiImageUrl]
  );
};

export const getUserBookings = async (email: string): Promise<any[]> => {
  const [rows] = await db.execute('SELECT * FROM bookings WHERE user_email = ?', [email]);
  return rows as any[];
};