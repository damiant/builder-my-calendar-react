import { useState, useCallback } from 'react';
import { Flex, Button, Segmented, Tag, Select, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppointmentStore } from '../store/appointmentStore';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentLegend } from './AppointmentLegend';
import { AppointmentModal } from './AppointmentModal';
import { PlannerView } from './PlannerView';
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
        <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
          <Spin size="large" />
        </Flex>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      {/* Top Controls Row */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Flex gap={8} align="center">
          {/* Filter Tags */}
          {selectedFilters.includes('work') && (
            <Tag closable onClose={() => handleTagClose('work')} style={{ margin: 0 }}>
              Work
            </Tag>
          )}
          {selectedFilters.includes('home') && (
            <Tag closable onClose={() => handleTagClose('home')} style={{ margin: 0 }}>
              Home
            </Tag>
          )}

          {/* Filter Dropdown */}
          <Select
            mode="multiple"
            value={selectedFilters}
            onChange={handleFilterChange}
            options={categoryOptions}
            placeholder="Add filter"
            style={{ minWidth: 100 }}
            maxTagCount={0}
            maxTagPlaceholder={() => null}
            allowClear={false}
            popupMatchSelectWidth={false}
            variant="borderless"
            suffixIcon={null}
          />
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
        <>
          {/* Calendar with integrated legend */}
          <AppointmentCalendar onEditAppointment={handleEditAppointment} />

          {/* Legend showing appointment types */}
          <AppointmentLegend />
        </>
      )}

      {/* Add/Edit Modal */}
      <AppointmentModal
        open={isModalOpen}
        onClose={handleModalClose}
        appointment={editingAppointment}
      />
    </div>
  );
}
