import type { Metadata } from "next";
import Link from "next/link";
import { AdminMusicTable } from "@/components/admin/music-table";
import { requireMusicAdmin } from "@/lib/auth-guards";
import { listCatalogTracks } from "@/lib/services/music.service";

export const metadata: Metadata = {
  title: "Music — Admin — AniVerse",
  robots: { index: false, follow: false },
};

export default async function AdminMusicPage() {
  await requireMusicAdmin();
  const result = await listCatalogTracks({ pageSize: 100 });

  const rows = result.items.map(({ recordId, track }) => ({
    recordId,
    slug: track.id,
    title: track.title,
    artist: track.artist,
    kind: track.kind,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Music catalog</h1>
          <p className="mt-1 text-sm text-white/60">{result.total} tracks</p>
        </div>
        <Link
          href="/admin/music/new"
          className="rounded-full border border-brand-magenta/40 bg-brand-magenta/10 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/20"
        >
          + New track
        </Link>
      </div>
      <AdminMusicTable rows={rows} />
    </div>
  );
}
