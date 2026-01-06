import type { Appointment, SyncOperation } from '../types/appointment';

const STORAGE_KEYS = {
  APPOINTMENTS: 'calendar_appointments',
  SYNC_QUEUE: 'calendar_sync_queue',
  INITIALIZED: 'calendar_initialized',
} as const;

/**
 * Save appointments to localStorage
 */
export function saveAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (error) {
    console.error('Failed to save appointments to storage:', error);
  }
}

/**
 * Load appointments from localStorage
 * Returns empty array if storage is empty or parsing fails
 */
export function loadAppointments(): Appointment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as Appointment[];
  } catch (error) {
    console.error('Failed to load appointments from storage:', error);
    return [];
  }
}

/**
 * Save sync operations queue to localStorage
 */
export function saveSyncQueue(operations: SyncOperation[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(operations));
  } catch (error) {
    console.error('Failed to save sync queue to storage:', error);
  }
}

/**
 * Load sync operations queue from localStorage
 * Returns operations sorted by timestamp (oldest first)
 */
export function loadSyncQueue(): SyncOperation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    if (!data) {
      return [];
    }
    const operations = JSON.parse(data) as SyncOperation[];
    // Sort by timestamp to process in order
    return operations.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('Failed to load sync queue from storage:', error);
    return [];
  }
}

/**
 * Check if the app has been initialized before
 */
export function isFirstRun(): boolean {
  return localStorage.getItem(STORAGE_KEYS.INITIALIZED) !== 'true';
}

/**
 * Mark the app as initialized (sample data has been created)
 */
export function markAsInitialized(): void {
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

/**
 * Clear all stored data (useful for testing/reset)
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
  localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
}
