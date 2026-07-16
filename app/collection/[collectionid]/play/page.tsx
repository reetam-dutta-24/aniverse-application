import type { Metadata } from "next";
import { CollectionPlayView } from "@/components/collection/collection-play-view";
import { getCollectionDetail } from "@/lib/data/collection-detail";

interface CollectionPlayPageProps {
  params: Promise<{ collectionid: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPlayPageProps): Promise<Metadata> {
  const { collectionid } = await params;
  const collection = await getCollectionDetail(collectionid);
  if (!collection) return { title: "Play Collection — AniVerse" };
  return {
    title: `Play ${collection.name} — AniVerse`,
    description: `Listen or watch ${collection.name} in order on AniVerse.`,
  };
}

export default async function CollectionPlayPage({
  params,
}: CollectionPlayPageProps) {
  const { collectionid } = await params;
  return <CollectionPlayView collectionSlug={collectionid} />;
}
