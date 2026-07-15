"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
  TextInput,
} from "@/components/forms/form-shell";
import { slugify } from "@/lib/slugify";

export function AddCollectionItemButton({
  collectionSlug,
}: {
  collectionSlug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [contentSlug, setContentSlug] = useState("");
  const [trackSlug, setTrackSlug] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const response = await fetch(`/api/collections/${collectionSlug}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentSlug: contentSlug ? slugify(contentSlug) : undefined,
        trackSlug: trackSlug ? slugify(trackSlug) : undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not add item.");
      return;
    }

    setOpen(false);
    setContentSlug("");
    setTrackSlug("");
    router.refresh();
  }

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
        title="Add Collection Item"
        description="Add catalog content or a music track by slug."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Content slug">
            <TextInput
              value={contentSlug}
              onChange={(event) => setContentSlug(event.target.value)}
              placeholder="death-note"
            />
          </FormField>

          <FormField label="Track slug">
            <TextInput
              value={trackSlug}
              onChange={(event) => setTrackSlug(event.target.value)}
              placeholder="gurenge"
            />
          </FormField>

          <FormError message={error} />
          <FormActions
            onCancel={() => setOpen(false)}
            submitLabel="Add Item"
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
