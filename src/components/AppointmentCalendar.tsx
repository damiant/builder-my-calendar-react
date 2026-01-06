import { useCallback, useMemo } from 'react';
import { Calendar, Select, Flex, Button } from 'antd';
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
}

export function AppointmentCalendar({ onEditAppointment }: AppointmentCalendarProps) {
  const { getAppointmentsByDate, selectedDate, setSelectedDate, viewMode } = useAppointmentStore();

  const currentValue = useMemo(() => {
    return selectedDate ? dayjs(selectedDate) : dayjs();
  }, [selectedDate]);

  const handleSelect = useCallback(
    (date: Dayjs) => {
      setSelectedDate(date.format('YYYY-MM-DD'));
    },
    [setSelectedDate]
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

  // Custom cell renderer to show appointment indicators
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

      // Group by category
      const workAppointments = appointments.filter((a) => a.category === 'work');
      const homeAppointments = appointments.filter((a) => a.category === 'home');

      return (
        <Flex gap={2} justify="center" style={{ marginTop: 4 }}>
          {workAppointments.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`${workAppointments.length} work appointment(s) on ${dateStr}`}
              onClick={(e) => handleAppointmentClick(e, workAppointments[0])}
              onKeyDown={(e) => handleAppointmentKeyDown(e, workAppointments[0])}
              className={`appointment-dot ${workAppointments.some((a) => a.syncStatus === 'pending') ? 'appointment-dot--pending' : ''}`}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: CATEGORY_COLORS.work,
                cursor: 'pointer',
              }}
            />
          )}
          {homeAppointments.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              aria-label={`${homeAppointments.length} home appointment(s) on ${dateStr}`}
              onClick={(e) => handleAppointmentClick(e, homeAppointments[0])}
              onKeyDown={(e) => handleAppointmentKeyDown(e, homeAppointments[0])}
              className={`appointment-dot ${homeAppointments.some((a) => a.syncStatus === 'pending') ? 'appointment-dot--pending' : ''}`}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: CATEGORY_COLORS.home,
                cursor: 'pointer',
              }}
            />
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
