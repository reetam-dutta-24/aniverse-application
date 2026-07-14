import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { CollectionCard, CommunityCard } from "@/components/cards";
import { CollectionDetailHero } from "@/components/collection";
import { ContentPageSection } from "@/components/content";
import {
  ContentCarouselSection,
  MusicCarouselSection,
  WatchlistGridSection,
} from "@/components/dashboard";
import { GradientButton } from "@/components/ui/gradient-button";
import { getCommunityMemberPreview } from "@/lib/data/community";
import {
  getAllCollectionIds,
  getCollectionDetail,
} from "@/lib/data/collection-detail";

interface CollectionPageProps {
  params: Promise<{ collectionid: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllCollectionIds();
  return ids.map((collectionid) => ({ collectionid }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collectionid } = await params;
  const collection = await getCollectionDetail(collectionid);
  if (!collection) return { title: "Collection — AniVerse" };
  return {
    title: `${collection.name} — AniVerse`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { collectionid } = await params;
  const [collection, members] = await Promise.all([
    getCollectionDetail(collectionid),
    getCommunityMemberPreview(),
  ]);

  if (!collection) notFound();

  const addItemAction = (
    <GradientButton size="sm" className="gap-1.5 rounded-full px-5">
      <Plus className="size-4" />
      Add New Item
    </GradientButton>
  );

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12 lg:gap-14">
      <CollectionDetailHero collection={collection} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 sm:gap-12 sm:px-8 lg:gap-14 lg:px-12">
        <WatchlistGridSection
          title="📂 View All Items"
          searchPlaceholder="Search items…"
          items={collection.allItems}
          action={addItemAction}
        />

        <ContentCarouselSection
          title="⏳ Continue Watching"
          searchPlaceholder="Search all items…"
          items={collection.continueWatching}
        />

        <ContentCarouselSection
          title="🏆 Content You Watched The Most"
          searchPlaceholder="Search all items…"
          items={collection.watchedMost}
        />

        <MusicCarouselSection
          title="🎧 Most Listened Music In This Community"
          searchPlaceholder="Search tracks…"
          tracks={collection.musicTracks}
        />

        <ContentPageSection
          title="📒 Similar Collections"
          variant="community"
          slides={collection.similarCollections.map((entry) => ({
            id: entry.id,
            node: <CollectionCard collection={entry} />,
          }))}
        />

        <ContentPageSection
          title={`👥 Communities Involving ${collection.name}`}
          variant="community"
          slides={collection.communities.map((community) => ({
            id: community.id,
            node: (
              <CommunityCard
                community={community}
                members={members}
                ctaMode="join"
              />
            ),
          }))}
        />
      </div>
    </div>
  );
}
