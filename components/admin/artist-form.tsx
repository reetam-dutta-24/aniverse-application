"use client";

import { useState } from "react";
import { useAppRouter } from "@/hooks/use-app-router";
import { useFormDraft } from "@/hooks/use-form-draft";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  ACCENT_OPTIONS,
  ARTIST_GENRE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/lib/catalog-enums";
import {
  BandMembersEditor,
  CatalogReviewsEditor,
  Field,
  Section,
  TagListEditor,
  inputClass,
} from "@/components/admin/catalog-nested-fields";
import { EnumMultiSelect, EnumSelect } from "@/components/admin/enum-selectors";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import type { ArtistFormInput } from "@/lib/validators/admin/artist";

export interface ArtistFormProps {
  mode: "create" | "edit";
  recordId?: string;
  initial: ArtistFormInput;
}

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ArtistForm({ mode, recordId, initial }: ArtistFormProps) {
  const router = useAppRouter();
  const draftKey =
    mode === "create"
      ? "aniverse:admin:artist:create"
      : `aniverse:admin:artist:edit:${recordId}`;
  const { form, setForm, clearDraft, draftRestored } = useFormDraft<ArtistFormInput>(
    draftKey,
    initial,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function update<K extends keyof ArtistFormInput>(key: K, value: ArtistFormInput[K]) {
    setForm((c) => ({ ...c, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const url = mode === "create" ? "/api/admin/artists" : `/api/admin/artists/${recordId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not save artist.");
        return;
      }
      clearDraft();
      router.push("/admin/artists");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-6">
      {draftRestored ? (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs text-amber-100/90">
          Restored your unsaved draft from this browser.
        </p>
      ) : null}
      <p className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-100/80">
        Songs are linked via Music CMS (artist slug). KPI stats and AI Match % come from user activity.
      </p>

      <Section title="Basics">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Artist name">
            <input className={inputClass} value={form.title} onChange={(e) => { update("title", e.target.value); if (!slugTouched) update("slug", slugify(e.target.value)); }} required />
          </Field>
          <Field label="Native name" hint="e.g. 트와이스">
            <input className={inputClass} value={form.nativeTitle ?? ""} onChange={(e) => update("nativeTitle", e.target.value)} />
          </Field>
          <Field label="Slug">
            <input className={inputClass} value={form.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }} required />
          </Field>
          <Field label="Rating">
            <input className={inputClass} type="number" min={0} max={10} step={0.1} value={form.rating ?? ""} onChange={(e) => update("rating", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Rank left" hint='#10 in Kpop music'>
            <input className={inputClass} value={form.rankLeft ?? ""} onChange={(e) => update("rankLeft", e.target.value)} />
          </Field>
          <Field label="Rank right" hint='#1 in your favourite artist'>
            <input className={inputClass} value={form.rankRight ?? ""} onChange={(e) => update("rankRight", e.target.value)} />
          </Field>
          <Field label="Label / agency">
            <input className={inputClass} value={form.label ?? ""} onChange={(e) => update("label", e.target.value)} placeholder="JYP Entertainment" />
          </Field>
          <Field label="Debut year">
            <input className={inputClass} type="number" value={form.debutYear ?? ""} onChange={(e) => update("debutYear", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <EnumSelect
            label="Accent"
            hint="Drives hero glow and stat card colors on the artist detail page"
            value={form.accent ?? ""}
            options={ACCENT_OPTIONS}
            onChange={(accent) =>
              update("accent", (accent || undefined) as ArtistFormInput["accent"])
            }
          />
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={form.isGroup} onChange={(e) => update("isGroup", e.target.checked)} className="size-4" />
            This is a band / group (not solo)
          </label>
        </div>
        <Field label="Bio / synopsis">
          <textarea className={`${inputClass} min-h-32 py-2`} value={form.synopsis ?? ""} onChange={(e) => update("synopsis", e.target.value)} />
        </Field>
        <Field label="Hero image" hint="Group banner or solo artist photo — shown in the right hero panel">
          <ImageUploadInput
            value={form.imageUrl ?? ""}
            onChange={(value) => update("imageUrl", value)}
            inputClassName={inputClass}
          />
        </Field>
        <EnumMultiSelect
          label="Genres"
          values={form.genreLabels}
          options={ARTIST_GENRE_OPTIONS}
          onChange={(genreLabels) => update("genreLabels", genreLabels)}
        />
        <TagListEditor label="Primary tags" items={form.primaryTags} placeholder="Dance Pop, K-pop…" onChange={(primaryTags) => update("primaryTags", primaryTags)} />
        <EnumMultiSelect
          label="Languages"
          values={form.languages}
          options={LANGUAGE_OPTIONS}
          onChange={(languages) => update("languages", languages)}
        />
      </Section>

      {form.isGroup ? (
        <BandMembersEditor members={form.members} onChange={(members) => update("members", members)} />
      ) : null}

      <CatalogReviewsEditor reviews={form.catalogReviews} onChange={(catalogReviews) => update("catalogReviews", catalogReviews)} />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <div className="flex gap-3">
        <GradientButton type="submit" disabled={pending} className="rounded-full px-6">
          {pending ? "Saving…" : mode === "create" ? "Create artist" : "Save changes"}
        </GradientButton>
        <button type="button" onClick={() => router.back()} className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 hover:bg-white/10">Cancel</button>
      </div>
    </form>
  );
}
