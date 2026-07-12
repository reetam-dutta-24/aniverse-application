import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import {
  CollectionCard,
  CommunityCard,
  MusicCard,
  PosterCard,
} from "@/components/cards";
import {
  ContentCharacterCard,
  ContentDetailHero,
  ContentEpisodeSection,
  ContentPageSection,
  ContentReviewSection,
} from "@/components/content";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  getAllContentIds,
  getContentDetail,
} from "@/lib/data/content-detail";
import { getCommunityMemberPreview } from "@/lib/data/community";

interface ContentPageProps {
  params: Promise<{ contentid: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllContentIds();
  return ids.map((contentid) => ({ contentid }));
}

export async function generateMetadata({
  params,
}: ContentPageProps): Promise<Metadata> {
  const { contentid } = await params;
  const content = await getContentDetail(contentid);
  if (!content) return { title: "Content — AniVerse" };
  return {
    title: `${content.title} — AniVerse`,
    description: content.synopsis,
  };
}

export default async function ContentDetailPage({ params }: ContentPageProps) {
  const { contentid } = await params;
  const [content, members] = await Promise.all([
    getContentDetail(contentid),
    getCommunityMemberPreview(),
  ]);

  if (!content) notFound();

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12 lg:gap-14">
      <ContentDetailHero content={content} />

      <ContentEpisodeSection
        episodes={content.episodes}
        seasons={content.seasons}
        contentId={content.id}
        contentAccent={content.accent}
      />

      <ContentPageSection
        title="Characters"
        variant="content"
        items={content.characters.map((character) => (
          <ContentCharacterCard
            key={character.id}
            character={character}
            contentId={content.id}
            contentAccent={content.accent}
          />
        ))}
      />

      <ContentPageSection
        title={`Featured OSTs of ${content.title}`}
        variant="content"
        items={content.featuredOsts.map((track) => (
          <MusicCard key={track.id} track={track} />
        ))}
      />

      <ContentPageSection
        title="You May Also Like"
        variant="content"
        items={content.relatedContent.map((item) => (
          <PosterCard key={item.id} item={item} />
        ))}
      />

      <ContentPageSection
        title="Included in Collections"
        variant="community"
        items={content.collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      />

      <ContentPageSection
        title={`Communities Involving ${content.title}`}
        variant="community"
        items={content.communities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            members={members}
            ctaMode="join"
          />
        ))}
      />

      <ContentReviewSection
        title={`Reviews Of ${content.title}`}
        action={
          <GradientButton size="sm" className="gap-1.5 rounded-full px-5">
            <Plus className="size-4" />
            Add Review
          </GradientButton>
        }
        reviews={content.reviews}
      />
    </div>
  );
}
