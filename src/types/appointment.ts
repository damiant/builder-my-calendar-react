export type AppointmentCategory = 'work' | 'home';

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format
  category: AppointmentCategory;
  description?: string;
}

export type CategoryFilter = AppointmentCategory | 'all';

export type CalendarViewMode = 'month' | 'year' | 'planner';

export interface AppointmentFormValues {
  title: string;
  date: string;
  time?: string;
  category: AppointmentCategory;
  description?: string;
}

// Category color configuration
export const CATEGORY_COLORS: Record<AppointmentCategory, string> = {
  work: '#1677ff', // Blue
  home: '#fa541c', // Orange
};

export const CATEGORY_LABELS: Record<AppointmentCategory, string> = {
  work: 'Work',
  home: 'Home',
};
