import { SectionHeader } from "@/components/ui/section-header";
import { CommunityCard } from "@/components/cards/community-card";
import { getTrendingCommunities } from "@/lib/data/landing";

/** "Find fandoms that feel like home" — trending community cards. */
export async function CommunitiesSection() {
  const communities = await getTrendingCommunities();

  return (
    <section
      id="community"
      className="flex w-full scroll-mt-[72px] flex-col items-center gap-10 px-6 py-16"
    >
      <SectionHeader
        title="Find fandoms that feel like home"
        subtitle="Join communities, post reviews, chat live, and watch together"
      />
      <div className="flex flex-wrap items-start justify-center gap-7 pb-8 pt-2">
        {communities.map((community) => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </section>
  );
}
