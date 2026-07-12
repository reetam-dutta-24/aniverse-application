import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityDashboardSectionContent } from "@/components/community/community-dashboard-section-content";
import {
  COMMUNITY_DASHBOARD_SECTIONS,
  isCommunityDashboardSection,
} from "@/lib/community-routes";
import {
  getAllCommunityIds,
  getCommunityDetail,
} from "@/lib/data/community-detail";

interface CommunityDashboardSectionPageProps {
  params: Promise<{ communityid: string; section: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllCommunityIds();
  return ids.flatMap((communityid) =>
    COMMUNITY_DASHBOARD_SECTIONS.map((section) => ({
      communityid,
      section,
    })),
  );
}

export async function generateMetadata({
  params,
}: CommunityDashboardSectionPageProps): Promise<Metadata> {
  const { communityid, section } = await params;
  const community = await getCommunityDetail(communityid);
  if (!community || !isCommunityDashboardSection(section)) {
    return { title: "Community Dashboard — AniVerse" };
  }

  const navLabel =
    community.dashboardNav.find((item) => item.id === section)?.label ?? section;

  return {
    title: `${community.name} — ${navLabel} — AniVerse`,
  };
}

export default async function CommunityDashboardSectionPage({
  params,
}: CommunityDashboardSectionPageProps) {
  const { communityid, section } = await params;

  if (!isCommunityDashboardSection(section)) notFound();

  const community = await getCommunityDetail(communityid);
  if (!community) notFound();

  return (
    <CommunityDashboardSectionContent section={section} community={community} />
  );
}
