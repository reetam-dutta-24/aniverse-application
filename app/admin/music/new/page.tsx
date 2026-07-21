import type { Metadata } from "next";
import { MusicForm } from "@/components/admin/music-form";
import { requireMusicAdmin } from "@/lib/auth-guards";
import type { MusicFormInput } from "@/lib/validators/admin/music";

export const metadata: Metadata = {
  title: "New track — Admin — AniVerse",
  robots: { index: false, follow: false },
};

const emptyForm: MusicFormInput = {
  title: "",
  nativeTitle: "",
  slug: "",
  artist: "",
  artistSlug: "",
  kind: "song",
  description: "",
  lyrics: "",
  source: "",
  album: "",
  language: "",
  genreLabels: [],
  durationLabel: "",
  imageUrl: "",
  backdropUrl: "",
  audioUrl: "",
  trendingLabel: "",
  creditLabel: "",
  contentSlug: "",
  catalogReviews: [],
};

export default async function AdminNewMusicPage() {
  await requireMusicAdmin();
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">New track</h1>
      <MusicForm mode="create" initial={emptyForm} />
    </div>
  );
}
