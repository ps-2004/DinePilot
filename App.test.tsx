import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('should render the app', () => {
    render(<App />);
    expect(screen.getByText('DinePilot')).toBeInTheDocument();
  });

  it('should display login screen initially', () => {
    render(<App />);
    expect(screen.getByText('Indian Cuisine Management System')).toBeInTheDocument();
  });

  it('should render role selection on initial load', () => {
    render(<App />);
    expect(screen.getByText('Select your role')).toBeInTheDocument();
  });

  it('should display customer button on login screen', () => {
    render(<App />);
    expect(screen.getByText('Customer')).toBeInTheDocument();
  });

  it('should display restaurant staff button on login screen', () => {
    render(<App />);
    expect(screen.getByText('Restaurant Staff')).toBeInTheDocument();
  });

  it('should have DevOps view button initially', () => {
    render(<App />);
    expect(screen.getByText('View DevOps & Code Configuration')).toBeInTheDocument();
  });

  it('should render with proper structure', () => {
    const { container } = render(<App />);
    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toBeInTheDocument();
  });

  it('should render the DinePilot title', () => {
    render(<App />);
    const dineTitle = screen.getByText('DinePilot');
    expect(dineTitle).toBeInTheDocument();
  });

  it('should render proper heading in login screen', () => {
    render(<App />);
    const heading = screen.getByText('Select your role');
    expect(heading).toBeInTheDocument();
  });

  it('should display order food view profile text for customer', () => {
    render(<App />);
    expect(screen.getByText('Order food & view profile')).toBeInTheDocument();
  });

  it('should display chef and manager portal text for staff', () => {
    render(<App />);
    expect(screen.getByText('Chef & Manager Portal')).toBeInTheDocument();
  });
});
