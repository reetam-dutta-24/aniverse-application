"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton } from "@/components/ui/gradient-button";
import {
  ACCENT_OPTIONS,
  LANGUAGE_OPTIONS,
  SONG_GENRE_OPTIONS,
} from "@/lib/catalog-enums";
import {
  CatalogReviewsEditor,
  Field,
  Section,
  inputClass,
} from "@/components/admin/catalog-nested-fields";
import { EnumMultiSelect, EnumSelect } from "@/components/admin/enum-selectors";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import {
  CatalogSearchPicker,
  type CatalogPickerSelection,
} from "@/components/forms/catalog-search-picker";
import type { MusicFormInput } from "@/lib/validators/admin/music";

export interface MusicFormProps {
  mode: "create" | "edit";
  recordId?: string;
  initial: MusicFormInput;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const kinds = ["song", "ost", "album"] as const;

export function MusicForm({ mode, recordId, initial }: MusicFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<MusicFormInput>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const artistSelection = useMemo<CatalogPickerSelection | null>(() => {
    if (!form.artistSlug) return null;
    return {
      id: form.artistSlug,
      type: "artist",
      title: form.artist || form.artistSlug,
    };
  }, [form.artist, form.artistSlug]);

  const sourceSelection = useMemo<CatalogPickerSelection | null>(() => {
    if (!form.contentSlug) return null;
    return {
      id: form.contentSlug,
      type: "content",
      title: form.source || form.contentSlug,
    };
  }, [form.contentSlug, form.source]);

  function update<K extends keyof MusicFormInput>(key: K, value: MusicFormInput[K]) {
    setForm((c) => ({ ...c, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const url = mode === "create" ? "/api/admin/music" : `/api/admin/music/${recordId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not save track.");
        return;
      }
      router.push("/admin/music");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-6">
      <p className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-xs text-cyan-100/80">
        KPI stats (Liked By, Currently Listening, Played By, AI Match %) are computed from user activity — not entered here.
      </p>

      <Section title="Basics">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (!slugTouched) update("slug", slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field label="Native title">
            <input className={inputClass} value={form.nativeTitle ?? ""} onChange={(e) => update("nativeTitle", e.target.value)} />
          </Field>
          <Field label="Slug">
            <input
              className={inputClass}
              value={form.slug}
              onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }}
              required
            />
          </Field>
          <Field label="Kind">
            <select className={inputClass} value={form.kind} onChange={(e) => update("kind", e.target.value as MusicFormInput["kind"])}>
              {kinds.map((k) => <option key={k} value={k} className="bg-[#1a0d2e]">{k}</option>)}
            </select>
          </Field>
          <Field label="Artist credit">
            <input className={inputClass} value={form.artist} onChange={(e) => update("artist", e.target.value)} required />
          </Field>
          <Field label="Artist" hint="Search and link to an artist profile in Artist CMS">
            <CatalogSearchPicker
              allowedTypes={["artist"]}
              value={artistSelection}
              onChange={(selection) => {
                update("artistSlug", selection?.id ?? "");
                if (selection?.title) update("artist", selection.title);
              }}
              placeholder="Search artists…"
              adminSearch
              resultLimit={40}
            />
          </Field>
          <Field label="Rating">
            <input className={inputClass} type="number" min={0} max={10} step={0.1} value={form.rating ?? ""} onChange={(e) => update("rating", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Year">
            <input className={inputClass} type="number" value={form.year ?? ""} onChange={(e) => update("year", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <Field label="Duration" hint='e.g. "3:45"'>
            <input className={inputClass} value={form.durationLabel ?? ""} onChange={(e) => update("durationLabel", e.target.value)} />
          </Field>
          <Field label="Duration (seconds)">
            <input className={inputClass} type="number" value={form.durationSeconds ?? ""} onChange={(e) => update("durationSeconds", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <EnumSelect
            label="Language"
            value={form.language ?? ""}
            options={LANGUAGE_OPTIONS}
            onChange={(language) =>
              update("language", language as MusicFormInput["language"])
            }
          />
          <EnumMultiSelect
            label="Genres"
            values={form.genreLabels}
            options={SONG_GENRE_OPTIONS}
            onChange={(genreLabels) => update("genreLabels", genreLabels)}
          />
          <Field label="Album">
            <input className={inputClass} value={form.album ?? ""} onChange={(e) => update("album", e.target.value)} />
          </Field>
          <Field label="Source show">
            <input className={inputClass} value={form.source ?? ""} onChange={(e) => update("source", e.target.value)} placeholder="Demon Slayer" />
          </Field>
          <Field label="Source content" hint="Search and link to the anime or movie this track is from">
            <CatalogSearchPicker
              allowedTypes={["content"]}
              value={sourceSelection}
              onChange={(selection) => {
                update("contentSlug", selection?.id ?? "");
                if (selection?.title) update("source", selection.title);
              }}
              placeholder="Search anime, movies, shows…"
              adminSearch
              resultLimit={40}
            />
          </Field>
          <Field label="Trending label">
            <input className={inputClass} value={form.trendingLabel ?? ""} onChange={(e) => update("trendingLabel", e.target.value)} />
          </Field>
          <Field label="Credit label">
            <input className={inputClass} value={form.creditLabel ?? ""} onChange={(e) => update("creditLabel", e.target.value)} />
          </Field>
          <Field label="Featured rank" hint="Lower = shown in artist trending (1–100)">
            <input className={inputClass} type="number" min={1} max={100} value={form.featuredRank ?? ""} onChange={(e) => update("featuredRank", e.target.value ? Number(e.target.value) : undefined)} />
          </Field>
          <EnumSelect
            label="Accent"
            hint="Drives hero glow and stat card colors on the song detail page"
            value={form.accent ?? ""}
            options={ACCENT_OPTIONS}
            onChange={(accent) =>
              update("accent", (accent || undefined) as MusicFormInput["accent"])
            }
          />
        </div>
      </Section>

      <Section title="Media">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Cover image" hint="Use high-resolution images for sharp detail pages">
            <ImageUploadInput
              value={form.imageUrl ?? ""}
              onChange={(value) => update("imageUrl", value)}
              inputClassName={inputClass}
            />
          </Field>
          <Field label="Backdrop">
            <ImageUploadInput
              value={form.backdropUrl ?? ""}
              onChange={(value) => update("backdropUrl", value)}
              inputClassName={inputClass}
            />
          </Field>
        </div>
        <Field label="Description / synopsis">
          <textarea className={`${inputClass} min-h-32 py-2`} value={form.description ?? ""} onChange={(e) => update("description", e.target.value)} />
        </Field>
        <Field label="Lyrics" hint="One line per lyric. Shown 4 lines at a time during playlist playback.">
          <textarea
            className={`${inputClass} min-h-40 py-2 font-mono text-xs leading-relaxed`}
            value={form.lyrics ?? ""}
            onChange={(e) => update("lyrics", e.target.value)}
            placeholder={"Line 1 of the song…\nLine 2…\nLine 3…"}
          />
        </Field>
      </Section>

      <CatalogReviewsEditor reviews={form.catalogReviews} onChange={(catalogReviews) => update("catalogReviews", catalogReviews)} />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <div className="flex gap-3">
        <GradientButton type="submit" disabled={pending} className="rounded-full px-6">
          {pending ? "Saving…" : mode === "create" ? "Create track" : "Save changes"}
        </GradientButton>
        <button type="button" onClick={() => router.back()} className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 hover:bg-white/10">Cancel</button>
      </div>
    </form>
  );
}
