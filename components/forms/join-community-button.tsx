"use client";

import { useState } from "react";
import { useAppRouter } from "@/hooks/use-app-router";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CatalogSearchPicker,
  type CatalogPickerSelection,
} from "@/components/forms/catalog-search-picker";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
} from "@/components/forms/form-shell";

export function JoinCommunityButton() {
  const router = useAppRouter();
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<CatalogPickerSelection | null>(null);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setSelection(null);
    setError(undefined);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selection || selection.type !== "community") {
      setError("Search and select a community to join.");
      return;
    }

    setLoading(true);
    setError(undefined);

    const response = await fetch(`/api/communities/${selection.id}/join`, {
      method: "POST",
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not join community.");
      return;
    }

    setOpen(false);
    resetForm();
    router.refresh();
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full rounded-full border-brand-magenta px-4 sm:w-auto"
        onClick={() => setOpen(true)}
      >
        <KeyRound className="me-1.5 size-4 text-brand-magenta" />
        Join Community
      </Button>

      <FormShell
        open={open}
        title="Join Community"
        description="Search for a community and join with one click."
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Search & select">
            <CatalogSearchPicker
              allowedTypes={["community"]}
              value={selection}
              onChange={setSelection}
              placeholder="Search communities…"
            />
          </FormField>

          <FormError message={error} />
          <FormActions
            onCancel={() => {
              setOpen(false);
              resetForm();
            }}
            submitLabel="Join Community"
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
