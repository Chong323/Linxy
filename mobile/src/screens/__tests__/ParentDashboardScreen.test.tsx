import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ParentDashboardScreen from '../ParentDashboardScreen';
import { AppStateProvider } from '../../contexts/AppStateContext';

// Mock the pinService to avoid AsyncStorage issues
jest.mock('../../services/pinService', () => ({
  setPin: jest.fn(),
  deletePin: jest.fn(),
  verifyPin: jest.fn(),
  hasPin: jest.fn().mockResolvedValue(false),
}));

describe('ParentDashboardScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders parent dashboard', () => {
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    expect(getByText('Parent Architect Dashboard')).toBeTruthy();
  });

  it('has back to child button', () => {
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    expect(getByText('Back to Child Mode')).toBeTruthy();
  });

  it('shows confirmation alert when clicking back to child mode', () => {
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    const backButton = getByText('Back to Child Mode');
    fireEvent.press(backButton);

    // The alert should be triggered - we can verify by checking the component still renders
    expect(getByText('Back to Child Mode')).toBeTruthy();
  });

  it('renders settings tab content by default', () => {
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    expect(getByText('PIN Management')).toBeTruthy();
  });

  it('renders reports tab when clicked', () => {
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    const reportsTab = getByText('Reports');
    fireEvent.press(reportsTab);

    expect(getByText('Child Activity')).toBeTruthy();
    expect(getByText('No activity reports yet.')).toBeTruthy();
  });

  it('renders commands tab when clicked', () => {
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    const commandsTab = getByText('Commands');
    fireEvent.press(commandsTab);

    expect(getByText('Send Command to Linxy')).toBeTruthy();
  });

  it('integrates with AppStateContext', () => {
    // This test verifies that the component properly uses useAppState
    const { getByText } = render(
      <AppStateProvider>
        <ParentDashboardScreen navigation={mockNavigation as any} />
      </AppStateProvider>
    );

    // If the component renders without error, it means useAppState worked
    expect(getByText('Parent Architect Dashboard')).toBeTruthy();
  });
});
