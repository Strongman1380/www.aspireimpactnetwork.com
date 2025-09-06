import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import YouthProfiles from '../YouthProfiles';
import { AuthProvider } from '../../../contexts/AuthContext';
import { UIProvider } from '../../../contexts/UIContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock the useYouthStore hook
jest.mock('../../../store/youthStore', () => ({
  useYouthStore: jest.fn(() => ({
    youthProfiles: [
      {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        dob: '2010-01-01',
        foster_worker: 'Worker Name'
      },
      {
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        dob: '2012-05-15',
        foster_worker: 'Worker Name'
      }
    ],
    loading: false,
    error: null,
    fetchYouthProfiles: jest.fn(),
  })),
  YouthProfile: {}
}));

// Mock useAuth
jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: jest.fn(() => ({
    currentUser: { uid: 'test-user-id' },
    userRole: 'admin'
  }))
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('YouthProfiles Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <UIProvider>
              <YouthProfiles />
            </UIProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  });

  test('renders youth profiles', async () => {
    // Check if the component title is rendered
    expect(screen.getByText('Youth Profiles')).toBeInTheDocument();
    
    // Check if the search field is rendered
    expect(screen.getByPlaceholderText('Search by name...')).toBeInTheDocument();
    
    // Check if the youth profiles are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Check if the view profile buttons are rendered
    const viewProfileButtons = screen.getAllByText('View Profile');
    expect(viewProfileButtons.length).toBe(2);
  });

  test('filters youth profiles by search term', () => {
    const searchInput = screen.getByPlaceholderText('Search by name...');
    
    // Search for 'John'
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Only John Doe should be visible
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Both profiles should be visible again
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    
    // Search for 'Smith'
    fireEvent.change(searchInput, { target: { value: 'Smith' } });
    
    // Only Jane Smith should be visible
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('renders add new youth button for admin role', () => {
    const addButton = screen.getByText('Add New Youth');
    expect(addButton).toBeInTheDocument();
  });

  test('renders refresh button', () => {
    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
  });
});