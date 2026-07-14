import type { Metadata } from "next";
import { ContentForm } from "@/components/admin/content-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth-guards";
import type { ContentFormInput } from "@/lib/validators/admin/content";

export const metadata: Metadata = {
  title: "New content — Admin — AniVerse",
  robots: { index: false, follow: false },
};

const emptyForm: ContentFormInput = {
  title: "",
  slug: "",
  type: "anime",
  description: "",
  synopsis: "",
  imageUrl: "",
  meta: "",
  genreLabels: [],
};

export default async function AdminNewContentPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <div className="flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">New content</h1>
          <p className="mt-1 text-sm text-white/60">
            Add a title to the catalog. It will appear on public detail pages
            once saved.
          </p>
        </div>
        <ContentForm mode="create" initial={emptyForm} />
      </div>
    </AdminShell>
  );
}
