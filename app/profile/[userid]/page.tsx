import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionCard, CommunityCard, PosterCard } from "@/components/cards";
import { ArtistKpiSection } from "@/components/artist";
import { ProfileDetailHero } from "@/components/profile";
import {
  ContentPageSection,
  InteractiveReviewSection,
} from "@/components/content";
import {
  ContentCarouselSection,
  MusicCarouselSection,
} from "@/components/dashboard";
import { getCommunityMemberPreview } from "@/lib/data/community";
import { getOptionalUser } from "@/lib/data/user";
import { getUserDetail } from "@/lib/data/user-detail";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{ userid: string }>;
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { userid } = await params;
  const profile = await getUserDetail(userid);
  if (!profile) return { title: "Profile — AniVerse" };
  return {
    title: `${profile.name} — AniVerse`,
    description: profile.bio,
  };
}

export default async function ProfileDetailPage({ params }: ProfilePageProps) {
  const { userid } = await params;
  const viewer = await getOptionalUser();
  const [profile, members] = await Promise.all([
    getUserDetail(userid, viewer?.id),
    getCommunityMemberPreview(),
  ]);

  if (!profile) notFound();

  const isOwner = viewer?.handle === profile.handle;

  const firstName = profile.name.split(" ")[0];

  return (
    <div className="flex w-full flex-col">
      <ProfileDetailHero profile={profile} isOwner={isOwner} />
      <ArtistKpiSection stats={profile.engagementStats} />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-4 pt-10 sm:gap-12 sm:px-8 lg:gap-14 lg:px-12">
        <ContentCarouselSection
          title="⚡ Current Activity"
          searchPlaceholder="Search activity…"
          items={profile.currentActivity}
        />

        <ContentCarouselSection
          title={`❤️ Content ${firstName} Liked The Most`}
          searchPlaceholder="Search titles…"
          items={profile.likedContent}
        />

        <ContentCarouselSection
          title={`🎬 Most Watched Content By ${firstName}`}
          searchPlaceholder="Search titles…"
          items={profile.watchedMost}
        />

        <MusicCarouselSection
          title={`❤️ Songs ${firstName} Liked The Most`}
          searchPlaceholder="Search tracks…"
          tracks={profile.likedSongs}
        />

        <MusicCarouselSection
          title={`▶️ Most Played Songs By ${firstName}`}
          searchPlaceholder="Search tracks…"
          tracks={profile.mostPlayedSongs}
        />

        <MusicCarouselSection
          title={`💿 Most Liked Albums By ${firstName}`}
          searchPlaceholder="Search albums…"
          tracks={profile.likedAlbums}
        />

        <ContentPageSection
          title={`🎤 Top Artists ${firstName} Listens To`}
          variant="content"
          slides={profile.topArtists.map((artist) => ({
            id: artist.id,
            node: <PosterCard item={artist} />,
          }))}
        />

        <ContentPageSection
          title={`📒 Collections By ${firstName}`}
          variant="community"
          slides={profile.collections.map((collection) => ({
            id: collection.id,
            node: <CollectionCard collection={collection} />,
          }))}
        />

        <ContentPageSection
          title={`👥 Communities ${firstName} Is Part Of`}
          variant="community"
          slides={profile.communities.map((community) => ({
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
          title={`✍️ Recent Posts & Reviews By ${firstName}`}
          reviews={profile.reviews}
          viewerUserId={isOwner ? viewer?.id : undefined}
          allowCreate={false}
        />
      </div>
    </div>
  );
}
