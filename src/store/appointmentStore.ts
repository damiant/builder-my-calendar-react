import { create } from 'zustand';
import type { Appointment, CategoryFilter, CalendarViewMode } from '../types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  categoryFilter: CategoryFilter;
  viewMode: CalendarViewMode;
  selectedDate: string | null;

  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Omit<Appointment, 'id'>>) => void;
  deleteAppointment: (id: string) => void;
  setCategoryFilter: (filter: CategoryFilter) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setSelectedDate: (date: string | null) => void;

  // Selectors
  getFilteredAppointments: () => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
}

// Generate unique ID
const generateId = () => `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Sample appointments matching the screenshot
const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    title: 'Work Meeting',
    date: '2026-01-05',
    time: '10:00',
    category: 'work',
    description: 'Weekly team sync',
  },
  {
    id: 'apt-2',
    title: 'Dinner with friends',
    date: '2026-01-05',
    time: '19:00',
    category: 'home',
    description: 'At the Italian restaurant',
  },
  {
    id: 'apt-3',
    title: 'Gym Session',
    date: '2026-01-05',
    time: '07:00',
    category: 'home',
    description: 'Morning workout',
  },
  {
    id: 'apt-4',
    title: 'Project Deadline',
    date: '2026-01-05',
    time: '17:00',
    category: 'work',
    description: 'Submit Q1 report',
  },
  {
    id: 'apt-5',
    title: 'Doctor Appointment',
    date: '2026-01-15',
    time: '14:00',
    category: 'home',
    description: 'Annual checkup',
  },
  {
    id: 'apt-6',
    title: 'Client Presentation',
    date: '2026-01-20',
    time: '11:00',
    category: 'work',
    description: 'Q1 roadmap review',
  },
];

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: initialAppointments,
  categoryFilter: 'all',
  viewMode: 'month',
  selectedDate: null,

  addAppointment: (appointment) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: generateId(),
    };
    set((state) => ({
      appointments: [...state.appointments, newAppointment],
    }));
  },

  updateAppointment: (id, updates) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    }));
  },

  deleteAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.filter((apt) => apt.id !== id),
    }));
  },

  setCategoryFilter: (filter) => {
    set({ categoryFilter: filter });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },

  getFilteredAppointments: () => {
    const { appointments, categoryFilter } = get();
    if (categoryFilter === 'all') {
      return appointments;
    }
    return appointments.filter((apt) => apt.category === categoryFilter);
  },

  getAppointmentsByDate: (date) => {
    const { categoryFilter } = get();
    const appointments = get().appointments.filter((apt) => apt.date === date);
    if (categoryFilter === 'all') {
      return appointments;
    }
    return appointments.filter((apt) => apt.category === categoryFilter);
  },
}));
