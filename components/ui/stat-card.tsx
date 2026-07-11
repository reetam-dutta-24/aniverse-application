import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
}

/** Blue-to-violet gradient metric card (e.g. "Content Watched — 186"). */
export function StatCard({ label, value, className, ...props }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex h-[190px] w-[300px] flex-col items-center justify-center gap-2 rounded-[20px] bg-gradient-blue-violet p-2.5 text-center text-white",
        className,
      )}
      {...props}
    >
      <p className="text-2xl font-bold">{label}</p>
      <p className="text-display font-bold">{value}</p>
    </div>
  );
}
