import { useMemo } from 'react';
import { Flex } from 'antd';
import { useAppointmentStore } from '../store/appointmentStore';
import { CATEGORY_COLORS } from '../types/appointment';

export function AppointmentLegend() {
  const { getFilteredAppointments, selectedDate } = useAppointmentStore();

  // Get unique appointments for the legend - prioritize selected date, then show samples
  const legendItems = useMemo(() => {
    const appointments = getFilteredAppointments();

    // Get unique appointments by title, limit to 4 for display
    const uniqueByTitle = appointments.reduce((acc, apt) => {
      if (!acc.find((a) => a.title === apt.title)) {
        acc.push(apt);
      }
      return acc;
    }, [] as typeof appointments);

    // Sort by selected date first, then by date
    const sorted = uniqueByTitle.sort((a, b) => {
      if (selectedDate) {
        if (a.date === selectedDate && b.date !== selectedDate) return -1;
        if (b.date === selectedDate && a.date !== selectedDate) return 1;
      }
      return a.date.localeCompare(b.date);
    });

    return sorted.slice(0, 4);
  }, [getFilteredAppointments, selectedDate]);

  if (legendItems.length === 0) {
    return null;
  }

  return (
    <Flex
      gap={24}
      wrap="wrap"
      justify="center"
      style={{
        padding: '12px 16px',
        backgroundColor: '#fafafa',
        borderRadius: 6,
        marginTop: -1,
        borderTop: '1px solid #f0f0f0',
      }}
    >
      {legendItems.map((item) => (
        <Flex key={item.id} gap={6} align="center">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: CATEGORY_COLORS[item.category],
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, color: '#374151' }}>
            {item.title}
          </span>
        </Flex>
      ))}
    </Flex>
  );
}
