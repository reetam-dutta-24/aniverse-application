"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/ui/chip";

interface CollectionFollowerCountChipProps {
  initialCount: number;
  className?: string;
}

export function CollectionFollowerCountChip({
  initialCount,
  className,
}: CollectionFollowerCountChipProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent<{ count: number }>).detail;
      if (typeof detail?.count === "number") setCount(detail.count);
    }
    window.addEventListener("collection:follower-count", handler);
    return () => window.removeEventListener("collection:follower-count", handler);
  }, []);

  if (count < 0) return null;

  return (
    <Chip variant="cyan" className={className}>
      {count} Followers
    </Chip>
  );
}

export function emitCollectionFollowerCount(count: number) {
  window.dispatchEvent(
    new CustomEvent("collection:follower-count", { detail: { count } }),
  );
}
