import { useCallback, useMemo } from 'react';
import { Calendar, Select, Flex, Button, Typography } from 'antd';

const { Text } = Typography;
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppointmentStore } from '../store/appointmentStore';
import { CATEGORY_COLORS, type Appointment } from '../types/appointment';

interface CellRenderInfo {
  type: string;
  originNode: React.ReactNode;
}

interface AppointmentCalendarProps {
  onEditAppointment: (appointment: Appointment) => void;
  onNewAppointment: () => void;
}

export function AppointmentCalendar({ onEditAppointment, onNewAppointment }: AppointmentCalendarProps) {
  const { getAppointmentsByDate, selectedDate, setSelectedDate, viewMode } = useAppointmentStore();

  const currentValue = useMemo(() => {
    return selectedDate ? dayjs(selectedDate) : dayjs();
  }, [selectedDate]);

  const handleSelect = useCallback(
    (date: Dayjs) => {
      const dateStr = date.format('YYYY-MM-DD');
      // If clicking the already-selected date, open new appointment dialog
      if (selectedDate === dateStr) {
        onNewAppointment();
      } else {
        setSelectedDate(dateStr);
      }
    },
    [selectedDate, setSelectedDate, onNewAppointment]
  );

  const handlePanelChange = useCallback(
    (date: Dayjs) => {
      setSelectedDate(date.format('YYYY-MM-DD'));
    },
    [setSelectedDate]
  );

  // Handle clicking on an appointment dot
  const handleAppointmentClick = useCallback(
    (e: React.MouseEvent, appointment: Appointment) => {
      e.stopPropagation();
      onEditAppointment(appointment);
    },
    [onEditAppointment]
  );

  // Handle keyboard interaction on appointment dot
  const handleAppointmentKeyDown = useCallback(
    (e: React.KeyboardEvent, appointment: Appointment) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        onEditAppointment(appointment);
      }
    },
    [onEditAppointment]
  );

  // Custom cell renderer to show appointment indicators with titles
  const cellRender = useCallback(
    (date: Dayjs, info: CellRenderInfo): React.ReactNode => {
      if (info.type !== 'date') {
        return info.originNode;
      }

      const dateStr = date.format('YYYY-MM-DD');
      const appointments = getAppointmentsByDate(dateStr);

      if (appointments.length === 0) {
        return null;
      }

      // Sort appointments: all-day first, then by time
      const sortedAppointments = [...appointments].sort((a, b) => {
        if (a.isAllDay && !b.isAllDay) return -1;
        if (!a.isAllDay && b.isAllDay) return 1;
        return (a.time || '').localeCompare(b.time || '');
      });

      // Limit to 3 appointments to fit in the cell
      const visibleAppointments = sortedAppointments.slice(0, 3);
      const remainingCount = sortedAppointments.length - visibleAppointments.length;

      return (
        <Flex vertical gap={2} className="appointment-list" style={{ marginTop: 2 }}>
          {visibleAppointments.map((appointment) => (
            <Flex
              key={appointment.id}
              role="button"
              tabIndex={0}
              aria-label={`${appointment.title} - ${appointment.category}`}
              onClick={(e) => handleAppointmentClick(e, appointment)}
              onKeyDown={(e) => handleAppointmentKeyDown(e, appointment)}
              className={`appointment-item ${appointment.syncStatus === 'pending' ? 'appointment-item--pending' : ''}`}
              align="center"
              gap={4}
              style={{
                cursor: 'pointer',
                padding: '1px 4px',
                borderRadius: 3,
                backgroundColor: `${CATEGORY_COLORS[appointment.category]}15`,
                overflow: 'hidden',
              }}
            >
              <span
                className="appointment-dot"
                style={{
                  width: 6,
                  height: 6,
                  minWidth: 6,
                  borderRadius: '50%',
                  backgroundColor: CATEGORY_COLORS[appointment.category],
                }}
              />
              <Text
                ellipsis
                style={{
                  fontSize: 11,
                  lineHeight: '14px',
                  color: 'var(--ant-color-text)',
                }}
              >
                {appointment.title}
              </Text>
            </Flex>
          ))}
          {remainingCount > 0 && (
            <Text
              type="secondary"
              style={{ fontSize: 10, textAlign: 'center', cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                handleAppointmentClick(e as unknown as React.MouseEvent, sortedAppointments[3]);
              }}
            >
              +{remainingCount} more
            </Text>
          )}
        </Flex>
      );
    },
    [getAppointmentsByDate, handleAppointmentClick, handleAppointmentKeyDown]
  );

  // Custom header renderer
  const headerRender = useCallback(
    ({ value, onChange }: { value: Dayjs; onChange: (date: Dayjs) => void }) => {
      const year = value.year();
      const month = value.month();

      // Generate year options (5 years before and after current)
      const yearOptions = [];
      for (let i = year - 5; i <= year + 5; i++) {
        yearOptions.push({ value: i, label: i.toString() });
      }

      // Generate month options
      const monthOptions = [];
      for (let i = 0; i < 12; i++) {
        monthOptions.push({
          value: i,
          label: dayjs().month(i).format('MMM'),
        });
      }

      const handlePrevMonth = () => {
        onChange(value.subtract(1, 'month'));
      };

      const handleNextMonth = () => {
        onChange(value.add(1, 'month'));
      };

      const handleYearChange = (newYear: number) => {
        onChange(value.year(newYear));
      };

      const handleMonthChange = (newMonth: number) => {
        onChange(value.month(newMonth));
      };

      return (
        <Flex justify="space-between" align="center" style={{ padding: '8px 0', marginBottom: 8 }}>
          <Flex gap={4} align="center">
            <Button type="text" icon={<LeftOutlined />} onClick={handlePrevMonth} size="small" />
            <Button type="text" icon={<RightOutlined />} onClick={handleNextMonth} size="small" />
          </Flex>

          <Flex gap={8} align="center">
            <Select
              value={year}
              onChange={handleYearChange}
              options={yearOptions}
              style={{ width: 80 }}
              variant="outlined"
              size="small"
            />
            <Select
              value={month}
              onChange={handleMonthChange}
              options={monthOptions}
              style={{ width: 80 }}
              variant="outlined"
              size="small"
            />
          </Flex>
        </Flex>
      );
    },
    []
  );

  return (
    <div className="appointment-calendar">
      <Calendar
        value={currentValue}
        onSelect={handleSelect}
        onPanelChange={handlePanelChange}
        cellRender={cellRender}
        headerRender={headerRender}
        mode={viewMode === 'year' ? 'year' : 'month'}
        fullscreen={true}
      />
    </div>
  );
}
