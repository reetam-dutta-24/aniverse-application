import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth-guards";
import { canAccessAdminSection } from "@/lib/admin-nav";
import { prisma } from "@/lib/prisma";
import { mapCommunityToCard } from "@/lib/mappers/community.mapper";
import { CreateCommunityButton } from "@/components/forms/create-community-button";

export const metadata: Metadata = {
  title: "Communities — Admin — AniVerse",
  robots: { index: false, follow: false },
};

export default async function AdminCommunitiesPage() {
  const { role } = await requireAdmin();
  if (!canAccessAdminSection(role, "communities")) {
    return (
      <p className="text-sm text-white/70">Super admin access required.</p>
    );
  }

  const rows = await prisma.community.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
  const communities = rows.map(mapCommunityToCard);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Global communities</h1>
          <p className="mt-1 text-sm text-white/60">
            Create public communities for users to discover and join.
          </p>
        </div>
        <CreateCommunityButton />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm text-white/85">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Members</th>
              <th className="px-4 py-3">Visibility</th>
            </tr>
          </thead>
          <tbody>
            {communities.map((community) => (
              <tr key={community.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium">{community.name}</td>
                <td className="px-4 py-3 text-white/60">{community.id}</td>
                <td className="px-4 py-3">{community.category}</td>
                <td className="px-4 py-3">{community.memberCount}</td>
                <td className="px-4 py-3 capitalize">{community.visibility}</td>
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
