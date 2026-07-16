import { SectionHeader } from "@/components/ui/section-header";
import { CommunityCard } from "@/components/cards/community-card";
import {
  ScrollFadeIn,
  ScrollFadeItem,
  ScrollFadeStagger,
} from "@/components/landing/scroll-fade-in";
import { getTrendingCommunities } from "@/lib/data/landing";

/** "Find fandoms that feel like home" — trending community cards. */
export async function CommunitiesSection() {
  const communities = await getTrendingCommunities();

  return (
    <section
      id="community"
      className="flex w-full scroll-mt-[72px] flex-col items-center gap-10 px-6 py-16"
    >
      <ScrollFadeIn>
        <SectionHeader
          title="Find fandoms that feel like home"
          subtitle="Join communities, post reviews, chat live, and watch together"
        />
      </ScrollFadeIn>
      <div className="w-full overflow-x-auto pb-8 pt-2">
        <ScrollFadeStagger className="mx-auto flex w-max flex-nowrap items-start gap-7 px-2">
          {communities.map((community) => (
            <ScrollFadeItem key={community.id}>
            <CommunityCard
              community={community}
              className="w-[190px] shrink-0"
            />
            </ScrollFadeItem>
          ))}
        </ScrollFadeStagger>
      </div>
    </section>
  );
}
