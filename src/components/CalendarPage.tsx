import { useState, useCallback } from 'react';
import { Flex, Button, Segmented, Tag, Dropdown, Checkbox, Spin } from 'antd';
import { PlusOutlined, FilterOutlined } from '@ant-design/icons';
import { useAppointmentStore } from '../store/appointmentStore';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentModal } from './AppointmentModal';
import { PlannerView } from './PlannerView';
import { OfflineBanner } from './OfflineBanner';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import type { CalendarViewMode, AppointmentCategory, Appointment } from '../types/appointment';
import '../App.css';

const viewOptions = [
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'Planner', value: 'planner' },
];

const categoryOptions = [
  { label: 'Work', value: 'work' },
  { label: 'Home', value: 'home' },
];

export function CalendarPage() {
  const { viewMode, setViewMode, setCategoryFilter, isLoading } = useAppointmentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<AppointmentCategory[]>(['work', 'home']);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);

  const handleViewChange = useCallback(
    (value: string | number) => {
      setViewMode(value as CalendarViewMode);
    },
    [setViewMode]
  );

  const handleFilterChange = useCallback(
    (values: AppointmentCategory[]) => {
      setSelectedFilters(values);
      if (values.length === 0 || values.length === 2) {
        setCategoryFilter('all');
      } else {
        setCategoryFilter(values[0]);
      }
    },
    [setCategoryFilter]
  );

  const handleTagClose = useCallback(
    (category: AppointmentCategory) => {
      const newFilters = selectedFilters.filter((f) => f !== category);
      handleFilterChange(newFilters);
    },
    [selectedFilters, handleFilterChange]
  );

  const handleNewAppointment = useCallback(() => {
    setEditingAppointment(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingAppointment(undefined);
  }, []);

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <div className="calendar-page">
        <Flex justify="center" align="center" className="page-loading-container">
          <Spin size="large" />
        </Flex>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      {/* Offline Banner */}
      <OfflineBanner />

      {/* Top Controls Row */}
      <Flex justify="space-between" align="center" className="top-controls-wrapper">
        <Flex gap={8} align="center">
          {/* Filter Tags */}
          {selectedFilters.includes('work') && (
            <Tag closable onClose={() => handleTagClose('work')} className="filter-tag-no-margin">
              Work
            </Tag>
          )}
          {selectedFilters.includes('home') && (
            <Tag closable onClose={() => handleTagClose('home')} className="filter-tag-no-margin">
              Home
            </Tag>
          )}

          {/* Filter Dropdown */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'work',
                  label: (
                    <Checkbox
                      checked={selectedFilters.includes('work')}
                      onChange={(e) => {
                        const newFilters = e.target.checked
                          ? [...selectedFilters, 'work']
                          : selectedFilters.filter((f) => f !== 'work');
                        handleFilterChange(newFilters as AppointmentCategory[]);
                      }}
                    >
                      Work
                    </Checkbox>
                  ),
                },
                {
                  key: 'home',
                  label: (
                    <Checkbox
                      checked={selectedFilters.includes('home')}
                      onChange={(e) => {
                        const newFilters = e.target.checked
                          ? [...selectedFilters, 'home']
                          : selectedFilters.filter((f) => f !== 'home');
                        handleFilterChange(newFilters as AppointmentCategory[]);
                      }}
                    >
                      Home
                    </Checkbox>
                  ),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<FilterOutlined />} size="small">
              Filter
            </Button>
          </Dropdown>
        </Flex>

        <Flex gap={16} align="center">
          {/* View Mode Toggle */}
          <Segmented options={viewOptions} value={viewMode} onChange={handleViewChange} />

          {/* New Appointment Button */}
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNewAppointment}>
            New Appointment
          </Button>
        </Flex>
      </Flex>

      {/* Page Header */}
      <div className="calendar-page-header">
        <h1 className="calendar-page-title">My Appointments</h1>
        <p className="calendar-page-subtitle">Manage your work and home schedule</p>
      </div>

      {/* Conditional View Rendering */}
      {viewMode === 'planner' ? (
        <PlannerView onEditAppointment={handleEditAppointment} />
      ) : (
        <AppointmentCalendar
          onEditAppointment={handleEditAppointment}
          onNewAppointment={handleNewAppointment}
        />
      )}

      {/* Add/Edit Modal */}
      <AppointmentModal
        open={isModalOpen}
        onClose={handleModalClose}
        appointment={editingAppointment}
      />

      {/* Sync Status Indicator */}
      <SyncStatusIndicator />
    </div>
  );
}
