import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../../contexts/AuthContext';
import { UIProvider } from '../../../contexts/UIContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock Firebase auth
jest.mock('../../../firebase/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
  },
  db: {},
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <UIProvider>
              <Login />
            </UIProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  });

  test('renders login form', () => {
    expect(screen.getByText('Foster Links')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email', async () => {
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for short password', async () => {
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign In/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const visibilityToggle = screen.getByLabelText(/toggle password visibility/i);
    
    // Password should be hidden initially
    expect(passwordInput.type).toBe('password');
    
    // Click the visibility toggle
    fireEvent.click(visibilityToggle);
    
    // Password should be visible
    expect(passwordInput.type).toBe('text');
    
    // Click the visibility toggle again
    fireEvent.click(visibilityToggle);
    
    // Password should be hidden again
    expect(passwordInput.type).toBe('password');
  });
});