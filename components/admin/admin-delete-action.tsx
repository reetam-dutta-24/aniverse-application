"use client";

import { useState } from "react";
import { useAppRouter } from "@/hooks/use-app-router";
import { Trash2 } from "lucide-react";
import { FormShell } from "@/components/forms/form-shell";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/lib/utils";

export interface AdminDeleteActionProps {
  itemLabel: string;
  deleteUrl: string;
  entityName?: string;
  description?: string;
  onDeleted?: () => void;
  className?: string;
}

/** Inline admin table delete — uses an in-app confirm dialog (window.confirm is blocked in some browsers). */
export function AdminDeleteAction({
  itemLabel,
  deleteUrl,
  entityName = "item",
  description,
  onDeleted,
  className,
}: AdminDeleteActionProps) {
  const router = useAppRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function handleDelete() {
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(deleteUrl, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `Could not delete this ${entityName}.`);
        return;
      }

      setOpen(false);
      onDeleted?.();
      router.refresh();
    } catch {
      setError(`Could not delete this ${entityName}. Check your connection.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={cn(
          "inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs text-red-400 hover:bg-red-500/10",
          className,
        )}
      >
        <Trash2 className="size-3.5" />
        Delete
      </button>

      <FormShell
        open={open}
        title={`Delete ${entityName}`}
        description={
          description ??
          `Permanently remove "${itemLabel}" from the catalog. This cannot be undone.`
        }
        onClose={() => !loading && setOpen(false)}
        className="max-w-md"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-white/75">
            Are you sure you want to delete <strong className="text-white">{itemLabel}</strong>?
          </p>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <GradientButton
              size="sm"
              className="rounded-full border border-red-600 bg-red-600 px-5 hover:bg-red-500"
              disabled={loading}
              onClick={() => void handleDelete()}
            >
              {loading ? "Deleting…" : "Delete"}
            </GradientButton>
          </div>
        </div>
      </FormShell>
    </>
  );
}
