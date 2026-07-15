"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { CollectionDetail } from "@/types";
import { DeleteCollectionButton } from "@/components/forms/delete-collection-button";
import { EditCollectionButton } from "@/components/forms/edit-collection-button";
import {
  heroDeleteActionClass,
  heroEditActionClass,
} from "@/lib/form-action-styles";

export function CollectionDetailOwnerActions({
  collection,
}: {
  collection: CollectionDetail;
}) {
  const editValues = {
    slug: collection.id,
    name: collection.name,
    description: collection.description,
    category: collection.category,
    genreLabelIds: collection.genreLabelIds,
    collectionKind: collection.collectionKind,
    visibility: collection.visibility,
    accent: collection.accent,
    imageUrl: collection.imageUrl,
  };

  return (
    <>
      <EditCollectionButton
        collection={editValues}
        trigger={
          <button type="button" className={heroEditActionClass}>
            <Pencil className="size-3.5" />
            Edit
          </button>
        }
      />
      <DeleteCollectionButton
        collectionSlug={collection.id}
        collectionName={collection.name}
        trigger={
          <button type="button" className={heroDeleteActionClass}>
            <Trash2 className="size-3.5" />
            Delete
          </button>
        }
      />
    </>
  );
}
