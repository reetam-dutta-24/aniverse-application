import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-guards";
import { canAccessAdminSection } from "@/lib/admin-nav";
import { prisma } from "@/lib/prisma";
import { mapCollectionToCard } from "@/lib/mappers/collection.mapper";
import { CreateCollectionButton } from "@/components/forms/create-collection-button";

export const metadata: Metadata = {
  title: "Collections — Admin — AniVerse",
  robots: { index: false, follow: false },
};

export default async function AdminCollectionsPage() {
  const { role } = await requireAdmin();
  if (!canAccessAdminSection(role, "collections")) {
    return (
      <p className="text-sm text-white/70">Super admin access required.</p>
    );
  }

  const rows = await prisma.collection.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { favorites: true } } },
    take: 100,
  });
  const collections = rows.map(mapCollectionToCard);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Global collections</h1>
          <p className="mt-1 text-sm text-white/60">
            Create and manage public collections discoverable across AniVerse.
          </p>
        </div>
        <CreateCollectionButton />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm text-white/85">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Favts</th>
              <th className="px-4 py-3">Visibility</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium">{collection.name}</td>
                <td className="px-4 py-3 text-white/60">{collection.id}</td>
                <td className="px-4 py-3">{collection.itemCount}</td>
                <td className="px-4 py-3">{collection.favoriteCount}</td>
                <td className="px-4 py-3 capitalize">{collection.visibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/admin" className="text-sm text-brand-pink hover:underline">
        ← Back to admin overview
      </Link>
    </div>
  );
}
