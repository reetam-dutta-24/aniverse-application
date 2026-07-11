import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-semibold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Figma "Primary Button" gradient fill
        gradient:
          "bg-gradient-brand hover:shadow-glow-pink-soft hover:brightness-110 active:brightness-95",
        // Figma outline variant (magenta 1px border)
        outline:
          "border border-brand-magenta bg-transparent hover:bg-brand-magenta/10 hover:shadow-glow-pink-soft",
        ghost: "bg-transparent text-white/90 hover:bg-white/10 hover:text-white",
      },
      size: {
        sm: "h-[35px] rounded-btn-sm px-4 text-base",
        md: "h-[52px] rounded-btn px-6 text-lg",
        lg: "h-[62px] rounded-btn px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
