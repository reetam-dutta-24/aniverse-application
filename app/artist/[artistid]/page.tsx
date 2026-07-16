import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtistCard, CollectionCard, CommunityCard } from "@/components/cards";
import { ArtistDetailHero, ArtistKpiSection } from "@/components/artist";
import {
  ContentCharacterCard,
  ContentPageSection,
  InteractiveReviewSection,
} from "@/components/content";
import { MusicCarouselSection, MusicGridSection } from "@/components/dashboard";
import { getAllArtistIds, getArtistDetail } from "@/lib/data/artist-detail";
import { getCommunityMemberPreview } from "@/lib/data/community";
import { getOptionalUser } from "@/lib/data/user";

interface ArtistPageProps {
  params: Promise<{ artistid: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllArtistIds();
  return ids.map((artistid) => ({ artistid }));
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const { artistid } = await params;
  const artist = await getArtistDetail(artistid);
  if (!artist) return { title: "Artist — AniVerse" };
  return {
    title: `${artist.title} — AniVerse`,
    description: artist.synopsis,
  };
}

export default async function ArtistDetailPage({ params }: ArtistPageProps) {
  const { artistid } = await params;
  const viewer = await getOptionalUser();
  const [artist, members] = await Promise.all([
    getArtistDetail(artistid),
    getCommunityMemberPreview(),
  ]);

  if (!artist) notFound();

  return (
    <div className="flex w-full flex-col">
      <ArtistDetailHero artist={artist} />
      <ArtistKpiSection stats={artist.engagementStats} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 pt-10 sm:gap-12 sm:px-8 lg:gap-14 lg:px-12">
        <MusicGridSection
          title={`🎵 All ${artist.title} Songs`}
          searchPlaceholder="Search tracks…"
          tracks={artist.allSongs}
        />

        <MusicCarouselSection
          title={`▶️ Most Played ${artist.title} Songs`}
          searchPlaceholder="Search tracks…"
          tracks={artist.mostPlayed}
        />

        <MusicCarouselSection
          title={`❤️ Most Liked ${artist.title} Songs`}
          searchPlaceholder="Search tracks…"
          tracks={artist.mostLiked}
        />

        <MusicCarouselSection
          title={`💿 Most Popular ${artist.title} Albums`}
          searchPlaceholder="Search albums…"
          tracks={artist.albums}
        />

        <ContentPageSection
          title={`👥 ${artist.title} Band Members`}
          variant="content"
          rowHover={false}
          slides={artist.members.map((member) => ({
            id: member.id,
            node: (
              <ContentCharacterCard
                character={member}
                contentId={artist.id}
                contentAccent={artist.accent}
                interactive={false}
              />
            ),
          }))}
        />

        <ContentPageSection
          title={`🎤 Artists Similar To ${artist.title}`}
          variant="content"
          slides={artist.similarArtists.map((entry) => ({
            id: entry.id,
            node: <ArtistCard item={entry} />,
          }))}
        />

        <ContentPageSection
          title="📀 EP Collections"
          variant="community"
          slides={artist.collections.map((collection) => ({
            id: collection.id,
            node: <CollectionCard collection={collection} />,
          }))}
        />

        <ContentPageSection
          title={`👥 Communities Involving ${artist.title}`}
          variant="community"
          slides={artist.communities.map((community) => ({
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

        <InteractiveReviewSection
          title={`✍️ Reviews Of ${artist.title}`}
          reviews={artist.reviews}
          targetType="artist"
          targetSlug={artist.id}
          viewerUserId={viewer?.id}
        />
      </div>
    </div>
  );
}
