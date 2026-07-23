import { ProfileActivityCarouselSection } from "@/components/profile/profile-activity-carousel-section";
import type { ProfileRecentActivityItem } from "@/types";

export interface ProfileRecentActivitySectionProps {
  userName: string;
  activitySubtitle?: string;
  items: ProfileRecentActivityItem[];
}

/** Full-width recent activity block below the profile hero. */
export function ProfileRecentActivitySection({
  userName,
  activitySubtitle,
  items,
}: ProfileRecentActivitySectionProps) {
  return (
    <ProfileActivityCarouselSection
      userName={userName}
      activitySubtitle={activitySubtitle}
      items={items}
    />
  );
}
