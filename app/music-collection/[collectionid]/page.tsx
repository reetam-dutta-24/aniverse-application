import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { CollectionCard, CommunityCard, MusicCard, PosterCard } from "@/components/cards";
import { CollectionDetailHero } from "@/components/collection";
import { ContentPageSection } from "@/components/content";
import { MusicCarouselSection, MusicGridSection } from "@/components/dashboard";
import { GradientButton } from "@/components/ui/gradient-button";
import { COLLECTION_MEDIA_COPY } from "@/lib/collection-media-copy";
import { getCommunityMemberPreview } from "@/lib/data/community";
import {
  getAllMusicCollectionIds,
  getMusicCollectionDetail,
} from "@/lib/data/music-collection-detail";

interface MusicCollectionPageProps {
  params: Promise<{ collectionid: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllMusicCollectionIds();
  return ids.map((collectionid) => ({ collectionid }));
}

export async function generateMetadata({
  params,
}: MusicCollectionPageProps): Promise<Metadata> {
  const { collectionid } = await params;
  const collection = await getMusicCollectionDetail(collectionid);
  if (!collection) return { title: "Music Collection — AniVerse" };
  return {
    title: `${collection.name} — AniVerse`,
    description: collection.description,
  };
}

export default async function MusicCollectionDetailPage({
  params,
}: MusicCollectionPageProps) {
  const { collectionid } = await params;
  const [collection, members] = await Promise.all([
    getMusicCollectionDetail(collectionid),
    getCommunityMemberPreview(),
  ]);

  if (!collection) notFound();

  const copy = COLLECTION_MEDIA_COPY.music;

  const addItemAction = (
    <GradientButton size="sm" className="gap-1.5 rounded-full px-5">
      <Plus className="size-4" />
      {copy.addItemCta}
    </GradientButton>
  );

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12 lg:gap-14">
      <CollectionDetailHero
        collection={collection}
        variant="music"
        favoriteTracks={collection.favoriteTracks}
      />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 sm:gap-12 sm:px-8 lg:gap-14 lg:px-12">
        <MusicGridSection
          title={copy.viewAllTitle}
          searchPlaceholder="Search tracks…"
          tracks={collection.allTracks}
          action={addItemAction}
        />

        <MusicCarouselSection
          title={copy.continueTitle}
          searchPlaceholder="Search tracks…"
          tracks={collection.continueListeningTracks}
        />

        <MusicCarouselSection
          title={copy.mostPlayedTitle}
          searchPlaceholder="Search tracks…"
          tracks={collection.mostListenedTracks}
        />

        <MusicCarouselSection
          title="Most Listened Music In This Community"
          searchPlaceholder="Search tracks…"
          tracks={collection.musicTracks}
        />

        <ContentPageSection
          title="Similar Vibes Songs You Will Love! (Not in Your Collection)"
          variant="content"
          slides={collection.similarVibesSongs.map((track) => ({
            id: track.id,
            node: <MusicCard track={track} />,
          }))}
        />

        <ContentPageSection
          title="Popular Artists In Collection"
          variant="content"
          slides={collection.popularArtists.map((artist) => ({
            id: artist.id,
            node: <PosterCard item={artist} />,
          }))}
        />

        <ContentPageSection
          title="Similar Collections"
          variant="community"
          slides={collection.similarCollections.map((entry) => ({
            id: entry.id,
            node: <CollectionCard collection={entry} />,
          }))}
        />

        <ContentPageSection
          title={`Communities Involving ${collection.name}`}
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
