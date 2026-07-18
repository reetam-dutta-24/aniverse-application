"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { getArtistDetailPath } from "@/lib/artist-routes";

export interface AdminArtistRow {
  recordId: string;
  slug: string;
  title: string;
  isGroup: boolean;
}

export function AdminArtistTable({
  rows,
  searchQuery,
}: {
  rows: AdminArtistRow[];
  searchQuery?: string;
}) {
  const router = useRouter();

  async function handleDelete(recordId: string, title: string) {
    if (!window.confirm(`Delete "${title}" from the catalog?`)) return;
    const res = await fetch(`/api/admin/artists/${recordId}`, { method: "DELETE" });
    if (!res.ok) window.alert("Could not delete.");
    else router.refresh();
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/60">
        {searchQuery
          ? `No artists match “${searchQuery}”. Try a different name or slug.`
          : "No artists yet. Create your first artist profile."}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.recordId} className="border-t border-white/8 hover:bg-white/5">
              <td className="px-4 py-3 font-medium text-white">{row.title}</td>
              <td className="px-4 py-3 text-white/70">{row.isGroup ? "Group" : "Solo"}</td>
              <td className="px-4 py-3 font-mono text-xs text-white/55">{row.slug}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={getArtistDetailPath(row.slug)} className="rounded-lg px-2 py-1 text-xs text-brand-pink hover:bg-white/10">View</Link>
                  <Link href={`/admin/artists/${row.recordId}/edit`} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/80 hover:bg-white/10">
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                  <button type="button" onClick={() => handleDelete(row.recordId, row.title)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
