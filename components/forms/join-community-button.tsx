"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
  TextInput,
} from "@/components/forms/form-shell";
import { slugify } from "@/lib/slugify";

export function JoinCommunityButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const communitySlug = slugify(slug);
    const response = await fetch(`/api/communities/${communitySlug}/join`, {
      method: "POST",
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not join community.");
      return;
    }

    setOpen(false);
    setSlug("");
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
        Join Community with Code
      </Button>

      <FormShell
        open={open}
        title="Join Community"
        description="Enter the community slug — e.g. global-anime-community."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Community slug">
            <TextInput
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="global-anime-community"
              required
            />
          </FormField>

          <FormError message={error} />
          <FormActions
            onCancel={() => setOpen(false)}
            submitLabel="Join Community"
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
