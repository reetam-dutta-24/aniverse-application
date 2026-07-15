"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import {
  FormActions,
  FormError,
  FormField,
  FormShell,
  SelectInput,
  TextArea,
  TextInput,
} from "@/components/forms/form-shell";
import { ACCENT_OPTIONS } from "@/lib/catalog-enums";
import { communityCategories } from "@/lib/validators/community";
import { slugify } from "@/lib/slugify";

export function CreateCommunityButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] =
    useState<(typeof communityCategories)[number]>("Anime");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [activityLevel, setActivityLevel] = useState<
    "very-active" | "active" | "moderate" | "quiet"
  >("active");
  const [accent, setAccent] = useState("cyan");
  const [imageUrl, setImageUrl] = useState("");
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const slugPreview = useMemo(
    () => slug.trim() || slugify(name || "my-community"),
    [name, slug],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const response = await fetch("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slugPreview,
        category,
        description,
        visibility,
        activityLevel,
        accent,
        imageUrl: imageUrl || undefined,
        wallpaperUrl: wallpaperUrl || undefined,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not create community.");
      return;
    }

    setOpen(false);
    setName("");
    setSlug("");
    setDescription("");
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
        Create Community
      </GradientButton>

      <FormShell
        open={open}
        title="Create Community"
        description="Launch a fan space with posts, members, and discovery metadata."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Name">
            <TextInput
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Global Anime Community"
              required
            />
          </FormField>

          <FormField label="Slug" hint={`URL: /community/${slugPreview}`}>
            <TextInput
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder={slugPreview}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <SelectInput
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as (typeof communityCategories)[number])
                }
              >
                {communityCategories.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </SelectInput>
            </FormField>
            <FormField label="Visibility">
              <SelectInput
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as "PUBLIC" | "PRIVATE")
                }
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </SelectInput>
            </FormField>
          </div>

          <FormField label="Description">
            <TextArea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Discuss anime, share recommendations, and host watch parties."
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Activity level">
              <SelectInput
                value={activityLevel}
                onChange={(event) =>
                  setActivityLevel(
                    event.target.value as
                      | "very-active"
                      | "active"
                      | "moderate"
                      | "quiet",
                  )
                }
              >
                <option value="very-active">Very Active</option>
                <option value="active">Active</option>
                <option value="moderate">Moderate</option>
                <option value="quiet">Quiet</option>
              </SelectInput>
            </FormField>
            <FormField label="Accent">
              <SelectInput
                value={accent}
                onChange={(event) => setAccent(event.target.value)}
              >
                {ACCENT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </FormField>
          </div>

          <FormField label="Card image">
            <ImageUploadInput
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="Or paste an image URL"
            />
          </FormField>

          <FormField label="Wallpaper">
            <ImageUploadInput
              value={wallpaperUrl}
              onChange={setWallpaperUrl}
              placeholder="Or paste a wallpaper URL"
            />
          </FormField>

          <FormError message={error} />
          <FormActions
            onCancel={() => setOpen(false)}
            submitLabel="Create Community"
            loading={loading}
          />
        </form>
      </FormShell>
    </>
  );
}
