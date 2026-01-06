import { useCallback, useMemo } from 'react';
import { Empty, Spin, Flex } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useAppointmentStore } from '../store/appointmentStore';
import { AppointmentCard } from './AppointmentCard';
import type { Appointment } from '../types/appointment';

interface PlannerViewProps {
  onEditAppointment: (appointment: Appointment) => void;
}

export function PlannerView({ onEditAppointment }: PlannerViewProps) {
  const { getFilteredAppointments, isLoading } = useAppointmentStore();

  // Get filtered and sorted appointments
  const appointments = useMemo(() => {
    const filtered = getFilteredAppointments();
    // Sort by date, then by time
    return filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      // All-day events first, then by time
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;
      return (a.time || '').localeCompare(b.time || '');
    });
  }, [getFilteredAppointments]);

  const handleEdit = useCallback(
    (appointment: Appointment) => {
      onEditAppointment(appointment);
    },
    [onEditAppointment]
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (appointments.length === 0) {
    return (
      <Empty
        image={<CalendarOutlined style={{ fontSize: 64, color: 'var(--ant-color-text-quaternary)' }} />}
        description={
          <Flex vertical align="center" gap={4}>
            <span style={{ fontSize: 16, color: 'var(--ant-color-text-secondary)' }}>
              No appointments yet
            </span>
            <span style={{ fontSize: 14, color: 'var(--ant-color-text-tertiary)' }}>
              Click "New Appointment" to create your first appointment
            </span>
          </Flex>
        }
        style={{ padding: '48px 24px' }}
      />
    );
  }

  return (
    <div className="planner-view">
      <div className="planner-grid">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
