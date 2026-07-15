import type { Metadata } from "next";
import {
  AiTasteProfileBar,
  ContentCarouselSection,
  MusicCarouselSection,
  WelcomeBanner,
} from "@/components/dashboard";
import {
  getAiTasteProfileScore,
  getBecauseYouWatched,
  getFeelGood,
  getForYouMusic,
  getForYouRecommended,
  getHiddenGems,
  getRelaxingMusic,
  getThrillerNight,
  getTrendingPsychological,
  getTrendingSports,
} from "@/lib/data/for-you";
import { getCurrentUser } from "@/lib/data/user";

export const metadata: Metadata = {
  title: "For You — AniVerse",
  description:
    "Personalized anime, movies, shows, and music picked from your AI taste profile.",
};

export default async function ForYouPage() {
  const user = await getCurrentUser();
  const [
    tasteScore,
    recommended,
    music,
    becauseYouWatched,
    trendingPsychological,
    trendingSports,
    thrillerNight,
    feelGood,
    relaxingMusic,
    hiddenGems,
  ] = await Promise.all([
    getAiTasteProfileScore(user.id),
    getForYouRecommended(),
    getForYouMusic(),
    getBecauseYouWatched(),
    getTrendingPsychological(),
    getTrendingSports(),
    getThrillerNight(),
    getFeelGood(),
    getRelaxingMusic(),
    getHiddenGems(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 sm:gap-8">
      <WelcomeBanner userName={user.name} variant="foryou" />

      <AiTasteProfileBar score={tasteScore} />

      <ContentCarouselSection
        title="🎯 Recommended For You"
        subtitle="Hand-picked from your genres, ratings, and watch history"
        searchPlaceholder="Search Recommended Content……. "
        items={recommended}
      />

      <MusicCarouselSection
        title="🎧 Music Recommended For Your Taste"
        subtitle="Songs, OSTs, and artists matched to your mood and watch history"
        searchPlaceholder="Search Music Content……. "
        tracks={music}
      />

      <ContentCarouselSection
        title="🎬 Because You Watched Death Note…"
        subtitle="More titles like what you finished recently"
        searchPlaceholder="Search Watching Content……. "
        items={becauseYouWatched}
      />

      <ContentCarouselSection
        title="🧠 Trending in Psychological…"
        subtitle="Top psychological picks across AniVerse this week"
        searchPlaceholder="Search Watching Content……. "
        items={trendingPsychological}
      />

      <ContentCarouselSection
        title="⚽ Trending in Sports"
        subtitle="Sports anime and shows fans are watching now"
        searchPlaceholder="Search Watching Content……. "
        items={trendingSports}
      />

      <ContentCarouselSection
        title="😱 Thriller Night"
        subtitle="Late-night suspense, crime, and edge-of-seat stories"
        searchPlaceholder="Search Watching Content……. "
        items={thrillerNight}
      />

      <ContentCarouselSection
        title="😊 Feel Good"
        subtitle="Light-hearted anime and movies to lift your mood"
        searchPlaceholder="Search Watching Content……. "
        items={feelGood}
      />

      <MusicCarouselSection
        title="🌙 Relaxing Music For Night"
        subtitle="Calm OSTs and tracks for winding down"
        searchPlaceholder="Search Music Content……. "
        tracks={relaxingMusic}
      />

      <ContentCarouselSection
        title="✨ Hidden Gems"
        subtitle="Underrated picks your profile says you will love"
        searchPlaceholder="Search Watching Content……. "
        items={hiddenGems}
      />
    </div>
  );
}
