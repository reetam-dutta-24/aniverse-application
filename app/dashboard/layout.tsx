import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireCompletedOnboarding } from "@/lib/auth-guards";
import { isPlatformAdmin } from "@/lib/platform-roles";
import { getUserById } from "@/lib/services/user.service";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const userId = await requireCompletedOnboarding();
  const user = await getUserById(userId);

  const dashboardUser = {
    name: user?.name ?? "User",
    handle: user?.handle ?? "user",
    email: user?.email ?? "",
    avatarColor: user?.avatarColor ?? "#ff00cc",
    avatarUrl: user?.avatarUrl ?? undefined,
    isAdmin: user ? isPlatformAdmin(user.role) : false,
  };

  return <DashboardShell user={dashboardUser}>{children}</DashboardShell>;
}
