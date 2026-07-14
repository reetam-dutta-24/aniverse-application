"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { AdminContentRow } from "@/components/admin/types";
import { getContentDetailPath } from "@/lib/content-routes";

export function AdminContentTable({ rows }: { rows: AdminContentRow[] }) {
  const router = useRouter();

  async function handleDelete(recordId: string, title: string) {
    if (!window.confirm(`Delete "${title}" from the catalog?`)) return;

    const response = await fetch(`/api/admin/content/${recordId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Could not delete this item.");
      return;
    }

    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/60">
        No catalog content yet. Create your first title to replace mock data.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/50">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Genres</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ recordId, item }) => (
            <tr
              key={recordId}
              className="border-t border-white/8 hover:bg-white/5"
            >
              <td className="px-4 py-3 font-medium text-white">{item.title}</td>
              <td className="px-4 py-3 capitalize text-white/70">{item.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-white/55">
                {item.id}
              </td>
              <td className="px-4 py-3 text-white/65">
                {item.genres.map((g) => g.label).join(", ") || "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={getContentDetailPath(item.id)}
                    className="rounded-lg px-2 py-1 text-xs text-brand-pink hover:bg-white/10"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/content/${recordId}/edit`}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(recordId, item.title)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
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
