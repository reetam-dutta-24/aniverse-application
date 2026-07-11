import { cn } from "@/lib/utils";

export interface SectionHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
}

/** Section heading block: 42px bold title over a lavender subtitle. */
export function SectionHeader({
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
      {...props}
    >
      <h2 className="text-title font-bold text-white">{title}</h2>
      {subtitle ? <p className="text-xl text-muted">{subtitle}</p> : null}
    </div>
  );
}
