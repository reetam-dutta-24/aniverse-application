import { redirect } from "next/navigation";
import { normalizeCollectionSlug } from "@/lib/collection-routes";

interface MusicCollectionRedirectProps {
  params: Promise<{ collectionid: string }>;
}

/** Legacy route — unified collections live at /collection/[slug]. */
export default async function MusicCollectionRedirectPage({
  params,
}: MusicCollectionRedirectProps) {
  const { collectionid } = await params;
  redirect(`/collection/${normalizeCollectionSlug(collectionid)}`);
}
