"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {
  useNavigationLoading,
  type NavigationStartOptions,
} from "@/components/navigation/navigation-loading-context";

type PushOptions = { scroll?: boolean };

function isSameRoute(href: string) {
  if (typeof window === "undefined") return false;
  try {
    const next = new URL(href, window.location.origin);
    const current = new URL(window.location.href);
    return (
      next.pathname === current.pathname && next.search === current.search
    );
  } catch {
    return false;
  }
}

export function useAppRouter() {
  const router = useNextRouter();
  const { startNavigation, stopNavigation } = useNavigationLoading();

  const push = useCallback(
    (href: string, options?: PushOptions) => {
      if (!isSameRoute(href)) {
        startNavigation();
      }
      router.push(href, options);
    },
    [router, startNavigation],
  );

  const replace = useCallback(
    (href: string, options?: PushOptions) => {
      if (!isSameRoute(href)) {
        startNavigation();
      }
      router.replace(href, options);
    },
    [router, startNavigation],
  );

  const refresh = useCallback(
    (options?: NavigationStartOptions) => {
      startNavigation({ soft: options?.soft ?? true });
      router.refresh();
      window.setTimeout(() => stopNavigation(), 1400);
    },
    [router, startNavigation, stopNavigation],
  );

  return useMemo(
    () => ({
      push,
      replace,
      refresh,
      back: () => {
        startNavigation();
        router.back();
      },
      forward: () => {
        startNavigation();
        router.forward();
      },
      prefetch: router.prefetch,
    }),
    [router, push, replace, refresh, startNavigation],
  );
}