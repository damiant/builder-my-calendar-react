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
      className={`appointment-card card-category-border ${isPending ? 'appointment-card--pending card-pending-opacity' : ''}`}
      hoverable
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${appointment.title} on ${displayDate} at ${displayTime}`}
      style={{
        borderLeftColor: categoryColor,
      }}
    >
      <Flex vertical gap={8}>
        {/* Day and Time */}
        <Flex justify="space-between" align="center">
          <Text type="secondary" className="card-day-text">
            {dayOfWeek}
          </Text>
          <Text className="card-time-text">
            {displayTime}
          </Text>
        </Flex>

        {/* Title */}
        <Title level={5} className="card-title">
          {appointment.title}
        </Title>

        {/* Notes */}
        <Text
          type="secondary"
          className="card-description-ellipsis"
        >
          {appointment.description || 'No notes'}
        </Text>

        {/* Footer with category dot and reschedule button */}
        <Flex justify="space-between" align="center" className="card-footer-spacing">
          <Flex align="center" gap={6}>
            <span
              className="category-dot"
              style={{
                backgroundColor: categoryColor,
              }}
            />
            <Text type="secondary" className="card-category-text text-capitalize">
              {appointment.category}
            </Text>
            {isPending && (
              <Text type="warning" className="card-pending-text">
                • Pending sync
              </Text>
            )}
          </Flex>

          <Button
            type="link"
            size="small"
            icon={<CalendarOutlined />}
            onClick={handleReschedule}
            className="button-reschedule"
          >
            Reschedule
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
