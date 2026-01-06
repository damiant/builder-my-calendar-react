import { useAppointmentStore } from '../store/appointmentStore';

interface SyncStatus {
  isSyncing: boolean;
  pendingCount: number;
  isOnline: boolean;
  hasUnsyncedChanges: boolean;
}

/**
 * Hook to get sync status from the store
 * Provides a convenient interface for sync-related UI components
 */
export function useSyncStatus(): SyncStatus {
  const isSyncing = useAppointmentStore((state) => state.isSyncing);
  const isOnline = useAppointmentStore((state) => state.isOnline);
  const getPendingCount = useAppointmentStore((state) => state.getPendingCount);

  const pendingCount = getPendingCount();

  return {
    isSyncing,
    pendingCount,
    isOnline,
    hasUnsyncedChanges: pendingCount > 0,
  };
}
