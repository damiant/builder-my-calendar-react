import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type {
  Appointment,
  CategoryFilter,
  CalendarViewMode,
  SyncOperation,
  SyncStatus,
} from '../types/appointment';
import {
  saveAppointments,
  loadAppointments,
  saveSyncQueue,
  loadSyncQueue,
  isFirstRun,
  markAsInitialized,
} from '../services/storage';

interface AppointmentState {
  appointments: Appointment[];
  categoryFilter: CategoryFilter;
  viewMode: CalendarViewMode;
  selectedDate: string | null;
  isLoading: boolean;
  isOnline: boolean;
  syncOperations: SyncOperation[];
  isSyncing: boolean;

  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'syncStatus' | 'updatedAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Omit<Appointment, 'id'>>) => void;
  deleteAppointment: (id: string) => void;
  setCategoryFilter: (filter: CategoryFilter) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setSelectedDate: (date: string | null) => void;
  setIsOnline: (online: boolean) => void;
  loadFromStorage: () => void;
  processSyncQueue: () => Promise<void>;

  // Selectors
  getFilteredAppointments: () => Appointment[];
  getAppointmentsByDate: (date: string) => Appointment[];
  getPendingCount: () => number;
}

// Generate unique ID
const generateId = () => `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Generate unique operation ID
const generateOperationId = () => `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Sample appointments for first run
const createInitialAppointments = (): Appointment[] => {
  const now = new Date().toISOString();
  return [
    {
      id: 'apt-1',
      title: 'Work Meeting',
      date: '2026-01-05',
      time: '10:00',
      category: 'work',
      description: 'Weekly team sync',
      isAllDay: false,
      syncStatus: 'synced',
      updatedAt: now,
    },
    {
      id: 'apt-2',
      title: 'Dinner with friends',
      date: '2026-01-05',
      time: '19:00',
      category: 'home',
      description: 'At the Italian restaurant',
      isAllDay: false,
      syncStatus: 'synced',
      updatedAt: now,
    },
    {
      id: 'apt-3',
      title: 'Gym Session',
      date: '2026-01-05',
      time: '07:00',
      category: 'home',
      description: 'Morning workout',
      isAllDay: false,
      syncStatus: 'synced',
      updatedAt: now,
    },
    {
      id: 'apt-4',
      title: 'Project Deadline',
      date: '2026-01-05',
      time: '17:00',
      category: 'work',
      description: 'Submit Q1 report',
      isAllDay: false,
      syncStatus: 'synced',
      updatedAt: now,
    },
    {
      id: 'apt-5',
      title: 'Doctor Appointment',
      date: '2026-01-15',
      time: '14:00',
      category: 'home',
      description: 'Annual checkup',
      isAllDay: false,
      syncStatus: 'synced',
      updatedAt: now,
    },
    {
      id: 'apt-6',
      title: 'Client Presentation',
      date: '2026-01-20',
      time: '11:00',
      category: 'work',
      description: 'Q1 roadmap review',
      isAllDay: false,
      syncStatus: 'synced',
      updatedAt: now,
    },
  ];
};

// Helper to determine sync status based on online state
const getSyncStatus = (isOnline: boolean): SyncStatus => (isOnline ? 'synced' : 'pending');

