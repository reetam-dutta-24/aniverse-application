import { cn } from "@/lib/utils";
import {
  ContentCarouselSection,
  type ContentCarouselVariant,
} from "@/components/content/content-carousel-section";

export interface ContentPageSectionProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  items: React.ReactNode[];
  variant?: ContentCarouselVariant;
  itemsPerPage?: number;
  overflowVisible?: boolean;
  itemsCenter?: boolean;
  compact?: boolean;
  className?: string;
}

/** Content detail section — heading + paginated carousel (shared app structure). */
export function ContentPageSection({
  title,
  subtitle,
  action,
  items,
  variant = "content",
  itemsPerPage,
  overflowVisible = false,
  itemsCenter = false,
  compact = false,
  className,
}: ContentPageSectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12",
        overflowVisible && "overflow-visible",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
          compact ? "mb-2 sm:mb-3" : "mb-5 sm:mb-6",
        )}
      >
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white sm:text-heading">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-white/80">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <ContentCarouselSection
        items={items}
        variant={variant}
        itemsPerPage={itemsPerPage}
        overflowVisible={overflowVisible}
        itemsCenter={itemsCenter}
        compact={compact}
      />
    </section>
  );
}
