import { cn } from "@/lib/utils";
import type { TasteBreakdownItem } from "@/lib/data/onboarding-config";

export interface TasteBreakdownPanelProps {
  items: TasteBreakdownItem[];
  className?: string;
}

/** Horizontal taste-dimension bars shown on onboarding results. */
export function TasteBreakdownPanel({
  items,
  className,
}: TasteBreakdownPanelProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-3 rounded-card bg-glass-purple p-4 shadow-card-inner sm:grid-cols-2 sm:gap-4 sm:p-5",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-white sm:text-sm">
              {item.label}
            </span>
            <span className="text-xs font-bold text-brand-pink">
              {item.value}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-brand transition-all duration-700"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
