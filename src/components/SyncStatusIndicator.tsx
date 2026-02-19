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
            className="sync-button-style"
            aria-label={tooltipText}
          />
        </Badge>
      </Tooltip>
    </div>
  );
}
