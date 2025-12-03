import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginScreen from './LoginScreen';

describe('LoginScreen Component', () => {
  const mockOnLogin = vi.fn();
  const mockOnDevOps = vi.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
    mockOnDevOps.mockClear();
  });

  it('should render the login screen', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    expect(screen.getByText('DinePilot')).toBeInTheDocument();
    expect(screen.getByText('Indian Cuisine Management System')).toBeInTheDocument();
  });

  it('should display role selection buttons initially', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    expect(screen.getByText('Select your role')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Restaurant Staff')).toBeInTheDocument();
  });

  it('should show customer login form when customer is selected', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const customerButton = screen.getByText('Customer').closest('button');
    fireEvent.click(customerButton!);
    
    expect(screen.getByText("What's your name?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Rahul, Priya')).toBeInTheDocument();
  });

  it('should show staff role selection when staff is selected', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const staffButton = screen.getByText('Restaurant Staff').closest('button');
    fireEvent.click(staffButton!);
    
    expect(screen.getByText('Select Staff Role')).toBeInTheDocument();
  });

  it('should call onLogin with customer data when customer form is submitted', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const customerButton = screen.getByText('Customer').closest('button');
    fireEvent.click(customerButton!);
    
    const nameInput = screen.getByPlaceholderText('e.g. Rahul, Priya') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Rahul' } });
    
    const submitButton = screen.getByText('Enter Restaurant');
    fireEvent.click(submitButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Rahul',
        role: 'customer',
      })
    );
  });

  it('should call onLogin with chef role when chef button is clicked', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const staffButton = screen.getByText('Restaurant Staff').closest('button');
    fireEvent.click(staffButton!);
    
    const chefButton = screen.getByText(/Chef Panel/);
    fireEvent.click(chefButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'chef',
      })
    );
  });

  it('should call onLogin with manager role when manager button is clicked', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const staffButton = screen.getByText('Restaurant Staff').closest('button');
    fireEvent.click(staffButton!);
    
    const managerButton = screen.getByText(/Manager Dashboard/);
    fireEvent.click(managerButton);
    
    expect(mockOnLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        role: 'manager',
      })
    );
  });

  it('should allow going back to role selection', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const customerButton = screen.getByText('Customer').closest('button');
    fireEvent.click(customerButton!);
    
    expect(screen.getByText("What's your name?")).toBeInTheDocument();
    
    const backButton = screen.getByText('← Back');
    fireEvent.click(backButton);
    
    expect(screen.getByText('Select your role')).toBeInTheDocument();
  });

  it('should call onDevOps when DevOps button is clicked', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const devOpsButton = screen.getByText('View DevOps & Code Configuration');
    fireEvent.click(devOpsButton);
    
    expect(mockOnDevOps).toHaveBeenCalled();
  });

  it('should not submit customer form with empty name', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const customerButton = screen.getByText('Customer').closest('button');
    fireEvent.click(customerButton!);
    
    const submitButton = screen.getByText('Enter Restaurant');
    fireEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it('should not submit customer form with only whitespace', () => {
    render(<LoginScreen onLogin={mockOnLogin} onDevOps={mockOnDevOps} />);
    
    const customerButton = screen.getByText('Customer').closest('button');
    fireEvent.click(customerButton!);
    
    const nameInput = screen.getByPlaceholderText('e.g. Rahul, Priya') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '   ' } });
    
    const submitButton = screen.getByText('Enter Restaurant');
    fireEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});
