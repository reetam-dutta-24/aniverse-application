"use client";

import { createContext, useContext } from "react";
import { sectionTintSeed } from "@/lib/card-theme";

const CarouselSectionContext = createContext<number>(0);

export function CarouselSectionProvider({
  sectionTitle,
  children,
}: {
  sectionTitle?: string;
  children: React.ReactNode;
}) {
  const seed = sectionTitle ? sectionTintSeed(sectionTitle) : 0;
  return (
    <CarouselSectionContext.Provider value={seed}>
      {children}
    </CarouselSectionContext.Provider>
  );
}

/** Section-scoped tint offset — matches card template bg in carousel rows. */
export function useCarouselTintSeed(): number {
  return useContext(CarouselSectionContext);
}
