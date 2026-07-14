import type { AnalyticsData } from "@/lib/data/analytics";

export interface MilestonesStripProps {
  milestones: AnalyticsData["milestones"];
}

/** Achievement highlights — glowing badge cards in a responsive row. */
export function MilestonesStrip({ milestones }: MilestonesStripProps) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="bg-gradient-blue-violet flex items-center gap-3 rounded-card p-4 shadow-[0_2px_10px_rgba(37,99,235,0.18)]"
        >
          <span className="text-2xl" aria-hidden>
            {milestone.emoji}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {milestone.title}
            </p>
            <p className="truncate text-xs text-muted">{milestone.detail}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
