import { useMemo } from 'react';
import { Flex } from 'antd';
import { useAppointmentStore } from '../store/appointmentStore';
import { CATEGORY_COLORS } from '../types/appointment';

export function AppointmentLegend() {
  const { getFilteredAppointments } = useAppointmentStore();

  // Get unique appointments for the legend (sample of recent ones)
  const legendItems = useMemo(() => {
    const appointments = getFilteredAppointments();
    
    // Get unique appointments by title, limit to 4 for display
    const uniqueByTitle = appointments.reduce((acc, apt) => {
      if (!acc.find((a) => a.title === apt.title)) {
        acc.push(apt);
      }
      return acc;
    }, [] as typeof appointments);

    return uniqueByTitle.slice(0, 4);
  }, [getFilteredAppointments]);

  if (legendItems.length === 0) {
    return null;
  }

  return (
    <Flex 
      gap={24} 
      wrap="wrap" 
      style={{ 
        padding: '16px 0',
        borderTop: '1px solid #f0f0f0',
        marginTop: 16 
      }}
    >
      {legendItems.map((item) => (
        <Flex key={item.id} gap={8} align="center">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: CATEGORY_COLORS[item.category],
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, color: '#4b5563' }}>
            {item.title}
          </span>
        </Flex>
      ))}
    </Flex>
  );
}
