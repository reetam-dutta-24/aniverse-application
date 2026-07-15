"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { CommunityDetail } from "@/types";
import { DeleteCommunityButton } from "@/components/forms/delete-community-button";
import { EditCommunityButton } from "@/components/forms/edit-community-button";
import {
  heroDeleteActionClass,
  heroEditActionClass,
} from "@/lib/form-action-styles";

export function CommunityDetailOwnerActions({
  community,
}: {
  community: CommunityDetail;
}) {
  const editValues = {
    slug: community.id,
    name: community.name,
    description: community.description,
    category: community.category,
    visibility: community.visibility,
    activityLevel: community.activityLevel,
    accent: community.accent,
    imageUrl: community.imageUrl,
    wallpaperUrl: community.wallpaperUrl,
  };

  return (
    <>
      {community.canEdit ? (
        <EditCommunityButton
          community={editValues}
          trigger={
            <button type="button" className={heroEditActionClass}>
              <Pencil className="size-3.5" />
              Edit
            </button>
          }
        />
      ) : null}
      {community.canDelete ? (
        <DeleteCommunityButton
          communitySlug={community.id}
          communityName={community.name}
          trigger={
            <button type="button" className={heroDeleteActionClass}>
              <Trash2 className="size-3.5" />
              Delete
            </button>
          }
        />
      ) : null}
    </>
  );
}
