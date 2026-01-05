import { useCallback, useMemo } from 'react';
import { Calendar, Select, Flex, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAppointmentStore } from '../store/appointmentStore';
import { CATEGORY_COLORS } from '../types/appointment';

interface CellRenderInfo {
  type: 'date' | 'month';
  originNode: React.ReactNode;
}

export function AppointmentCalendar() {
  const { getAppointmentsByDate, selectedDate, setSelectedDate, viewMode } = useAppointmentStore();

  const currentValue = useMemo(() => {
    return selectedDate ? dayjs(selectedDate) : dayjs();
  }, [selectedDate]);

  const handleSelect = useCallback((date: Dayjs) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
  }, [setSelectedDate]);

  const handlePanelChange = useCallback((date: Dayjs) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
  }, [setSelectedDate]);

  // Custom cell renderer to show appointment indicators
  const cellRender = useCallback((date: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type !== 'date') {
      return info.originNode;
    }

    const dateStr = date.format('YYYY-MM-DD');
    const appointments = getAppointmentsByDate(dateStr);

    if (appointments.length === 0) {
      return null;
    }

    // Group by category and show dots
    const workCount = appointments.filter((a) => a.category === 'work').length;
    const homeCount = appointments.filter((a) => a.category === 'home').length;

    return (
      <Flex gap={2} justify="center" style={{ marginTop: 4 }}>
        {workCount > 0 && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: CATEGORY_COLORS.work,
            }}
          />
        )}
        {homeCount > 0 && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: CATEGORY_COLORS.home,
            }}
          />
        )}
      </Flex>
    );
  }, [getAppointmentsByDate]);

  // Custom header renderer
  const headerRender = useCallback(({ value, onChange }: { 
    value: Dayjs; 
    onChange: (date: Dayjs) => void;
  }) => {
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
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={handlePrevMonth}
            size="small"
          />
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={handleNextMonth}
            size="small"
          />
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
  }, []);

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
