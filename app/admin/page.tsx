import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth-guards";
import { countCatalogContent } from "@/lib/services/content.service";

export const metadata: Metadata = {
  title: "Admin — AniVerse",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  await requireAdmin();
  const contentCount = await countCatalogContent();

  return (
    <AdminShell>
      <div className="flex max-w-4xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Catalog overview</h1>
          <p className="mt-2 text-sm text-white/60">
            Manage the content that powers Discover, detail pages, watchlist, and
            recommendations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wide text-white/45">
              Catalog titles
            </p>
            <p className="mt-2 text-3xl font-bold text-white">{contentCount}</p>
          </div>
          <Link
            href="/admin/content/new"
            className="flex items-center justify-center rounded-2xl border border-brand-magenta/40 bg-brand-magenta/10 p-5 text-sm font-semibold text-white transition-colors hover:bg-brand-magenta/20"
          >
            + Add new content
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/65">
          <p className="font-semibold text-white">Getting started</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              Run <code className="text-brand-pink">npm run db:seed</code> to
              import starter titles and create the superuser.
            </li>
            <li>
              Sign in as admin (
              <code className="text-brand-pink">admin@aniverse.local</code> by
              default).
            </li>
            <li>
              Create or edit content here — public pages read from PostgreSQL
              first.
            </li>
          </ol>
        </div>
      </div>
    </AdminShell>
  );
}
