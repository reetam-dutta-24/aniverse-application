"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { detailHeroBtnBase } from "@/lib/detail-route-ui";
import { emitCollectionFavoriteCount } from "@/components/collection/collection-favorite-count-chip";

interface ToggleCollectionFavoriteButtonProps {
  collectionSlug: string;
  initialFavorited?: boolean;
  className?: string;
}

export function ToggleCollectionFavoriteButton({
  collectionSlug,
  initialFavorited = false,
  className,
}: ToggleCollectionFavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleToggle() {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/collections/${encodeURIComponent(collectionSlug)}/favorite`,
        { method: "POST" },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Could not update favourites.",
        );
      }
      setFavorited(Boolean(data.favorited));
      if (typeof data.favoriteCount === "number") {
        emitCollectionFavoriteCount(data.favoriteCount);
      }
    } catch (toggleError) {
      setError(
        toggleError instanceof Error
          ? toggleError.message
          : "Could not update favourites.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-0 flex-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => void handleToggle()}
        className={cn(
          detailHeroBtnBase(
            favorited
              ? "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white"
              : "border-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white",
          ),
          className,
        )}
        aria-pressed={favorited}
      >
        <Heart
          className={cn(
            "size-3.5 shrink-0",
            favorited ? "fill-current" : "fill-current",
          )}
        />
        <span className="truncate">
          {favorited ? "Added to Favourites" : "Add To Favourites"}
        </span>
      </button>
      {error ? (
        <p className="mt-1 text-center text-[10px] text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
