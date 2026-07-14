import { cn } from "@/lib/utils";

export interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

/** Glass panel wrapper for a settings group. */
export function SettingsSection({
  title,
  subtitle,
  children,
  className,
}: SettingsSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-card bg-glass-purple p-4 shadow-card-inner sm:p-5",
        className,
      )}
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
