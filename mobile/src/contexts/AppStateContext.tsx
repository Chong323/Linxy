import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppMode = 'child' | 'parent';

interface AppStateContextValue {
  mode: AppMode;
  isPinSet: boolean;
  switchToParentMode: () => void;
  switchToChildMode: () => void;
  setIsPinSet: (value: boolean) => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AppStateProvider({ children }: Props) {
  const [mode, setMode] = useState<AppMode>('child');
  const [isPinSet, setIsPinSet] = useState(false);

  const switchToParentMode = () => setMode('parent');
  const switchToChildMode = () => setMode('child');

  return (
    <AppStateContext.Provider
      value={{
        mode,
        isPinSet,
        switchToParentMode,
        switchToChildMode,
        setIsPinSet,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}