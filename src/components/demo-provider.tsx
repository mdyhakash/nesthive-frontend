"use client";

import * as React from "react";

/**
 * Demo-only settings. `simulateError` makes every list show its error state so
 * the retry flow can be reviewed without a real backend.
 */
interface DemoContextValue {
  simulateError: boolean;
  setSimulateError: (v: boolean) => void;
}

const DemoContext = React.createContext<DemoContextValue>({
  simulateError: false,
  setSimulateError: () => {},
});

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [simulateError, setSimulateError] = React.useState(false);
  const value = React.useMemo(() => ({ simulateError, setSimulateError }), [simulateError]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  return React.useContext(DemoContext);
}
