import { redirect } from "next/navigation";
import { getCommunityDashboardPath } from "@/lib/community-routes";

interface CommunityDashboardIndexPageProps {
  params: Promise<{ communityid: string }>;
}

export default async function CommunityDashboardIndexPage({
  params,
}: CommunityDashboardIndexPageProps) {
  const { communityid } = await params;
  redirect(getCommunityDashboardPath(communityid));
}
