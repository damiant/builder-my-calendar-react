import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useAppointmentStore } from './store/appointmentStore';
import { CalendarPage } from './components/CalendarPage';

// Custom theme configuration with Lime primary color
const theme = {
  token: {
    colorPrimary: '#65a30d',
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      primaryColor: '#ffffff',
    },
    Calendar: {
      itemActiveBg: '#ecfccb',
    },
    Segmented: {
      itemSelectedBg: '#65a30d',
      itemSelectedColor: '#ffffff',
    },
  },
};

function App() {
  const loadFromStorage = useAppointmentStore((state) => state.loadFromStorage);
  const setIsOnline = useAppointmentStore((state) => state.setIsOnline);

  // Initialize store from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline]);

  return (
    <ConfigProvider theme={theme}>
      <CalendarPage />
    </ConfigProvider>
  );
}

export default App;
