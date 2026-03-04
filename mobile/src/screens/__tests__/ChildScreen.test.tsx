import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChildScreen from '../ChildScreen';

describe('ChildScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  it('renders chat interface', () => {
    const { getByText } = render(<ChildScreen navigation={mockNavigation as any} />);
    
    expect(getByText('Linxy Explorer Mode')).toBeTruthy();
  });

  it('has button to switch to parent mode', () => {
    const { getByText } = render(<ChildScreen navigation={mockNavigation as any} />);
    
    expect(getByText('Switch to Parent Mode')).toBeTruthy();
  });
});