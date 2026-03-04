import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChildScreen from '../ChildScreen';

describe('ChildScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockOnRequestParentMode = jest.fn();

  it('renders chat interface', () => {
    const { getByText } = render(
      <ChildScreen navigation={mockNavigation as any} onRequestParentMode={mockOnRequestParentMode} />
    );
    
    expect(getByText('Linxy Explorer Mode')).toBeTruthy();
  });

  it('has button to switch to parent mode', () => {
    const { getByText } = render(
      <ChildScreen navigation={mockNavigation as any} onRequestParentMode={mockOnRequestParentMode} />
    );
    
    expect(getByText('👤')).toBeTruthy();
  });
});