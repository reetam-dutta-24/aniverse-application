import { GradientButton } from "@/components/ui/gradient-button";
import { SectionHeader } from "@/components/ui/section-header";
import { PosterCard } from "@/components/cards/poster-card";
import { CommunityCard } from "@/components/cards/community-card";
import { CollectionCard } from "@/components/cards/collection-card";
import {
  getFeaturedCollection,
  getFeaturedCommunity,
  getSpotlightContent,
} from "@/lib/data/landing";

interface HighlightTextProps {
  title: string;
  subtitle: string;
  bullets: string[];
  cta: string;
}

function HighlightText({ title, subtitle, bullets, cta }: HighlightTextProps) {
  return (
    <div className="flex max-w-[560px] flex-col justify-center gap-8 px-6 py-8 lg:px-10">
      <div className="flex flex-col gap-2">
        <h3 className="max-w-[480px] text-heading font-bold text-white">
          {title}
        </h3>
        <p className="max-w-[420px] text-subtitle text-muted">{subtitle}</p>
      </div>
      <ul className="list-disc space-y-1.5 ps-6 text-base text-white">
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <div>
        <GradientButton size="md">{cta}</GradientButton>
      </div>
    </div>
  );
}

/** "One hub for your entertainment world" — three alternating rows. */
export async function HighlightsSection() {
  const [{ content, music }, { community, members }, collection] =
    await Promise.all([
      getSpotlightContent(),
      getFeaturedCommunity(),
      getFeaturedCollection(),
    ]);

  return (
    <section className="flex w-full flex-col items-center gap-6 px-6 py-16">
      <SectionHeader
        title="One hub for your entertainment world"
        subtitle="From recommendations to communities, AniVerse keeps your taste organized."
      />

      {/* Row 1: cards left, text right */}
      <div className="flex w-full max-w-[1200px] flex-col items-center justify-between gap-8 py-8 lg:flex-row lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-9">
          <PosterCard item={content} />
          <PosterCard item={music} />
        </div>
        <HighlightText
          title="Discover content that fits your taste"
          subtitle="Find anime, shows, songs, and artists matched to your preferences, moods, and genres."
          bullets={[
            "AI-powered recommendations",
            "Personalized match scores",
            "Content across anime, music, and shows",
          ]}
          cta="Explore Discover"
        />
      </div>

      {/* Row 2: text left, community card right */}
      <div className="flex w-full max-w-[1200px] flex-col-reverse items-center justify-center gap-8 lg:flex-row lg:gap-[120px]">
        <HighlightText
          title="Join communities built around what you love"
          subtitle="Discover fan spaces where you can chat, post, review, and connect with people who share your taste."
          bullets={[
            "Active fan communities",
            "Watch rooms and discussions",
            "Public and niche fandom spaces",
          ]}
          cta="View Communities"
        />
        <CommunityCard
          community={community}
          members={members}
          className="shadow-glow-cyan"
        />
      </div>

      {/* Row 3: collection card left, text right */}
      <div className="flex w-full max-w-[1200px] flex-col items-center justify-between gap-8 py-8 lg:flex-row lg:px-[140px]">
        <CollectionCard
          collection={collection}
          className="rounded-card-xl shadow-glow-blue"
        />
        <HighlightText
          title="Save everything in smart collections"
          subtitle="Organize your favorite anime, songs, playlists, and titles into collections that reflect your entertainment identity."
          bullets={[
            "Build personal collections",
            "Save favorites in one place",
            "Revisit your best picks anytime",
          ]}
          cta="See Collections"
        />
      </div>
    </section>
  );
}
