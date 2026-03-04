import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppStateProvider, useAppState } from '../AppStateContext';

describe('AppStateContext', () => {
  it('provides default child mode', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });
    
    expect(result.current.mode).toBe('child');
    expect(result.current.isPinSet).toBe(false);
  });

  it('switchToChildMode updates mode to child', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    });
    
    act(() => {
      result.current.switchToChildMode();
    });
    
    expect(result.current.mode).toBe('child');
  });
});