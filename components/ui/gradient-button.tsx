import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Pick<VariantProps<typeof buttonVariants>, "size"> {}

/** The AniVerse primary CTA: brand magenta-to-purple gradient pill. */
export function GradientButton({
  className,
  size,
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant: "gradient", size }), className)}
      {...props}
    />
  );
}
