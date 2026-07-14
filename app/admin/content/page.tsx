import type { Metadata } from "next";
import Link from "next/link";
import { AdminContentTable } from "@/components/admin/content-table";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth-guards";
import { listCatalogContent } from "@/lib/services/content.service";

export const metadata: Metadata = {
  title: "Content — Admin — AniVerse",
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  await requireAdmin();
  const { items: rows } = await listCatalogContent({ pageSize: 100 });

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Content catalog</h1>
            <p className="mt-1 text-sm text-white/60">
              {rows.length} title{rows.length === 1 ? "" : "s"} in the database.
            </p>
          </div>
          <Link
            href="/admin/content/new"
            className="rounded-full bg-gradient-brand px-5 py-2 text-sm font-semibold text-white shadow-glow-pink-soft"
          >
            + New content
          </Link>
        </div>

        <AdminContentTable rows={rows} />
      </div>
    </AdminShell>
  );
}
