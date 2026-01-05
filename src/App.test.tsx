import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the calendar page', () => {
    render(<App />);
    expect(screen.getByText(/My Appointments/i)).toBeInTheDocument();
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
});
