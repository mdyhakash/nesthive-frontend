"use client";

import * as React from "react";
import { useDemo } from "@/components/demo-provider";

export type QueryStatus = "loading" | "error" | "success";

/**
 * Fakes an async fetch: resolves the given mock data after `delay` ms
 * (default 600ms). No network involved. When "Simulate error states" is on in
 * the demo switcher, it resolves to an error instead; `retry()` re-runs it.
 */
export function useMockQuery<T>(data: T, delay = 600, deps: React.DependencyList = []) {
  const { simulateError } = useDemo();
  const [status, setStatus] = React.useState<QueryStatus>("loading");
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    setStatus("loading");
    const id = window.setTimeout(() => {
      setStatus(simulateError ? "error" : "success");
    }, delay);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, simulateError, delay, ...deps]);

  const retry = React.useCallback(() => setAttempt((n) => n + 1), []);

  return {
    status,
    isLoading: status === "loading",
    isError: status === "error",
    data,
    retry,
  };
}