export const useAppointmentStore = create<AppointmentState>()(
  subscribeWithSelector((set, get) => ({
    appointments: [],
    categoryFilter: 'all',
    viewMode: 'planner',
    selectedDate: null,
    isLoading: true,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    syncOperations: [],
    isSyncing: false,

    loadFromStorage: () => {
      set({ isLoading: true });

      try {
        if (isFirstRun()) {
          // First run: create sample appointments
          const initialAppointments = createInitialAppointments();
          saveAppointments(initialAppointments);
          markAsInitialized();
          set({ appointments: initialAppointments, isLoading: false });
        } else {
          // Load existing appointments
          const appointments = loadAppointments();
          const syncOperations = loadSyncQueue();
          set({ appointments, syncOperations, isLoading: false });
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
        set({ appointments: [], isLoading: false });
      }
    },

    addAppointment: (appointment) => {
      const { isOnline } = get();
      const now = new Date().toISOString();
      const syncStatus = getSyncStatus(isOnline);

      const newAppointment: Appointment = {
        ...appointment,
        id: generateId(),
        syncStatus,
        updatedAt: now,
      };

      // Queue operation
      const operation: SyncOperation = {
        id: generateOperationId(),
        operationType: 'create',
        appointmentId: newAppointment.id,
        data: appointment as Omit<Appointment, 'id'>,
        timestamp: Date.now(),
        retryCount: 0,
      };

      set((state) => {
        const newAppointments = [...state.appointments, newAppointment];
        const newOperations = [...state.syncOperations, operation];

        // Persist to storage
        saveAppointments(newAppointments);
        saveSyncQueue(newOperations);

        return {
          appointments: newAppointments,
          syncOperations: newOperations,
        };
      });

      // If online, try to sync immediately
      if (isOnline) {
        get().processSyncQueue();
      }
    },

    updateAppointment: (id, updates) => {
      const { isOnline } = get();
      const now = new Date().toISOString();
      const syncStatus = getSyncStatus(isOnline);

      // Queue operation
      const operation: SyncOperation = {
        id: generateOperationId(),
        operationType: 'update',
        appointmentId: id,
        data: updates as Omit<Appointment, 'id'>,
        timestamp: Date.now(),
        retryCount: 0,
      };

      set((state) => {
        const newAppointments = state.appointments.map((apt) =>
          apt.id === id ? { ...apt, ...updates, syncStatus, updatedAt: now } : apt
        );
        const newOperations = [...state.syncOperations, operation];

        // Persist to storage
        saveAppointments(newAppointments);
        saveSyncQueue(newOperations);

        return {
          appointments: newAppointments,
          syncOperations: newOperations,
        };
      });

      // If online, try to sync immediately
      if (isOnline) {
        get().processSyncQueue();
      }
    },

    deleteAppointment: (id) => {
      const { isOnline } = get();

      // Queue operation
      const operation: SyncOperation = {
        id: generateOperationId(),
        operationType: 'delete',
        appointmentId: id,
        timestamp: Date.now(),
        retryCount: 0,
      };

      set((state) => {
        const newAppointments = state.appointments.filter((apt) => apt.id !== id);
        const newOperations = [...state.syncOperations, operation];

        // Persist to storage
        saveAppointments(newAppointments);
        saveSyncQueue(newOperations);

        return {
          appointments: newAppointments,
          syncOperations: newOperations,
        };
      });

      // If online, try to sync immediately
      if (isOnline) {
        get().processSyncQueue();
      }
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

    setIsOnline: (online) => {
      set({ isOnline: online });

      // If coming back online, process pending operations
      if (online) {
        get().processSyncQueue();
      }
    },

    processSyncQueue: async () => {
      const { syncOperations, isSyncing, isOnline } = get();

      // Don't process if offline, already syncing, or no operations
      if (!isOnline || isSyncing || syncOperations.length === 0) {
        return;
      }

      set({ isSyncing: true });

      try {
        // Process operations in order
        const remainingOperations: SyncOperation[] = [];

        for (const operation of syncOperations) {
          try {
            // Simulate sync operation (in real app, this would be an API call)
            // For now, we just mark it as successful immediately
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Update appointment sync status to synced
            if (operation.operationType !== 'delete') {
              set((state) => ({
                appointments: state.appointments.map((apt) =>
                  apt.id === operation.appointmentId ? { ...apt, syncStatus: 'synced' as SyncStatus } : apt
                ),
              }));
            }

            // Operation succeeded, don't add to remaining
          } catch (error) {
            console.error('Sync operation failed:', error);
            // Add failed operation back to queue with incremented retry count
            remainingOperations.push({
              ...operation,
              retryCount: operation.retryCount + 1,
            });
          }
        }

        // Update sync queue
        set({ syncOperations: remainingOperations });
        saveSyncQueue(remainingOperations);

        // Persist updated appointments (with synced status)
        const { appointments } = get();
        saveAppointments(appointments);
      } finally {
        set({ isSyncing: false });
      }
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

    getPendingCount: () => {
      return get().syncOperations.length;
    },
  }))
);
