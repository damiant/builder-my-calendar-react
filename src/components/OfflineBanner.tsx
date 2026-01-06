import { Alert, Flex } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import { useAppointmentStore } from '../store/appointmentStore';

export function OfflineBanner() {
  const { isOnline, getPendingCount } = useAppointmentStore();
  const pendingCount = getPendingCount();

  // Don't show if online
  if (isOnline) {
    return null;
  }

  const message = pendingCount > 0
    ? `You're offline • ${pendingCount} pending change${pendingCount > 1 ? 's' : ''}`
    : "You're offline";

  return (
    <div className="offline-banner" style={{ marginBottom: 16 }}>
      <Alert
        type="warning"
        icon={<WifiOutlined />}
        message={
          <Flex align="center" gap={8}>
            <span>{message}</span>
          </Flex>
        }
        description="Your changes will be saved locally and synced when you're back online."
        showIcon
        banner
      />
    </div>
  );
}
