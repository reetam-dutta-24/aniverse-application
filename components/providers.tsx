"use client";

import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import { NavigationLoadingProvider } from "@/components/navigation/navigation-loading-context";
import { NavigationLoadingShell } from "@/components/navigation/navigation-loading-shell";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NavigationLoadingProvider>
        <Suspense fallback={null}>
          <NavigationLoadingShell>{children}</NavigationLoadingShell>
        </Suspense>
      </NavigationLoadingProvider>
    </SessionProvider>
  );
}
