import { Tooltip, Badge, Button } from 'antd';
import { SyncOutlined, CloudOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useSyncStatus } from '../hooks/useSyncStatus';

export function SyncStatusIndicator() {
  const { isSyncing, pendingCount, hasUnsyncedChanges } = useSyncStatus();

  // Determine icon and tooltip content
  let icon: React.ReactNode;
  let tooltipText: string;

  if (isSyncing) {
    icon = <SyncOutlined className="sync-icon-spinning" />;
    tooltipText = 'Syncing changes...';
  } else if (hasUnsyncedChanges) {
    icon = <CloudUploadOutlined />;
    tooltipText = `${pendingCount} change${pendingCount > 1 ? 's' : ''} waiting to sync`;
  } else {
    icon = <CloudOutlined />;
    tooltipText = 'All changes synced';
  }

  return (
    <div className="sync-status-indicator">
      <Tooltip title={tooltipText} placement="left">
        <Badge
          count={hasUnsyncedChanges && !isSyncing ? pendingCount : 0}
          size="small"
          offset={[-4, 4]}
        >
          <Button
            type="text"
            shape="circle"
            icon={icon}
            size="large"
            style={{
              backgroundColor: 'var(--ant-color-bg-container)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              border: '1px solid var(--ant-color-border)',
            }}
            aria-label={tooltipText}
          />
        </Badge>
      </Tooltip>
    </div>
  );
}
