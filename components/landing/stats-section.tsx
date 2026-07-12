import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { getTasteStats } from "@/lib/data/landing";

/** "Understand your entertainment taste" — gradient stat cards. */
export async function StatsSection() {
  const stats = await getTasteStats();

  return (
    <section
      id="analytics"
      className="flex w-full scroll-mt-[72px] flex-col items-center gap-10 px-6 py-16"
    >
      <SectionHeader
        title="Understand your entertainment taste"
        subtitle="Track what you watch, hear, save, and love"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} />
        ))}
      </div>
    </section>
  );
}
