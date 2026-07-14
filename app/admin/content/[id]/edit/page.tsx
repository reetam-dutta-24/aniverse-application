import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth-guards";
import { prismaMediaTypeToApp } from "@/lib/mappers/content.mapper";
import { getContentRecordById } from "@/lib/services/content.service";

export const metadata: Metadata = {
  title: "Edit content — Admin — AniVerse",
  robots: { index: false, follow: false },
};

interface EditContentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditContentPage({ params }: EditContentPageProps) {
  await requireAdmin();
  const { id } = await params;
  const row = await getContentRecordById(id);
  if (!row) notFound();

  const initial = {
    title: row.title,
    slug: row.slug,
    type: prismaMediaTypeToApp(row.type),
    description: row.description ?? "",
    synopsis: row.synopsis ?? "",
    imageUrl: row.imageUrl ?? "",
    rating: row.rating ?? undefined,
    year: row.year ?? undefined,
    meta: row.meta ?? "",
    accent: (row.accent as
      | "pink"
      | "purple"
      | "cyan"
      | "blue"
      | "green"
      | "yellow"
      | undefined) ?? undefined,
    genreLabels: row.genres.map((g) => g.genre.label),
  };

  return (
    <AdminShell>
      <div className="flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit content</h1>
          <p className="mt-1 text-sm text-white/60">{row.title}</p>
        </div>
        <ContentForm mode="edit" contentId={id} initial={initial} />
      </div>
    </AdminShell>
  );
}
