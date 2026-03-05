import React from 'react';
import { render } from '@testing-library/react-native';
import LinxyAvatar from '../LinxyAvatar';

describe('LinxyAvatar', () => {
  it('renders idle state correctly', () => {
    const { getByText } = render(<LinxyAvatar currentState="idle" />);
    
    expect(getByText('🦊')).toBeTruthy();
    expect(getByText('IDLE')).toBeTruthy();
  });

  it('renders listening state correctly', () => {
    const { getByText } = render(<LinxyAvatar currentState="listening" />);
    
    expect(getByText('👂')).toBeTruthy();
    expect(getByText('LISTENING')).toBeTruthy();
  });

  it('renders thinking state correctly', () => {
    const { getByText } = render(<LinxyAvatar currentState="thinking" />);
    
    expect(getByText('🤔')).toBeTruthy();
    expect(getByText('THINKING')).toBeTruthy();
  });

  it('renders speaking state correctly', () => {
    const { getByText } = render(<LinxyAvatar currentState="speaking" />);
    
    expect(getByText('🗣️')).toBeTruthy();
    expect(getByText('SPEAKING')).toBeTruthy();
  });

  it('handles invalid state gracefully', () => {
    // @ts-ignore - purposefully passing invalid state to test runtime fallback
    const { getByText } = render(<LinxyAvatar currentState="invalid_state" />);
    
    expect(getByText('🦊')).toBeTruthy();
    expect(getByText('IDLE')).toBeTruthy();
  });

  it('handles undefined state gracefully', () => {
    // @ts-ignore - purposefully passing undefined state to test runtime fallback
    const { getByText } = render(<LinxyAvatar currentState={undefined} />);
    
    expect(getByText('🦊')).toBeTruthy();
    expect(getByText('IDLE')).toBeTruthy();
  });
});
