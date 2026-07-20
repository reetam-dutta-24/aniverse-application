"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface NavigationStartOptions {
  /** Lighter bar only — for same-page refresh after mutations. */
  soft?: boolean;
}

interface NavigationLoadingContextValue {
  isNavigating: boolean;
  isSoft: boolean;
  startNavigation: (options?: NavigationStartOptions) => void;
  stopNavigation: () => void;
}

const NavigationLoadingContext =
  createContext<NavigationLoadingContextValue | null>(null);

export function NavigationLoadingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState({ active: false, soft: false });

  const startNavigation = useCallback((options?: NavigationStartOptions) => {
    setState({ active: true, soft: options?.soft ?? false });
  }, []);

  const stopNavigation = useCallback(() => {
    setState({ active: false, soft: false });
  }, []);

  const value = useMemo(
    () => ({
      isNavigating: state.active,
      isSoft: state.soft,
      startNavigation,
      stopNavigation,
    }),
    [state.active, state.soft, startNavigation, stopNavigation],
  );

  return (
    <NavigationLoadingContext.Provider value={value}>
      {children}
    </NavigationLoadingContext.Provider>
  );
}

export function useNavigationLoading() {
  const ctx = useContext(NavigationLoadingContext);
  if (!ctx) {
    throw new Error(
      "useNavigationLoading must be used within NavigationLoadingProvider",
    );
  }
  return ctx;
}

export function useOptionalNavigationLoading() {
  return useContext(NavigationLoadingContext);
}
