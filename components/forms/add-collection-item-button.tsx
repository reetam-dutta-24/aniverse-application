"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  CatalogMultiSearchPicker,
  type CatalogPickerSelection,
} from "@/components/forms/catalog-search-picker";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
} from "@/components/forms/form-shell";
import type { SearchResultType } from "@/lib/search/types";

export function AddCollectionItemButton({
  collectionSlug,
  collectionKind = "content",
}: {
  collectionSlug: string;
  collectionKind?: "content" | "music";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slugs, setSlugs] = useState<string[]>([]);
  const [selections, setSelections] = useState<CatalogPickerSelection[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const allowedTypes: SearchResultType[] =
    collectionKind === "music" ? ["song"] : ["content", "song"];

  const searchPlaceholder =
    collectionKind === "music"
      ? "Search songs, OSTs, albums…"
      : "Search anime, movies, shows, music…";

  function resetForm() {
    setSlugs([]);
    setSelections([]);
    setError(undefined);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (selections.length === 0) {
      setError("Search and select at least one item to add.");
      return;
    }

    setLoading(true);
    setError(undefined);

    const failures: string[] = [];

    for (const selection of selections) {
      const body =
        selection.type === "song"
          ? { trackSlug: selection.id }
          : selection.type === "content"
            ? { contentSlug: selection.id }
            : null;

      if (!body) {
        failures.push(selection.title);
        continue;
      }

      const response = await fetch(`/api/collections/${collectionSlug}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        failures.push(
          typeof data.error === "string"
            ? `${selection.title}: ${data.error}`
            : selection.title,
        );
      }
    }

    setLoading(false);

    if (failures.length === selections.length) {
      setError(failures[0] ?? "Could not add items.");
      return;
    }

    if (failures.length > 0) {
      setError(`Some items could not be added: ${failures.join("; ")}`);
    }

    setOpen(false);
    resetForm();
    router.refresh();
  }

  const submitLabel =
    selections.length > 1
      ? `Add ${selections.length} Items`
      : "Add to Collection";

  return (
    <>
      <GradientButton
        size="sm"
        className="gap-1.5 rounded-full px-5"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Add New Item
      </GradientButton>

      <FormShell
        open={open}
        title="Add to Collection"
        description="Search and pick multiple titles — keep searching to add more before submitting."
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Search & add items">
            <CatalogMultiSearchPicker
              allowedTypes={allowedTypes}
              values={slugs}
              onChange={setSlugs}
              onSelectionsChange={setSelections}
              placeholder={searchPlaceholder}
            />
          </FormField>

          <FormError message={error} />
          <FormActions
            onCancel={() => {
              setOpen(false);
              resetForm();
            }}
            submitLabel={submitLabel}
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
