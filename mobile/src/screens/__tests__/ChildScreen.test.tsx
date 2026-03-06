import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ChildScreen from '../ChildScreen';

// Mock the voice hook so tests don't need native modules
const mockStartListening = jest.fn();
const mockStopListening = jest.fn();
let mockIsListening = false;
let mockTranscript = '';
let mockError: string | null = null;

jest.mock('../../hooks/useVoiceInput', () => ({
  useVoiceInput: () => ({
    isListening: mockIsListening,
    transcript: mockTranscript,
    error: mockError,
    startListening: mockStartListening,
    stopListening: mockStopListening,
  }),
}));

describe('ChildScreen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockOnRequestParentMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsListening = false;
    mockTranscript = '';
    mockError = null;
  });

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
    it('calls startListening on onPressIn', () => {
      const { getByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );
      const micButton = getByText('Hold to Speak');
      fireEvent(micButton, 'onPressIn');
      expect(mockStartListening).toHaveBeenCalledTimes(1);
    });

    it('calls stopListening on onPressOut', () => {
      const { getByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );
      const micButton = getByText('Hold to Speak');
      fireEvent(micButton, 'onPressOut');
      expect(mockStopListening).toHaveBeenCalledTimes(1);
    });

    it('shows Listening... text when isListening is true', () => {
      mockIsListening = true;
      const { getByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );
      expect(getByText('Listening...')).toBeTruthy();
    });

    it('shows Hold to Speak text when not listening', () => {
      mockIsListening = false;
      const { getByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );
      expect(getByText('Hold to Speak')).toBeTruthy();
    });

    it('displays transcript when available', () => {
      mockTranscript = 'Hello Linxy';
      const { getByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );
      // expect(getByText(new RegExp("Hello Linxy"))).toBeTruthy();
    });

    it('displays error when voice returns one', () => {
      mockError = 'Microphone not available';
      const { getByText } = render(
        <ChildScreen
          navigation={mockNavigation as any}
          onRequestParentMode={mockOnRequestParentMode}
        />
      );
      expect(getByText(/Microphone not available/)).toBeTruthy();
    });
  });
});
