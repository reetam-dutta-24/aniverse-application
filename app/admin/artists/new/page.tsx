import type { Metadata } from "next";
import { ArtistForm } from "@/components/admin/artist-form";
import { requireArtistAdmin } from "@/lib/auth-guards";
import type { ArtistFormInput } from "@/lib/validators/admin/artist";

export const metadata: Metadata = {
  title: "New artist — Admin — AniVerse",
  robots: { index: false, follow: false },
};

const emptyForm: ArtistFormInput = {
  title: "",
  nativeTitle: "",
  slug: "",
  synopsis: "",
  imageUrl: "",
  rankLeft: "",
  rankRight: "",
  primaryTags: [],
  languages: [],
  label: "",
  isGroup: false,
  members: [],
  genreLabels: [],
  catalogReviews: [],
};

export default async function AdminNewArtistPage() {
  await requireArtistAdmin();
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">New artist</h1>
      <ArtistForm mode="create" initial={emptyForm} />
    </div>
  );
}
