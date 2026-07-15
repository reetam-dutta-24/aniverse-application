"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { COLLECTION_CARD_H } from "@/lib/card-dimensions";
import { getCollectionDetailPath } from "@/lib/collection-routes";
import {
  getMusicCollectionDetailPath,
  isMusicCollectionId,
} from "@/lib/music-collection-routes";
import { getAccentStyle } from "@/lib/accents";
import type { Collection } from "@/types";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";

export interface CollectionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  collection: Collection;
  /** Show the "✏️ Edit" footer action instead of visibility (Figma Variant2). */
  editable?: boolean;
  onView?: () => void;
}

function CardHeaderImage({
  imageUrl,
  accentClass,
}: {
  imageUrl?: string;
  accentClass: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative h-[84px] w-full shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      </div>
    );
  }
  return <div className={cn("h-[84px] w-full shrink-0", accentClass)} />;
}

/** Collection card — image header, accent glow on hover, View Collection CTA. */
export function CollectionCard({
  collection,
  editable = false,
  onView,
  className,
  ...props
}: CollectionCardProps) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const accent = getAccentStyle(collection.accent ?? "blue");

  function handleView() {
    if (onView) {
      onView();
      return;
    }
    if (isMusicCollectionId(collection.id)) {
      router.push(getMusicCollectionDetailPath(collection.id));
      return;
    }
    router.push(getCollectionDetailPath(collection.id));
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[190px] rounded-[20px] transition-shadow duration-500 ease-out",
        hovered && accent.glow,
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      <div
        className="flex flex-col items-center overflow-hidden rounded-[20px] bg-glass-purple"
        style={{ height: COLLECTION_CARD_H }}
      >
        <CardHeaderImage
          imageUrl={collection.imageUrl}
          accentClass={accent.header}
        />
        <div className="flex w-full min-h-0 flex-1 flex-col items-center justify-between gap-px bg-surface pb-2.5 shadow-card-inner">
          <div className="flex w-full flex-col items-center gap-px">
            <h3 className="line-clamp-2 px-2.5 pt-2.5 text-center text-sm font-semibold leading-tight text-white">
              {collection.name}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-1.5 px-1">
              <Chip variant="blue" className="h-5 text-[10px]">
                {collection.itemCount} Items
              </Chip>
              <Chip variant="indigo" className="h-5 text-[10px]">
                {collection.favoriteCount} Favts
              </Chip>
            </div>
            {collection.createdAt ? (
              <div className="px-2 py-1">
                <Chip variant="brand" className="h-5 text-[10px]">
                  Created at {collection.createdAt}
                </Chip>
              </div>
            ) : null}
            {collection.description ? (
              <p className="w-[165px] px-1 text-center text-[10px] font-normal text-white/90 line-clamp-2">
                {collection.description}
              </p>
            ) : null}
            <p className="flex w-[165px] justify-between px-1.5 py-1 text-[10px] font-normal text-white/90">
              <span className="truncate">
                {collection.updatedAt
                  ? `Last Updated ${collection.updatedAt}`
                  : ""}
              </span>
              <span className="shrink-0">
                {editable
                  ? "✏️ Edit"
                  : collection.visibility === "private"
                    ? "🔒 Private"
                    : "🌍 Public"}
              </span>
            </p>
          </div>
          <Button
            variant="gradient"
            size="sm"
            className="h-6 w-[100px] shrink-0 rounded-full px-2 text-[9px] font-normal"
            onClick={handleView}
          >
            View Collection
          </Button>
        </div>
      </div>
    </div>
  );
}
