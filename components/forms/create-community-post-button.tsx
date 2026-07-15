"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
  TextArea,
} from "@/components/forms/form-shell";

export function CreateCommunityPostButton({
  communitySlug,
}: {
  communitySlug: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const response = await fetch(`/api/communities/${communitySlug}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        imageUrl: imageUrl || undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not create post.");
      return;
    }

    setOpen(false);
    setContent("");
    setImageUrl("");
    router.refresh();
  }

  return (
    <>
      <GradientButton
        size="sm"
        className="h-8 gap-1 rounded-full px-4 text-xs"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-3.5" />
        Create Post
      </GradientButton>

      <FormShell
        open={open}
        title="Create Post"
        description="Share an update with the community."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Content">
            <TextArea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What do you want to share?"
              required
            />
          </FormField>

          <FormField label="Image (optional)">
            <ImageUploadInput
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="Or paste an image URL"
            />
          </FormField>

          <FormError message={error} />
          <FormActions
            onCancel={() => setOpen(false)}
            submitLabel="Publish Post"
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
