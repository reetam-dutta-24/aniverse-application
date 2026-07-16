"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { detailHeroBtnBase } from "@/lib/detail-route-ui";

interface AddCollectionCollaboratorButtonProps {
  collectionSlug: string;
  canManage?: boolean;
}

export function AddCollectionCollaboratorButton({
  collectionSlug,
  canManage = false,
}: AddCollectionCollaboratorButtonProps) {
  const [open, setOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>();

  if (!canManage) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(undefined);
    try {
      const response = await fetch(
        `/api/collections/${encodeURIComponent(collectionSlug)}/collaborators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle: handle.trim() }),
        },
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Could not add collaborator.",
        );
      }
      setMessage(
        data.added
          ? `Added ${data.collaborator?.name ?? handle} as collaborator.`
          : `${data.collaborator?.name ?? handle} is already a collaborator.`,
      );
      setHandle("");
      setOpen(false);
    } catch (submitError) {
      setMessage(
        submitError instanceof Error
          ? submitError.message
          : "Could not add collaborator.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={detailHeroBtnBase(
          "border-transparent bg-gradient-to-r from-blue-600 to-violet-600 text-white",
        )}
      >
        <Plus className="size-3.5 shrink-0" />
        <span className="truncate">Add Collaborators</span>
      </button>
      {open ? (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="mt-2 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/60 p-3"
        >
          <input
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
            placeholder="User handle"
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-pink/80 px-3 py-2 text-xs font-semibold text-white"
          >
            {loading ? "Adding…" : "Add"}
          </button>
        </form>
      ) : null}
      {message ? (
        <p className="mt-1 text-center text-[10px] text-white/70">{message}</p>
      ) : null}
    </div>
  );
}
