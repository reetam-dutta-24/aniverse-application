import { cn } from "@/lib/utils";

export interface ChartPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

/** Tinted glass panel wrapping a chart or stat block on the analytics page. */
export function ChartPanel({
  title,
  subtitle,
  className,
  children,
  ...props
}: ChartPanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-card bg-glass-purple p-4 shadow-card-inner sm:p-5",
        className,
      )}
      {...props}
    >
      <div>
        <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted sm:text-sm">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
