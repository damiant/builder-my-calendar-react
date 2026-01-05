import { ConfigProvider } from 'antd';
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
  return (
    <ConfigProvider theme={theme}>
      <CalendarPage />
    </ConfigProvider>
  );
}

export default App;
