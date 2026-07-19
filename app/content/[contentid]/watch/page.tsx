import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPlayView } from "@/components/content/content-play-view";
import { ContentWatchTracker } from "@/components/content/content-watch-tracker";
import { getContentPlaySession } from "@/lib/services/content-play.service";

interface ContentWatchPageProps {
  params: Promise<{ contentid: string }>;
}

export async function generateMetadata({
  params,
}: ContentWatchPageProps): Promise<Metadata> {
  const { contentid } = await params;
  const session = await getContentPlaySession(contentid);
  if (!session) return { title: "Watch — AniVerse" };
  return {
    title: `Watch ${session.contentTitle} — AniVerse`,
    description: `Stream ${session.contentTitle} on AniVerse.`,
  };
}

export default async function ContentWatchPage({ params }: ContentWatchPageProps) {
  const { contentid } = await params;
  const session = await getContentPlaySession(contentid);
  if (!session) notFound();

  return (
    <>
      <ContentWatchTracker contentSlug={session.contentSlug} />
      <ContentPlayView session={session} />
    </>
  );
}
