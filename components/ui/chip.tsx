import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const chipVariants = cva(
  "inline-flex h-[25px] items-center justify-center whitespace-nowrap rounded-chip px-2.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        blue: "bg-gradient-blue-violet text-white",
        indigo: "bg-gradient-indigo text-white",
        teal: "bg-gradient-teal text-black",
        brand: "bg-gradient-brand text-white",
        magenta: "bg-brand-magenta text-white",
        outline: "border border-brand-magenta bg-transparent text-white",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

/** Small pill used for genres, member counts, match scores, and statuses. */
export function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant }), className)} {...props} />
  );
}
