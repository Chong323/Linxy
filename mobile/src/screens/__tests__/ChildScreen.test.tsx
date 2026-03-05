import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ChildScreen from '../ChildScreen';

jest.useFakeTimers();

describe('ChildScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockOnRequestParentMode = jest.fn();

  it('renders chat interface', () => {
    const { getByText } = render(
      <ChildScreen
        navigation={mockNavigation as any}
        onRequestParentMode={mockOnRequestParentMode}
      />
    );

    expect(getByText('Linxy Explorer Mode')).toBeTruthy();
  });

  it('has button to switch to parent mode', () => {
    const { getByText } = render(
      <ChildScreen
        navigation={mockNavigation as any}
        onRequestParentMode={mockOnRequestParentMode}
      />
    );

    expect(getByText('👤 Parent Mode')).toBeTruthy();
  });

  it('has push-to-talk button', () => {
    const { getByText } = render(
      <ChildScreen
        navigation={mockNavigation as any}
        onRequestParentMode={mockOnRequestParentMode}
      />
    );

    expect(getByText('Hold to Speak')).toBeTruthy();
  });

  describe('Interaction logic', () => {
    it('sets state to listening on onPressIn', () => {
      const { getByText, queryByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );

      const micButton = getByText('Hold to Speak');
      fireEvent(micButton, 'onPressIn');

      expect(queryByText('Listening...')).toBeTruthy();
      expect(queryByText('LISTENING')).toBeTruthy();
    });

    it('transitions states on onPressOut', () => {
      const { getByText, queryByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );

      const micButton = getByText('Hold to Speak');
      
      // Start interaction
      fireEvent(micButton, 'onPressIn');
      
      // Finish interaction
      fireEvent(micButton, 'onPressOut');

      // Should be 'thinking' immediately
      expect(queryByText('THINKING')).toBeTruthy();

      // Advance timers by MOCK_NETWORK_DELAY_MS (1500)
      act(() => {
        jest.advanceTimersByTime(1500);
      });
      expect(queryByText('SPEAKING')).toBeTruthy();

      // Advance timers by MOCK_SPEECH_DURATION_MS (3000)
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      expect(queryByText('IDLE')).toBeTruthy();
    });

    it('clears existing timers on a new onPressIn', () => {
      const { getByText, queryByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );

      const micButton = getByText('Hold to Speak');

      // First interaction
      fireEvent(micButton, 'onPressIn');
      fireEvent(micButton, 'onPressOut');
      expect(queryByText('THINKING')).toBeTruthy();

      // Partial wait
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      
      // Second interaction starts before first one finishes
      fireEvent(micButton, 'onPressIn');
      expect(queryByText('LISTENING')).toBeTruthy();

      // Advance time enough that the first interaction SHOULD have finished if not cleared
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // Still should be LISTENING (not transitioned by old timers)
      expect(queryByText('LISTENING')).toBeTruthy();
      expect(queryByText('IDLE')).toBeFalsy();
    });
  });
});
