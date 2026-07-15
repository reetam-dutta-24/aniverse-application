import type { Metadata } from "next";
import Link from "next/link";
import { AdminArtistTable } from "@/components/admin/artist-table";
import { requireArtistAdmin } from "@/lib/auth-guards";
import { listCatalogArtists } from "@/lib/services/artist.service";

export const metadata: Metadata = {
  title: "Artists — Admin — AniVerse",
  robots: { index: false, follow: false },
};

export default async function AdminArtistsPage() {
  await requireArtistAdmin();
  const result = await listCatalogArtists({ pageSize: 100 });

  const rows = result.items.map((item) => ({
    recordId: item.recordId,
    slug: item.slug,
    title: item.title,
    isGroup: item.isGroup,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Artist catalog</h1>
          <p className="mt-1 text-sm text-white/60">{result.total} artists</p>
        </div>
        <Link
          href="/admin/artists/new"
          className="rounded-full border border-brand-magenta/40 bg-brand-magenta/10 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/20"
        >
          + New artist
        </Link>
      </div>
      <AdminArtistTable rows={rows} />
    </div>
  );
}
