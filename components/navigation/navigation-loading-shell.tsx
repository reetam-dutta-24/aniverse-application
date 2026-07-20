"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { NavigationPageOverlay } from "@/components/navigation/navigation-page-overlay";
import { RouteProgressBar } from "@/components/navigation/route-progress-bar";
import { useNavigationLoading } from "@/components/navigation/navigation-loading-context";

/** Wires link clicks + route changes to the global navigation loader UI. */
export function NavigationLoadingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isNavigating, isSoft, startNavigation, stopNavigation } =
    useNavigationLoading();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const prevRouteKey = useRef(routeKey);

  useEffect(() => {
    if (prevRouteKey.current !== routeKey) {
      prevRouteKey.current = routeKey;
      stopNavigation();
    }
  }, [routeKey, stopNavigation]);

  useEffect(() => {
    if (!isNavigating) return;
    const timeout = window.setTimeout(() => stopNavigation(), 12000);
    return () => window.clearTimeout(timeout);
  }, [isNavigating, routeKey, stopNavigation]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("role") === "button") return;

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      let url: URL;
      try {
        url = new URL(rawHref, window.location.origin);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const nextKey = `${url.pathname}${url.search}`;
      const currentKey = `${pathname}${window.location.search}`;
      if (nextKey === currentKey) return;

      startNavigation();
    }

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [pathname, startNavigation]);

  return (
    <>
      <RouteProgressBar active={isNavigating} soft={isSoft} />
      <NavigationPageOverlay visible={isNavigating && !isSoft} />
      {children}
    </>
  );
}
