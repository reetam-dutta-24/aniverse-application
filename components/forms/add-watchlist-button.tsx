"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
  SelectInput,
  TextInput,
} from "@/components/forms/form-shell";
import { slugify } from "@/lib/slugify";

export function AddWatchlistButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [contentSlug, setContentSlug] = useState("");
  const [priority, setPriority] = useState<"NORMAL" | "HIGH">("NORMAL");
  const [status, setStatus] = useState<
    "PENDING" | "WATCHING" | "COMPLETED" | "DROPPED"
  >("PENDING");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const slugPreview = useMemo(
    () => slugify(contentSlug || "content-slug"),
    [contentSlug],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentSlug: slugPreview,
        priority,
        status,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not add to watchlist.");
      return;
    }

    setOpen(false);
    setContentSlug("");
    router.refresh();
  }

  return (
    <>
      <GradientButton
        size="sm"
        className="w-full rounded-full px-4 sm:w-auto"
        onClick={() => setOpen(true)}
      >
        <Plus className="me-1.5 size-4" />
        Add To Watchlist
      </GradientButton>

      <FormShell
        open={open}
        title="Add to Watchlist"
        description="Save catalog content by slug — e.g. jujutsu-kaisen, demon-slayer."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Content slug"
            hint={`Will save as ${slugPreview || "…"}`}
          >
            <TextInput
              value={contentSlug}
              onChange={(event) => setContentSlug(event.target.value)}
              placeholder="jujutsu-kaisen"
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Priority">
              <SelectInput
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as "NORMAL" | "HIGH")
                }
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High Priority</option>
              </SelectInput>
            </FormField>
            <FormField label="Status">
              <SelectInput
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "PENDING"
                      | "WATCHING"
                      | "COMPLETED"
                      | "DROPPED",
                  )
                }
              >
                <option value="PENDING">Pending</option>
                <option value="WATCHING">Watching</option>
                <option value="COMPLETED">Completed</option>
                <option value="DROPPED">Dropped</option>
              </SelectInput>
            </FormField>
          </div>

          <FormError message={error} />
          <FormActions
            onCancel={() => setOpen(false)}
            submitLabel="Add to Watchlist"
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
