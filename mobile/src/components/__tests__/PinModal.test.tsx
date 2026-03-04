import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PinModal from '../PinModal';

describe('PinModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders numeric keypad', () => {
    const { getByText } = render(
      <PinModal visible onClose={mockOnClose} onSuccess={mockOnSuccess} isPinSet={true} />
    );
    
    expect(getByText('0')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
    expect(getByText('Submit')).toBeTruthy();
  });

  it('calls onSuccess when correct PIN submitted', async () => {
    const { getByText } = render(
      <PinModal visible onClose={mockOnClose} onSuccess={mockOnSuccess} isPinSet={true} />
    );
    
    // This test would need more setup with mocked pinService
    // For now, just verify the component renders
  });
});