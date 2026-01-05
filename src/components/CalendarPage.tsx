import { useState, useCallback } from 'react';
import { Flex, Button, Segmented, Tag, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppointmentStore } from '../store/appointmentStore';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentLegend } from './AppointmentLegend';
import { AppointmentModal } from './AppointmentModal';
import type { CalendarViewMode, AppointmentCategory } from '../types/appointment';
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
  const { viewMode, setViewMode, setCategoryFilter } = useAppointmentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<AppointmentCategory[]>(['work', 'home']);

  const handleViewChange = useCallback((value: string | number) => {
    setViewMode(value as CalendarViewMode);
  }, [setViewMode]);

  const handleFilterChange = useCallback((values: AppointmentCategory[]) => {
    setSelectedFilters(values);
    if (values.length === 0 || values.length === 2) {
      setCategoryFilter('all');
    } else {
      setCategoryFilter(values[0]);
    }
  }, [setCategoryFilter]);

  const handleTagClose = useCallback((category: AppointmentCategory) => {
    const newFilters = selectedFilters.filter((f) => f !== category);
    handleFilterChange(newFilters);
  }, [selectedFilters, handleFilterChange]);

  const handleNewAppointment = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="calendar-page">
      {/* Top Controls Row */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Flex gap={8} align="center">
          {/* Filter Tags */}
          {selectedFilters.includes('work') && (
            <Tag
              closable
              onClose={() => handleTagClose('work')}
              style={{ margin: 0 }}
            >
              Work
            </Tag>
          )}
          {selectedFilters.includes('home') && (
            <Tag
              closable
              onClose={() => handleTagClose('home')}
              style={{ margin: 0 }}
            >
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
          <Segmented
            options={viewOptions}
            value={viewMode}
            onChange={handleViewChange}
          />

          {/* New Appointment Button */}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleNewAppointment}
          >
            New Appointment
          </Button>
        </Flex>
      </Flex>

      {/* Page Header */}
      <div className="calendar-page-header">
        <h1 className="calendar-page-title">My Appointments</h1>
        <p className="calendar-page-subtitle">Manage your work and home schedule</p>
      </div>

      {/* Calendar with integrated legend */}
      <AppointmentCalendar />

      {/* Legend showing appointment types */}
      <AppointmentLegend />

      {/* Add/Edit Modal */}
      <AppointmentModal
        open={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
