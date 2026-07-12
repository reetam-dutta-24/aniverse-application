import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CommunityDashboardShell } from "@/components/community/community-dashboard-shell";
import { getCommunityDetail } from "@/lib/data/community-detail";

interface CommunityDashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ communityid: string }>;
}

export async function generateMetadata({
  params,
}: CommunityDashboardLayoutProps): Promise<Metadata> {
  const { communityid } = await params;
  const community = await getCommunityDetail(communityid);
  if (!community) return { title: "Community Dashboard — AniVerse" };
  return {
    title: `${community.name} Dashboard — AniVerse`,
    description: `Community dashboard for ${community.name}`,
  };
}

export default async function CommunityDashboardLayout({
  children,
  params,
}: CommunityDashboardLayoutProps) {
  const { communityid } = await params;
  const community = await getCommunityDetail(communityid);
  if (!community) notFound();

  return (
    <CommunityDashboardShell
      communityId={community.id}
      communityName={community.name}
      navItems={community.dashboardNav}
      onlineMembers={community.onlineMembers}
    >
      {children}
    </CommunityDashboardShell>
  );
}
