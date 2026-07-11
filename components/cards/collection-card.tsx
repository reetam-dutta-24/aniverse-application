import { cn } from "@/lib/utils";
import { accentStyles } from "@/lib/accents";
import type { Collection } from "@/types";
import { Chip } from "@/components/ui/chip";

export interface CollectionCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  collection: Collection;
  /** Show the "✏️ Edit" footer action instead of visibility (Figma Variant2). */
  editable?: boolean;
}

/** Collection card: radial gradient header over a black info panel. */
export function CollectionCard({
  collection,
  editable = false,
  className,
  ...props
}: CollectionCardProps) {
  const accent = accentStyles[collection.accent ?? "blue"];

  return (
    <div
      className={cn(
        "flex w-[248px] flex-col items-center overflow-hidden rounded-poster bg-glass-purple transition-shadow duration-300",
        accent.hoverGlow,
        className,
      )}
      {...props}
    >
      <div className={cn("h-[127px] w-full", accent.header)} />
      <div className="flex h-[223px] w-full flex-col items-center bg-surface shadow-panel">
        <h3 className="p-2.5 text-[22px] font-semibold text-white">
          {collection.name}
        </h3>
        <div className="flex items-center justify-center gap-4">
          <Chip variant="blue">{collection.itemCount} Items</Chip>
          <Chip variant="indigo">{collection.favoriteCount} Favts</Chip>
        </div>
        {collection.createdAt ? (
          <div className="p-2.5">
            <Chip variant="brand" className="h-[27.5px]">
              Created at {collection.createdAt}
            </Chip>
          </div>
        ) : null}
        {collection.description ? (
          <p className="w-[202px] p-1 text-center text-xs font-semibold text-white">
            {collection.description}
          </p>
        ) : null}
        <p className="flex w-[202px] justify-between p-2.5 text-xs font-semibold text-white">
          <span>
            {collection.updatedAt ? `Last Updated ${collection.updatedAt}` : ""}
          </span>
          <span>
            {editable
              ? "✏️ Edit"
              : collection.visibility === "private"
                ? "🔒 Private"
                : "🌍 Public"}
          </span>
        </p>
      </div>
    </div>
  );
}
