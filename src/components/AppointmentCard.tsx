import { useCallback } from 'react';
import { Card, Flex, Button, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Appointment } from '../types/appointment';
import { CATEGORY_COLORS } from '../types/appointment';

const { Text, Title } = Typography;

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
}

export function AppointmentCard({ appointment, onEdit }: AppointmentCardProps) {
  const handleClick = useCallback(() => {
    onEdit(appointment);
  }, [appointment, onEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEdit(appointment);
      }
    },
    [appointment, onEdit]
  );

  const handleReschedule = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onEdit(appointment);
    },
    [appointment, onEdit]
  );

  // Format display values
  const dayOfWeek = dayjs(appointment.date).format('dddd');
  const displayDate = dayjs(appointment.date).format('MMM D, YYYY');
  const displayTime = appointment.isAllDay
    ? 'All Day'
    : appointment.time
      ? dayjs(appointment.time, 'HH:mm').format('h:mm A')
      : 'All Day';

  const categoryColor = CATEGORY_COLORS[appointment.category];
  const isPending = appointment.syncStatus === 'pending';

  return (
    <Card
      className={`appointment-card ${isPending ? 'appointment-card--pending' : ''}`}
      hoverable
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${appointment.title} on ${displayDate} at ${displayTime}`}
      style={{
        borderLeft: `4px solid ${categoryColor}`,
        opacity: isPending ? 0.85 : 1,
      }}
    >
      <Flex vertical gap={8}>
        {/* Day and Time */}
        <Flex justify="space-between" align="center">
          <Text type="secondary" style={{ fontSize: 13 }}>
            {dayOfWeek}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--ant-color-text)',
            }}
          >
            {displayTime}
          </Text>
        </Flex>

        {/* Title */}
        <Title level={5} style={{ margin: 0, fontSize: 16 }}>
          {appointment.title}
        </Title>

        {/* Notes */}
        <Text
          type="secondary"
          style={{
            fontSize: 13,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {appointment.description || 'No notes'}
        </Text>

        {/* Footer with category dot and reschedule button */}
        <Flex justify="space-between" align="center" style={{ marginTop: 4 }}>
          <Flex align="center" gap={6}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: categoryColor,
              }}
            />
            <Text type="secondary" style={{ fontSize: 12, textTransform: 'capitalize' }}>
              {appointment.category}
            </Text>
            {isPending && (
              <Text type="warning" style={{ fontSize: 11 }}>
                • Pending sync
              </Text>
            )}
          </Flex>

          <Button
            type="link"
            size="small"
            icon={<CalendarOutlined />}
            onClick={handleReschedule}
            style={{ padding: 0, height: 'auto' }}
          >
            Reschedule
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
