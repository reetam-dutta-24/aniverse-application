"use client";

import Link from "next/link";
import { useAppRouter } from "@/hooks/use-app-router";
import { Pencil, Trash2 } from "lucide-react";
import { getCommunityDetailPath } from "@/lib/community-routes";

export interface AdminCommunityRow {
  recordId: string;
  slug: string;
  name: string;
  category: string;
  visibility: string;
  memberCount: number;
  postCount: number;
}

export function AdminCommunityTable({
  rows,
  searchQuery,
}: {
  rows: AdminCommunityRow[];
  searchQuery?: string;
}) {
  const router = useAppRouter();

  async function handleDelete(recordId: string, name: string) {
    if (!window.confirm(`Delete community "${name}"?`)) return;
    const response = await fetch(`/api/admin/communities/${recordId}`, {
      method: "DELETE",
    });
    if (!response.ok) window.alert("Could not delete.");
    else router.refresh();
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/60">
        {searchQuery
          ? `No communities match “${searchQuery}”.`
          : "No communities yet. Create your first global community."}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Members</th>
            <th className="px-4 py-3 font-medium">Posts</th>
            <th className="px-4 py-3 font-medium">Visibility</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.recordId} className="border-t border-white/8 hover:bg-white/5">
              <td className="px-4 py-3 font-medium text-white">{row.name}</td>
              <td className="px-4 py-3 text-white/70">{row.category}</td>
              <td className="px-4 py-3 text-white/70">{row.memberCount}</td>
              <td className="px-4 py-3 text-white/70">{row.postCount}</td>
              <td className="px-4 py-3 capitalize text-white/70">{row.visibility}</td>
              <td className="px-4 py-3 font-mono text-xs text-white/55">{row.slug}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={getCommunityDetailPath(row.slug)}
                    className="rounded-lg px-2 py-1 text-xs text-brand-pink hover:bg-white/10"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/communities/${row.recordId}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(row.recordId, row.name)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
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
