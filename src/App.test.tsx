import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the calendar page', () => {
    render(<App />);
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  it('renders the new appointment button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /New Appointment/i })).toBeInTheDocument();
  });

  it('renders view mode segmented control', () => {
    render(<App />);
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Planner')).toBeInTheDocument();
  });

  it('opens the appointment dialog when New Appointment button is clicked', () => {
    render(<App />);

    // Find and click the New Appointment button
    const newAppointmentButton = screen.getByRole('button', { name: /New Appointment/i });
    fireEvent.click(newAppointmentButton);

    // Verify the modal dialog appears by checking for modal-specific elements
    // Multiple "New Appointment" texts exist (button and modal), so check for form elements instead
    expect(screen.getByPlaceholderText('Enter appointment title')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Create Appointment')).toBeInTheDocument();
  });
});
