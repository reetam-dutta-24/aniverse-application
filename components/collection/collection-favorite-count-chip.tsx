"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/ui/chip";

interface CollectionFavoriteCountChipProps {
  initialCount: number;
  className?: string;
}

export function CollectionFavoriteCountChip({
  initialCount,
  className,
}: CollectionFavoriteCountChipProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent<{ count: number }>).detail;
      if (typeof detail?.count === "number") setCount(detail.count);
    }
    window.addEventListener("collection:favorite-count", handler);
    return () => window.removeEventListener("collection:favorite-count", handler);
  }, []);

  return (
    <Chip variant="brand" className={className}>
      {count} Favts
    </Chip>
  );
}

export function emitCollectionFavoriteCount(count: number) {
  window.dispatchEvent(
    new CustomEvent("collection:favorite-count", { detail: { count } }),
  );
}
