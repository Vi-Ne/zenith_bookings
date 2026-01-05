
export enum Step {
  LOGIN = 'LOGIN',
  EXPERT_SELECTION = 'EXPERT_SELECTION',
  DASHBOARD = 'DASHBOARD',
  ANALYTICS = 'ANALYTICS',
  CONFIRMATION = 'CONFIRMATION'
}

export enum AppointmentType {
  CONSULTATION = 'Business Consultation',
  MEDICAL = 'Health Checkup',
  TECH = 'Technical Support',
  DESIGN = 'Design Review',
  LEGAL = 'Legal Advice'
}

export enum ReminderType {
  EMAIL = 'Email Only',
  SMS = 'SMS & Email',
  NONE = 'No Reminders'
}

export interface User {
  name: string;
  email: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialty: string;
  rating: string;
  field: AppointmentType; // Linked to the service type
  bio: string;
  keyAreas: string[];
}

export interface Booking {
  type: AppointmentType;
  expert?: Expert;
  date: string;
  slot: string;
  bookingId: string;
  notes?: string;
  reminderType?: ReminderType;
  aiImageUrl?: string;
}

export interface AppState {
  step: Step;
  user: User | null;
  booking: Booking | null;
}
