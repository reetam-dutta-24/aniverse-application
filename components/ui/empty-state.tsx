import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional call-to-action, e.g. a GradientButton. */
  action?: React.ReactNode;
}

/** Centered placeholder panel for empty lists and zero-data views. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <GlassCard
      tint="purple"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-8 py-14 text-center",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-brand text-white [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </GlassCard>
  );
}
