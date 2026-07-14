"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientButton } from "@/components/ui/gradient-button";
import type { ContentFormInput } from "@/lib/validators/admin/content";

const mediaTypes = [
  "anime",
  "show",
  "movie",
  "documentary",
  "kdrama",
  "song",
  "album",
  "artist",
  "playlist",
] as const;

const accents = ["pink", "purple", "cyan", "blue", "green", "yellow"] as const;

export interface ContentFormProps {
  mode: "create" | "edit";
  contentId?: string;
  initial: ContentFormInput;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-white/55">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-white/35 focus:border-brand-magenta focus:outline-none";

/** Admin form for creating and editing catalog content. */
export function ContentForm({ mode, contentId, initial }: ContentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ContentFormInput>(initial);
  const [genreInput, setGenreInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function update<K extends keyof ContentFormInput>(
    key: K,
    value: ContentFormInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addGenre() {
    const label = genreInput.trim();
    if (!label) return;
    if (form.genreLabels.includes(label)) return;
    update("genreLabels", [...form.genreLabels, label]);
    setGenreInput("");
  }

  function removeGenre(label: string) {
    update(
      "genreLabels",
      form.genreLabels.filter((g) => g !== label),
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const url =
        mode === "create"
          ? "/api/admin/content"
          : `/api/admin/content/${contentId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not save content.");
        return;
      }

      router.push("/admin/content");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title">
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              update("title", title);
              if (!slugTouched) update("slug", slugify(title));
            }}
            required
          />
        </Field>

        <Field label="Slug (URL)">
          <input
            className={inputClass}
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
            required
          />
        </Field>

        <Field label="Type">
          <select
            className={inputClass}
            value={form.type}
            onChange={(e) =>
              update("type", e.target.value as ContentFormInput["type"])
            }
          >
            {mediaTypes.map((type) => (
              <option key={type} value={type} className="bg-[#1a0d2e]">
                {type}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Accent">
          <select
            className={inputClass}
            value={form.accent ?? ""}
            onChange={(e) =>
              update(
                "accent",
                (e.target.value || undefined) as ContentFormInput["accent"],
              )
            }
          >
            <option value="" className="bg-[#1a0d2e]">
              None
            </option>
            {accents.map((accent) => (
              <option key={accent} value={accent} className="bg-[#1a0d2e]">
                {accent}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Rating (0–10)">
          <input
            className={inputClass}
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={form.rating ?? ""}
            onChange={(e) =>
              update(
                "rating",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </Field>

        <Field label="Year">
          <input
            className={inputClass}
            type="number"
            min={1900}
            max={2100}
            value={form.year ?? ""}
            onChange={(e) =>
              update("year", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </Field>
      </div>

      <Field label="Meta (e.g. 4 Seasons, Film)">
        <input
          className={inputClass}
          value={form.meta ?? ""}
          onChange={(e) => update("meta", e.target.value)}
        />
      </Field>

      <Field label="Poster image URL">
        <input
          className={inputClass}
          value={form.imageUrl ?? ""}
          onChange={(e) => update("imageUrl", e.target.value)}
          placeholder="https://… or /images/posters/slug.jpg"
        />
      </Field>

      <Field label="Short description">
        <textarea
          className={`${inputClass} min-h-24 py-2`}
          value={form.description ?? ""}
          onChange={(e) => update("description", e.target.value)}
        />
      </Field>

      <Field label="Synopsis (detail page)">
        <textarea
          className={`${inputClass} min-h-32 py-2`}
          value={form.synopsis ?? ""}
          onChange={(e) => update("synopsis", e.target.value)}
        />
      </Field>

      <Field label="Genres">
        <div className="flex gap-2">
          <input
            className={`${inputClass} flex-1`}
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGenre();
              }
            }}
            placeholder="Action, Drama…"
          />
          <button
            type="button"
            onClick={addGenre}
            className="cursor-pointer rounded-xl border border-white/20 px-4 text-sm font-medium text-white hover:bg-white/10"
          >
            Add
          </button>
        </div>
        {form.genreLabels.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.genreLabels.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => removeGenre(genre)}
                className="cursor-pointer rounded-full bg-white/10 px-3 py-1 text-xs text-white hover:bg-red-500/20"
              >
                {genre} ×
              </button>
            ))}
          </div>
        ) : null}
      </Field>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <GradientButton type="submit" disabled={pending} className="rounded-full px-6">
          {pending ? "Saving…" : mode === "create" ? "Create content" : "Save changes"}
        </GradientButton>
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
