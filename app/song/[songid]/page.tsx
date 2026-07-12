import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { CollectionCard, CommunityCard, MusicCard } from "@/components/cards";
import {
  ContentCharacterCard,
  ContentDetailHero,
  ContentPageSection,
  ContentReviewSection,
} from "@/components/content";
import { GradientButton } from "@/components/ui/gradient-button";
import { getCommunityMemberPreview } from "@/lib/data/community";
import { getAllSongIds, getSongDetail } from "@/lib/data/song-detail";

interface SongPageProps {
  params: Promise<{ songid: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllSongIds();
  return ids.map((songid) => ({ songid }));
}

export async function generateMetadata({
  params,
}: SongPageProps): Promise<Metadata> {
  const { songid } = await params;
  const song = await getSongDetail(songid);
  if (!song) return { title: "Song — AniVerse" };
  return {
    title: `${song.title} — AniVerse`,
    description: song.synopsis,
  };
}

export default async function SongDetailPage({ params }: SongPageProps) {
  const { songid } = await params;
  const [song, members] = await Promise.all([
    getSongDetail(songid),
    getCommunityMemberPreview(),
  ]);

  if (!song) notFound();

  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12 lg:gap-14">
      <ContentDetailHero content={song} />

      <ContentPageSection
        title="Artists, Album And Show/Anime/Movie"
        variant="content"
        rowHover={false}
        slides={song.characters.map((character) => ({
          id: character.id,
          node: (
            <ContentCharacterCard
              character={character}
              contentId={song.id}
              contentAccent={song.accent}
              interactive={false}
            />
          ),
        }))}
      />

      <ContentPageSection
        title={`Songs/OSTs Similar To ${song.title}`}
        variant="content"
        slides={song.featuredOsts.map((track) => ({
          id: track.id,
          node: <MusicCard track={track} />,
        }))}
      />

      <ContentPageSection
        title="Included in Collections"
        variant="community"
        slides={song.collections.map((collection) => ({
          id: collection.id,
          node: <CollectionCard collection={collection} />,
        }))}
      />

      <ContentPageSection
        title={`Communities Involving ${song.title}`}
        variant="community"
        slides={song.communities.map((community) => ({
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

      <ContentReviewSection
        title={`Reviews Of ${song.title}`}
        action={
          <GradientButton size="sm" className="gap-1.5 rounded-full px-5">
            <Plus className="size-4" />
            Add Review
          </GradientButton>
        }
        reviews={song.reviews}
      />
    </div>
  );
}
