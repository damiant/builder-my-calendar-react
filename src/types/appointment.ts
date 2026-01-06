export type AppointmentCategory = 'work' | 'home';

export type SyncStatus = 'synced' | 'pending';

export type OperationType = 'create' | 'update' | 'delete';

export interface SyncOperation {
  id: string;
  operationType: OperationType;
  appointmentId: string;
  data?: Omit<Appointment, 'id'>;
  timestamp: number;
  retryCount: number;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format
  category: AppointmentCategory;
  description?: string;
  isAllDay: boolean;
  syncStatus: SyncStatus;
  updatedAt: string; // ISO timestamp
}

export type CategoryFilter = AppointmentCategory | 'all';

export type CalendarViewMode = 'month' | 'year' | 'planner';

export interface AppointmentFormValues {
  title: string;
  date: string;
  time?: string;
  category: AppointmentCategory;
  description?: string;
  isAllDay: boolean;
}

// Category color configuration
export const CATEGORY_COLORS: Record<AppointmentCategory, string> = {
  work: '#ff4d4f', // Red
  home: '#1677ff', // Blue
};

export const CATEGORY_LABELS: Record<AppointmentCategory, string> = {
  work: 'Work',
  home: 'Home',
};
